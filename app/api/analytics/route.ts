// app/api/analytics/route.ts - Enhanced Analytics with Real Data
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        type RangeType = '1d' | '7d' | '30d' | '90d';
        const range = (searchParams.get('range') as RangeType) || '7d';

        // Calculate date ranges
        const now = new Date();
        const ranges: Record<RangeType, Date> = {
            '1d': new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
            '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        };

        const startDate = ranges[range] || ranges['7d'];
        const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Run all analytics queries in parallel
        const [
            // Basic counts
            totalVisitors,
            todayVisitors,
            weeklyVisitors,
            monthlyVisitors,
            totalPageViews,
            totalMessages,
            unreadMessages,
            totalProjects,
            publishedPosts,

            // Detailed analytics
            recentVisitors,
            topCountries,
            deviceStats,
            browserStats,
            dailyPageViews,
            hourlyPageViews,
            topPages,
            topProjects,
            topBlogPosts,
            recentMessages,
            averageSessionTime,
            bounceRate,
            recentActivity
        ] = await Promise.all([
            // Basic counts
            db.visitor.count(),
            db.visitor.count({ where: { lastVisit: { gte: oneDayAgo } } }),
            db.visitor.count({ where: { lastVisit: { gte: oneWeekAgo } } }),
            db.visitor.count({ where: { lastVisit: { gte: oneMonthAgo } } }),
            db.pageView.count({ where: { timestamp: { gte: startDate } } }),
            db.contactSubmission.count(),
            db.contactSubmission.count({ where: { status: 'new' } }),
            db.project.count({ where: { isActive: true } }),
            db.blogPost.count({ where: { isPublished: true } }),

            // Detailed visitor data
            db.visitor.findMany({
                where: { lastVisit: { gte: startDate } },
                orderBy: { lastVisit: 'desc' },
                take: 50,
                select: {
                    id: true,
                    ip: true,
                    country: true,
                    region: true,
                    city: true,
                    visits: true,
                    lastVisit: true,
                    userAgent: true,
                    createdAt: true
                }
            }),

            // Geographic data
            db.pageView.groupBy({
                by: ['country'],
                _count: { country: true },
                where: {
                    country: { not: null },
                    timestamp: { gte: startDate }
                },
                orderBy: { _count: { country: 'desc' } },
                take: 10
            }),

            // Device statistics
            db.pageView.groupBy({
                by: ['device'],
                _count: { device: true },
                where: {
                    device: { not: null },
                    timestamp: { gte: startDate }
                },
                orderBy: { _count: { device: 'desc' } }
            }),

            // Browser statistics
            db.pageView.groupBy({
                by: ['browser'],
                _count: { browser: true },
                where: {
                    browser: { not: null },
                    timestamp: { gte: startDate }
                },
                orderBy: { _count: { browser: 'desc' } },
                take: 5
            }),

            // Daily page views for charts
            generateDailyStats(startDate, now),

            // Hourly page views for today
            generateHourlyStats(oneDayAgo, now),

            // Top pages
            db.pageView.groupBy({
                by: ['page', 'title'],
                _count: { page: true },
                where: { timestamp: { gte: startDate } },
                orderBy: { _count: { page: 'desc' } },
                take: 10
            }),

            // Top projects by views
            db.project.findMany({
                where: {
                    isActive: true,
                    projectViews: {
                        some: { timestamp: { gte: startDate } }
                    }
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    status: true,
                    featured: true,
                    _count: {
                        select: {
                            projectViews: {
                                where: { timestamp: { gte: startDate } }
                            }
                        }
                    }
                },
                orderBy: {
                    projectViews: { _count: 'desc' }
                },
                take: 5
            }),

            // Top blog posts by views
            db.blogPost.findMany({
                where: {
                    isPublished: true,
                    blogViews: {
                        some: { timestamp: { gte: startDate } }
                    }
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    views: true,
                    publishedAt: true,
                    _count: {
                        select: {
                            blogViews: {
                                where: { timestamp: { gte: startDate } }
                            }
                        }
                    }
                },
                orderBy: {
                    blogViews: { _count: 'desc' }
                },
                take: 5
            }),

            // Recent messages
            db.contactSubmission.findMany({
                orderBy: { createdAt: 'desc' },
                take: 10,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    message: true,
                    status: true,
                    createdAt: true
                }
            }),

            // Calculate average session time
            calculateAverageSessionTime(startDate),

            // Calculate bounce rate
            calculateBounceRate(startDate),

            // Get recent activity
            getRecentActivity(new Date(now.getTime() - 2 * 60 * 60 * 1000)) // Last 2 hours
        ]);

        // Calculate growth percentages
        const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
        const [previousVisitors, previousPageViews] = await Promise.all([
            db.visitor.count({
                where: {
                    lastVisit: {
                        gte: previousPeriodStart,
                        lt: startDate
                    }
                }
            }),
            db.pageView.count({
                where: {
                    timestamp: {
                        gte: previousPeriodStart,
                        lt: startDate
                    }
                }
            })
        ]);

        const visitorGrowth = previousVisitors > 0
            ? ((weeklyVisitors - previousVisitors) / previousVisitors * 100).toFixed(1)
            : '100';

        const pageViewGrowth = previousPageViews > 0
            ? ((totalPageViews - previousPageViews) / previousPageViews * 100).toFixed(1)
            : '100';

        return NextResponse.json({
            overview: {
                totalVisitors,
                totalPageViews,
                totalMessages,
                totalProjects,
                totalBlogPosts: publishedPosts,
                todayVisitors,
                weeklyVisitors,
                monthlyVisitors,
                unreadMessages,
                averageSessionTime: Math.round(typeof averageSessionTime === 'number' ? averageSessionTime : 0),
                bounceRate: Math.round(bounceRate * 100),
                visitorGrowth: `${parseFloat(visitorGrowth) > 0 ? '+' : ''}${visitorGrowth}%`,
                pageViewGrowth: `${parseFloat(pageViewGrowth) > 0 ? '+' : ''}${pageViewGrowth}%`
            },

            visitors: {
                recent: recentVisitors,
                topCountries: topCountries.map(c => ({
                    country: c.country,
                    count: c._count.country,
                    percentage: Math.round((c._count.country / totalPageViews) * 100)
                })),
                deviceStats: deviceStats.map(d => ({
                    device: d.device,
                    count: d._count.device,
                    percentage: Math.round((d._count.device / totalPageViews) * 100)
                })),
                browserStats: browserStats.map(b => ({
                    browser: b.browser,
                    count: b._count.browser,
                    percentage: Math.round((b._count.browser / totalPageViews) * 100)
                }))
            },

            traffic: {
                dailyStats: dailyPageViews,
                hourlyStats: hourlyPageViews,
                topPages: topPages.map(p => ({
                    page: p.page,
                    title: p.title || 'Untitled',
                    views: p._count.page
                }))
            },

            content: {
                topProjects: topProjects.map(p => ({
                    ...p,
                    viewsInPeriod: p._count.projectViews
                })),
                topBlogPosts: topBlogPosts.map(p => ({
                    ...p,
                    viewsInPeriod: p._count.blogViews
                }))
            },

            messages: recentMessages,
            recentActivity,

            metadata: {
                range,
                startDate: startDate.toISOString(),
                endDate: now.toISOString(),
                timestamp: now.toISOString()
            }
        });

    } catch (error) {
        console.error("❌ Enhanced Analytics API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics data" },
            { status: 500 }
        );
    }
}

// Helper functions for real data generation
async function generateDailyStats(startDate: Date, endDate: Date) {
    const stats = [];
    const dayMs = 24 * 60 * 60 * 1000;

    for (let date = new Date(startDate); date <= endDate; date.setTime(date.getTime() + dayMs)) {
        const dayStart = new Date(date);
        const dayEnd = new Date(date.getTime() + dayMs);

        const [visitors, pageViews] = await Promise.all([
            db.visitor.count({
                where: {
                    lastVisit: {
                        gte: dayStart,
                        lt: dayEnd
                    }
                }
            }),
            db.pageView.count({
                where: {
                    timestamp: {
                        gte: dayStart,
                        lt: dayEnd
                    }
                }
            })
        ]);

        stats.push({
            date: dayStart.toISOString().split('T')[0],
            visitors,
            views: pageViews
        });
    }

    return stats;
}

async function generateHourlyStats(startDate: Date, endDate: Date) {
    const stats = [];
    const hourMs = 60 * 60 * 1000;

    for (let date = new Date(startDate); date <= endDate; date.setTime(date.getTime() + hourMs)) {
        const hourStart = new Date(date);
        const hourEnd = new Date(date.getTime() + hourMs);

        const pageViews = await db.pageView.count({
            where: {
                timestamp: {
                    gte: hourStart,
                    lt: hourEnd
                }
            }
        });

        stats.push({
            hour: hourStart.getHours(),
            views: pageViews
        });
    }

    return stats;
}

async function calculateAverageSessionTime(startDate: Date): Promise<number> {
    // Get page views with duration data
    const pageViewsWithDuration = await db.pageView.findMany({
        where: {
            timestamp: { gte: startDate },
            duration: { not: null, gt: 0 }
        },
        select: { duration: true }
    });

    if (pageViewsWithDuration.length === 0) return 45; // Default fallback

    const totalTime = pageViewsWithDuration.reduce((sum, pv) => sum + (pv.duration || 0), 0);
    return totalTime / pageViewsWithDuration.length;
}

async function calculateBounceRate(startDate: Date): Promise<number> {
    // Get visitors and their page view counts
    const visitorPageCounts = await db.visitor.findMany({
        where: { lastVisit: { gte: startDate } },
        include: {
            pageViews: {
                where: { timestamp: { gte: startDate } },
                select: { id: true }
            }
        }
    });

    if (visitorPageCounts.length === 0) return 0.25; // Default 25%

    const bounces = visitorPageCounts.filter(v => v.pageViews.length === 1).length;
    return bounces / visitorPageCounts.length;
}

async function getRecentActivity(since: Date) {
    const activities: { type: string; message: string; time: string; icon: string; data: { country: string | null; city: string | null; visits: number; } | { name: string; email: string; } | { page: string; country: string | null | undefined; }; }[] = [];

    // Recent visitors
    const recentVisitors = await db.visitor.findMany({
        where: { lastVisit: { gte: since } },
        orderBy: { lastVisit: 'desc' },
        take: 10
    });

    // Recent messages
    const recentMessages = await db.contactSubmission.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    // Recent page views
    const recentPageViews = await db.pageView.findMany({
        where: { timestamp: { gte: since } },
        orderBy: { timestamp: 'desc' },
        take: 15,
        include: {
            visitor: {
                select: { country: true, city: true }
            }
        }
    });

    // Add visitor activities
    recentVisitors.forEach(visitor => {
        const isReturning = visitor.visits > 1;
        activities.push({
            type: 'visitor',
            message: `${isReturning ? 'Returning' : 'New'} visitor from ${visitor.country || 'Unknown'}${visitor.city ? `, ${visitor.city}` : ''}`,
            time: visitor.lastVisit.toISOString(),
            icon: 'Users',
            data: { country: visitor.country, city: visitor.city, visits: visitor.visits }
        });
    });

    // Add message activities
    recentMessages.forEach(message => {
        activities.push({
            type: 'contact',
            message: `Contact form submitted by ${message.name}`,
            time: message.createdAt.toISOString(),
            icon: 'MessageSquare',
            data: { name: message.name, email: message.email }
        });
    });

    // Add page view activities
    recentPageViews.forEach(pageView => {
        activities.push({
            type: 'view',
            message: `Page "${pageView.page}" viewed from ${pageView.visitor?.country || 'Unknown'}`,
            time: pageView.timestamp.toISOString(),
            icon: 'Eye',
            data: { page: pageView.page, country: pageView.visitor?.country }
        });
    });

    // Sort by time and limit
    return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 20);
}