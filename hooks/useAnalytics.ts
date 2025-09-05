// hooks/useAnalytics.ts - Real-time analytics hook
"use client";

import { BlogPost, Project } from '@prisma/client';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface AnalyticsData {
    overview: {
        totalVisitors: number;
        totalMessages: number;
        totalProjects: number;
        totalBlogPosts: number;
        todayVisitors: number;
        weeklyVisitors: number;
        monthlyVisitors: number;
        averageSessionTime: number;
        visitorGrowth: string;
    };
    visitors: {
        recent: Array<{
            id: string;
            ip: string;
            country: string;
            city: string;
            visits: number;
            lastVisit: string;
            browser: string;
            device: string;
            os: string;
        }>;
        dailyStats: Array<{ date: string; visitors: number; views: number }>;
        topCountries: Array<{ country: string; count: number; totalViews: number }>;
        deviceStats: Array<{ device: string; count: number; percentage: number }>;
        browserStats: Array<{ browser: string; count: number }>;
        trafficSources: Array<{ source: string; count: number }>;
    };
    content: {
        topProjects: Array<Project>;
        topBlogPosts: Array<BlogPost>;
        recentPosts: Array<unknown>;
    };
    messages: Array<unknown>;
    realtime: {
        activeVisitors: number;
        activity: Array<{
            location: string;
            device: string;
            browser: string;
            time: string;
            type: string;
        }>;
    };
    performance: {
        averageLoadTime: number;
        bounceRate: number;
        pagesPerSession: string;
        conversionRate: string;
    };
    trends: {
        visitorTrend: number[];
        viewsTrend: number[];
        dates: string[];
    };
}

export function useAnalytics(dateRange: string = '7d', autoRefresh: boolean = true) {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchAnalytics = useCallback(async (showToast = false) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/analytics?range=${dateRange}&t=${Date.now()}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const analyticsData = await response.json();
            setData(analyticsData);
            setLastUpdated(new Date());

            if (showToast) {
                toast.success('Analytics updated successfully');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
            setError(errorMessage);

            if (showToast) {
                toast.error('Failed to update analytics');
            }
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    // Initial fetch
    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    // Auto refresh every 30 seconds
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            fetchAnalytics();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchAnalytics, autoRefresh]);

    const refresh = () => fetchAnalytics(true);

    return {
        data,
        loading,
        error,
        lastUpdated,
        refresh
    };
}