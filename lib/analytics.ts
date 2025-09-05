import { useEffect, useState } from "react";

// lib/analytics.ts - Client-side tracking utilities
export class AnalyticsTracker {
    private static instance: AnalyticsTracker;
    private pageViews: Map<string, number> = new Map();
    private sessionStart: number = Date.now();

    static getInstance(): AnalyticsTracker {
        if (!AnalyticsTracker.instance) {
            AnalyticsTracker.instance = new AnalyticsTracker();
        }
        return AnalyticsTracker.instance;
    }

    // Track page view
    async trackPageView(pathname: string, title?: string) {
        try {
            const currentCount = this.pageViews.get(pathname) || 0;
            this.pageViews.set(pathname, currentCount + 1);

            await fetch('/api/tracking/pageview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pathname,
                    title: title || document.title,
                    timestamp: new Date().toISOString(),
                    referrer: document.referrer || null,
                    userAgent: navigator.userAgent
                })
            });
        } catch (error) {
            console.warn('Failed to track page view:', error);
        }
    }

    // Track custom event
    async trackEvent(eventName: string, data?: Record<string, unknown>) {
        try {
            await fetch('/api/tracking/event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: eventName,
                    data,
                    timestamp: new Date().toISOString(),
                    sessionDuration: Date.now() - this.sessionStart
                })
            });
        } catch (error) {
            console.warn('Failed to track event:', error);
        }
    }

    // Track contact form submission
    async trackContactSubmission(formData: { name: string; email: string; message: string }) {
        await this.trackEvent('contact_form_submission', formData);
    }

    // Track project view
    async trackProjectView(projectId: string, projectName: string) {
        await this.trackEvent('project_view', { projectId, projectName });
    }

    // Track blog post read
    async trackBlogRead(postId: string, postTitle: string, readTime?: number) {
        await this.trackEvent('blog_read', { postId, postTitle, readTime });
    }

    // Get session info
    getSessionInfo() {
        return {
            sessionDuration: Date.now() - this.sessionStart,
            pageViews: Array.from(this.pageViews.entries()),
            totalPageViews: Array.from(this.pageViews.values()).reduce((sum, count) => sum + count, 0)
        };
    }
}

// Hook to use analytics tracker
export function usePageTracking() {
    const tracker = AnalyticsTracker.getInstance();

    const trackPage = (pathname: string, title?: string) => {
        tracker.trackPageView(pathname, title);
    };

    const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
        tracker.trackEvent(eventName, data);
    };

    return { trackPage, trackEvent, tracker };
}

// Enhanced visitor counter with real-time updates
export function useVisitorCounter(autoUpdate = true) {
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCount = async () => {
        try {
            const response = await fetch('/api/visitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timestamp: new Date().toISOString() })
            });

            if (response.ok) {
                const data = await response.json();
                setCount(data.totalVisitors || 0);
                setError(null);
            } else {
                throw new Error('Failed to fetch visitor count');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCount();

        if (autoUpdate) {
            const interval = setInterval(fetchCount, 60000); // Update every minute
            return () => clearInterval(interval);
        }
    }, [autoUpdate]);

    return { count, loading, error, refetch: fetchCount };
}