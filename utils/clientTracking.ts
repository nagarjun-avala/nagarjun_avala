// utils/clientTracking.ts
export class AnalyticsTracker {
    private startTime: number;
    private currentPage: string;
    private title: string;

    constructor() {
        this.startTime = Date.now();
        this.currentPage = window.location.pathname;
        this.title = document.title;

        // Track page view on load
        this.trackPageView();

        // Track page changes (for SPA navigation)
        this.setupNavigationTracking();

        // Track page unload to calculate time spent
        this.setupUnloadTracking();
    }

    // (Removed duplicate trackPageView method)

    private setupNavigationTracking() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.onPageChange();
        });

        // Handle programmatic navigation (override pushState/replaceState)
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function (...args) {
            originalPushState.apply(this, args);
            setTimeout(() => window.dispatchEvent(new Event('locationchange')), 0);
        };

        history.replaceState = function (...args) {
            originalReplaceState.apply(this, args);
            setTimeout(() => window.dispatchEvent(new Event('locationchange')), 0);
        };

        window.addEventListener('locationchange', () => {
            this.onPageChange();
        });
    }

    private setupUnloadTracking() {
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);

            // Use sendBeacon for reliable tracking on page unload
            navigator.sendBeacon('/api/track/page', JSON.stringify({
                page: this.currentPage,
                title: this.title,
                timeSpent
            }));
        });

        // Also track on visibility change (tab switch)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
                this.trackPageView(timeSpent);
            }
        });
    }

    private onPageChange() {
        // Track time spent on previous page
        const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);

        if (timeSpent > 5) { // Only track if spent more than 5 seconds
            this.trackPageView(timeSpent);
        }

        // Update tracking for new page
        this.currentPage = window.location.pathname;
        this.title = document.title;
        this.startTime = Date.now();

        // Track new page view
        setTimeout(() => this.trackPageView(), 100);
    }

    private async trackPageView(timeSpent?: number) {
        try {
            await fetch('/api/track/page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page: this.currentPage,
                    title: this.title,
                    timeSpent
                })
            });
        } catch (error) {
            console.error('Failed to track page view:', error);
        }
    }

    // Track project views
    async trackProjectView(projectId: string, projectSlug: string) {
        try {
            await fetch('/api/track/project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, projectSlug })
            });
        } catch (error) {
            console.error('Failed to track project view:', error);
        }
    }

    // Track blog post views
    async trackBlogView(postId: string, readTime?: number) {
        try {
            await fetch('/api/track/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, readTime })
            });
        } catch (error) {
            console.error('Failed to track blog view:', error);
        }
    }

    // Track custom events
    async trackEvent(eventName: string, data: Record<string, unknown> = {}) {
        try {
            await fetch('/api/track/event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: eventName,
                    data,
                    page: this.currentPage,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error('Failed to track event:', error);
        }
    }
}

// Initialize tracking when app loads
let tracker: AnalyticsTracker;

export function initializeTracking() {
    if (typeof window !== 'undefined' && !tracker) {
        tracker = new AnalyticsTracker();
    }
    return tracker;
}

export function getTracker() {
    return tracker || initializeTracking();
}