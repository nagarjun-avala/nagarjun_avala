// components/AnalyticsProvider.tsx - React context for analytics
"use client"
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { getTracker, AnalyticsTracker } from '@/utils/clientTracking';

const AnalyticsContext = createContext<AnalyticsTracker | null>(null);

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalytics must be used within AnalyticsProvider');
    }
    return context;
};

interface AnalyticsProviderProps {
    children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
    const [tracker, setTracker] = React.useState<AnalyticsTracker | null>(null);

    useEffect(() => {
        const analyticsTracker = getTracker();
        setTracker(analyticsTracker);
    }, []);

    return (
        <AnalyticsContext.Provider value={tracker}>
            {children}
        </AnalyticsContext.Provider>
    );
};