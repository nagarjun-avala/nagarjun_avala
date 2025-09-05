// components/admin/QuickActionCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface QuickActionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    color: 'cyan' | 'purple' | 'green' | 'orange';
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
    icon,
    title,
    description,
    onClick,
    color
}) => {
    const colorClasses = {
        cyan: 'hover:border-cyan-500/50 hover:bg-cyan-500/5',
        purple: 'hover:border-purple-500/50 hover:bg-purple-500/5',
        green: 'hover:border-green-500/50 hover:bg-green-500/5',
        orange: 'hover:border-orange-500/50 hover:bg-orange-500/5'
    };

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 bg-gray-800/30 border border-gray-700 rounded-xl text-left transition-all duration-300 ${colorClasses[color]}`}
        >
            <div className={`p-2 rounded-lg mb-3 w-fit ${color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                    color === 'green' ? 'bg-green-500/20 text-green-400' :
                        'bg-orange-500/20 text-orange-400'
                }`}>
                {icon}
            </div>
            <h3 className="font-medium text-white mb-1">{title}</h3>
            <p className="text-gray-400 text-xs">{description}</p>
        </motion.button>
    );
};
