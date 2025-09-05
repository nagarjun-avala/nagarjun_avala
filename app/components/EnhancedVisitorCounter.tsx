// components/EnhancedVisitorCounter.tsx - Real-time updates
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnhancedVisitorCounter() {
    const [analytics, setAnalytics] = useState({
        totalVisitors: 0,
        todayVisitors: 0,
        yourVisits: 0,
        location: null as { country?: string; city?: string } | null,
        isNewVisitor: false
    });

    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch("/api/visitors", { method: "POST" });
                const data = await res.json();

                setAnalytics({
                    totalVisitors: data.totalVisitors || 0,
                    todayVisitors: data.todayVisitors || 0,
                    yourVisits: data.thisVisitor || 1,
                    location: data.location,
                    isNewVisitor: data.thisVisitor === 1
                });
            } catch (err) {
                console.error("Failed to fetch visitor analytics:", err);
            }
        };

        fetchAnalytics();
    }, []);

    return (
        <motion.div
            className="text-center py-6 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={analytics.totalVisitors}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-1"
                >
                    <div className="text-lg font-semibold text-cyan-400">
                        👀 {analytics.totalVisitors.toLocaleString()} unique visitors
                    </div>

                    <div className="flex justify-center items-center gap-4 text-sm text-gray-400">
                        <span>🔥 {analytics.todayVisitors} today</span>
                        {analytics.yourVisits > 1 && (
                            <span>🎯 Your {analytics.yourVisits}{analytics.yourVisits === 2 ? 'nd' : analytics.yourVisits === 3 ? 'rd' : 'th'} visit</span>
                        )}
                    </div>

                    {analytics.location?.country && (
                        <motion.button
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                            whileHover={{ scale: 1.05 }}
                        >
                            📍 {analytics.location.country}
                            {analytics.location.city && `, ${analytics.location.city}`}
                            {showDetails ? ' 🔽' : ' 🔼'}
                        </motion.button>
                    )}

                    <AnimatePresence>
                        {showDetails && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-xs text-gray-500 space-y-1 pt-2"
                            >
                                {analytics.isNewVisitor && (
                                    <div className="text-green-400">🎉 Welcome! You&apos;re a new visitor</div>
                                )}
                                <div>🌍 Tracked with privacy-first analytics</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}
