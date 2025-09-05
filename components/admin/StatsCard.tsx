// components/admin/StatsCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
    icon: React.ReactNode;
    title: string;
    value: number;
    subValue: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
}

export const StatsCard: React.FC<StatsCardProps> = ({
    icon,
    title,
    value,
    subValue,
    change,
    changeType
}) => (
    <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full -translate-y-10 translate-x-10" />
        <div className="relative">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-gray-400 text-sm">{title}</p>
                    <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <p className="text-gray-400 text-xs">{subValue}</p>
                <p className={`text-xs font-medium ${changeType === 'positive' ? 'text-green-400' :
                    changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                    {change}
                </p>
            </div>
        </div>
    </motion.div>
);
