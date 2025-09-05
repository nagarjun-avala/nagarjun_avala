// components/TrafficSourcesChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ExternalLink, Search, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrafficSource {
    source: string;
    count: number;
}

interface TrafficSourcesChartProps {
    data: TrafficSource[];
}

const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export const TrafficSourcesChart: React.FC<TrafficSourcesChartProps> = ({ data }) => {
    const getSourceIcon = (source: string) => {
        const lowerSource = source.toLowerCase();
        if (lowerSource.includes('google')) return <Search size={14} className="text-blue-400" />;
        if (lowerSource.includes('direct')) return <Users size={14} className="text-green-400" />;
        return <ExternalLink size={14} className="text-purple-400" />;
    };

    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6" >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" >
                <ExternalLink className="text-purple-400" size={20} />
                Traffic Sources
            </h3>

            {
                data.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6" >
                        <div className="h-64" >
                            <ResponsiveContainer width="100%" height="100%" >
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="count"
                                        nameKey="source"
                                    >
                                        {
                                            data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                    </Pie>
                                    < Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            border: '1px solid #374151',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        < div className="space-y-3" >
                            {
                                data.map((source, index) => (
                                    <motion.div
                                        key={source.source}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3" >
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            />
                                            < div className="flex items-center gap-2" >
                                                {getSourceIcon(source.source)}
                                                < span className="text-white font-medium" > {source.source} </span>
                                            </div>
                                        </div>
                                        < div className="text-right" >
                                            <span className="text-white font-mono" > {source.count} </span>
                                            < span className="text-gray-400 text-xs ml-2" >
                                                ({((source.count / total) * 100).toFixed(1)}%)
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8" >
                        <ExternalLink className="mx-auto text-gray-500 mb-2" size={32} />
                        <p className="text-gray-400" > No traffic source data available </p>
                    </div>
                )}
        </div>
    );
};