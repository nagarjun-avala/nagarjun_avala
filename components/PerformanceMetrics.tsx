// components/PerformanceMetrics.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus, Zap, Target, Users, MousePointer } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: React.ReactNode;
    color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    change,
    changeType = 'neutral',
    icon,
    color
}) => {
    const getChangeIcon = () => {
        switch (changeType) {
            case 'positive': return <TrendingUp size={14} className="text-green-400" />;
            case 'negative': return <TrendingDown size={14} className="text-red-400" />;
            default: return <Minus size={14} className="text-gray-400" />;
        }
    };

    const getChangeColor = () => {
        switch (changeType) {
            case 'positive': return 'text-green-400';
            case 'negative': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <motion.div
            whileHover={{ y: -2, scale: 1.02 }
            }
            className={`bg-gray-800/40 border border-gray-700 rounded-xl p-4 hover:border-${color}-500/50 transition-all duration-300 relative overflow-hidden`}
        >
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-${color}-500/10 to-transparent rounded-full -translate-y-8 translate-x-8`} />

            < div className="relative" >
                <div className="flex items-center justify-between mb-2" >
                    <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
                        {icon}
                    </div>
                    {
                        change && (
                            <div className={`flex items-center gap-1 text-xs ${getChangeColor()}`}>
                                {getChangeIcon()}
                                {change}
                            </div>
                        )
                    }
                </div>

                < div >
                    <p className="text-2xl font-bold text-white mb-1" > {value} </p>
                    < p className="text-gray-400 text-sm" > {title} </p>
                </div>
            </div>
        </motion.div>
    );
};

interface PerformanceMetricsProps {
    metrics: {
        averageLoadTime: number;
        bounceRate: number;
        pagesPerSession: string;
        conversionRate: string;
    };
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" >
            <MetricCard
                title="Avg Load Time"
                value={`${metrics.averageLoadTime}s`
                }
                change="-0.2s"
                changeType="positive"
                icon={< Zap className="text-yellow-400" size={20} />}
                color="yellow"
            />

            <MetricCard
                title="Bounce Rate"
                value={`${metrics.bounceRate}%`}
                change="-5%"
                changeType="positive"
                icon={< Target className="text-purple-400" size={20} />}
                color="purple"
            />

            <MetricCard
                title="Pages/Session"
                value={metrics.pagesPerSession}
                change="+0.4"
                changeType="positive"
                icon={< MousePointer className="text-cyan-400" size={20} />}
                color="cyan"
            />

            <MetricCard
                title="Conversion Rate"
                value={`${metrics.conversionRate}%`}
                change="+1.2%"
                changeType="positive"
                icon={< Users className="text-green-400" size={20} />}
                color="green"
            />
        </div>
    );
};