// components/RealTimeActivityFeed.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye, MessageSquare, Globe, Clock } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'visitor' | 'page_view' | 'contact' | 'blog_read';
    message: string;
    location?: string;
    time: string;
    metadata?: unknown;
}

interface RealTimeActivityFeedProps {
    activities: ActivityItem[];
    isLive?: boolean;
}

export const RealTimeActivityFeed: React.FC<RealTimeActivityFeedProps> = ({
    activities,
    isLive = true
}) => {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'visitor': return <Users size={14} className="text-cyan-400" />;
            case 'page_view': return <Eye size={14} className="text-purple-400" />;
            case 'contact': return <MessageSquare size={14} className="text-green-400" />;
            case 'blog_read': return <Globe size={14} className="text-orange-400" />;
            default: return <Clock size={14} className="text-gray-400" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'visitor': return 'border-l-cyan-400';
            case 'page_view': return 'border-l-purple-400';
            case 'contact': return 'border-l-green-400';
            case 'blog_read': return 'border-l-orange-400';
            default: return 'border-l-gray-400';
        }
    };

    return (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6" >
            <div className="flex justify-between items-center mb-6" >
                <h3 className="text-lg font-semibold flex items-center gap-2" >
                    <Globe className="text-green-400" size={20} />
                    Real - time Activity
                </h3>
                {
                    isLive && (
                        <div className="flex items-center gap-2 text-green-400" >
                            <motion.div
                                className="w-2 h-2 bg-green-400 rounded-full"
                                animate={{ opacity: [1, 0.5, 1] }
                                }
                                transition={{ duration: 2, repeat: Infinity }
                                }
                            />
                            < span className="text-sm font-medium" > Live </span>
                        </div>
                    )}
            </div>

            < div className="space-y-2 max-h-80 overflow-y-auto" >
                <AnimatePresence initial={false}>
                    {
                        activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, x: 20, height: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg border-l-2 ${getActivityColor(activity.type)} hover:bg-gray-700/50 transition-colors`}
                            >
                                <div className="p-1.5 bg-gray-600/50 rounded-lg flex-shrink-0 mt-0.5" >
                                    {getActivityIcon(activity.type)}
                                </div>
                                < div className="flex-1 min-w-0" >
                                    <p className="text-white text-sm font-medium truncate" >
                                        {activity.message}
                                    </p>
                                    < div className="flex items-center gap-2 mt-1" >
                                        {
                                            activity.location && (
                                                <span className="text-gray-400 text-xs">
                                                    📍 {activity.location}
                                                </span>
                                            )}
                                        <span className="text-gray-500 text-xs" >
                                            {formatTimeAgo(activity.time)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </AnimatePresence>

                {
                    activities.length === 0 && (
                        <div className="text-center py-8" >
                            <Globe className="mx-auto text-gray-500 mb-2" size={32} />
                            <p className="text-gray-400 text-sm" > No recent activity </p>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

// Helper function to format time ago
function formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}