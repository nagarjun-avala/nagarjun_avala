// components/admin/QuickActionCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

type Color = 'cyan' | 'purple' | 'green' | 'orange';

interface QuickActionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    color: Color;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
    icon,
    title,
    description,
    onClick,
    color
}) => {
    const colorClasses: Record<string, string> = {
        cyan: 'hover:border-cyan-500/50 hover:bg-cyan-500/5',
        purple: 'hover:border-purple-500/50 hover:bg-purple-500/5',
        green: 'hover:border-green-500/50 hover:bg-green-500/5',
        orange: 'hover:border-orange-500/50 hover:bg-orange-500/5',
    };

    const iconWrapperClasses: Record<string, string> = {
        cyan: 'bg-cyan-500/20 text-cyan-400',
        purple: 'bg-purple-500/20 text-purple-400',
        green: 'bg-green-500/20 text-green-400',
        orange: 'bg-orange-500/20 text-orange-400',
    };


    return (
        <motion.button
            onClick={onClick}
            aria-label={title}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={` bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white p-4 rounded-xl text-left transition-all duration-300 relative overflow-hidden ${colorClasses[color]}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={`relative z-10`}>
                <div className={`p-2 rounded-lg mb-3 w-fit ${iconWrapperClasses[color]}`}>
                    {icon}
                </div>
                <h3 className="font-medium text-black dark:text-white mb-1">{title}</h3>
                <p className="text-gray-400 text-xs">{description}</p>
            </div>
        </motion.button>
    );
};
