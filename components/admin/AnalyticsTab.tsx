// components/admin/AnalyticsTab.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MousePointer, Globe, Activity, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { DetailedAnalytics } from '@/app/admin/page';

interface AnalyticsTabProps {
    analytics: DetailedAnalytics | null;
}




export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ analytics }) => {
    const chartColors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

    const dailyData = analytics?.visitors?.dailyStats || [
        { date: '2024-12-25', visitors: 45, views: 127 },
        { date: '2024-12-26', visitors: 52, views: 143 },
        { date: '2024-12-27', visitors: 38, views: 98 },
        { date: '2024-12-28', visitors: 61, views: 172 },
        { date: '2024-12-29', visitors: 47, views: 134 },
        { date: '2024-12-30', visitors: 55, views: 156 },
        { date: '2024-12-31', visitors: 73, views: 201 }
    ];

    interface DeviceStat {
        device: string;
        count: number;
        percentage: number;
    }

    const deviceData: DeviceStat[] =
        analytics?.visitors?.deviceStats.map((item) => ({
            device: item.device,
            count: item.count,
            percentage: item.percentage ?? 0,
        })) || [
            { device: 'Desktop', count: 156, percentage: 52 },
            { device: 'Mobile', count: 98, percentage: 33 },
            { device: 'Tablet', count: 45, percentage: 15 },
        ];



    const browserData = analytics?.visitors?.browserStats || [
        { browser: 'Chrome', count: 145 },
        { browser: 'Safari', count: 67 },
        { browser: 'Firefox', count: 34 },
        { browser: 'Edge', count: 23 },
        { browser: 'Other', count: 30 }
    ];

    return (
        <div className="space-y-8">
            {/* Traffic Overview Chart */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="text-cyan-400" size={20} />
                        Traffic Overview
                    </h3>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                            <Download size={14} className="mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="date"
                                stroke="#9ca3af"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px'
                                }}
                                labelStyle={{ color: '#06b6d4' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="visitors"
                                stroke="#06b6d4"
                                strokeWidth={3}
                                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="views"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Device & Browser Analytics */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Device Stats */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <MousePointer className="text-purple-400" size={20} />
                        Device Types
                    </h3>

                    <div className="space-y-4">
                        {deviceData.map((item, index) => (
                            <motion.div
                                key={item.device}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: chartColors[index] }} />
                                    <span className="text-white font-medium">{item.device}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 bg-gray-700 rounded-full h-2">
                                        <motion.div
                                            className="h-2 rounded-full"
                                            style={{ backgroundColor: chartColors[index] }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            transition={{ duration: 1, delay: index * 0.2 }}
                                        />
                                    </div>
                                    <span className="text-gray-400 text-sm w-12 text-right">{item.count}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Browser Stats */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Globe className="text-orange-400" size={20} />
                        Browser Distribution
                    </h3>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={browserData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis
                                    dataKey="browser"
                                    stroke="#9ca3af"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {browserData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Real-time Activity Feed */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Activity className="text-green-400" size={20} />
                        Real-time Activity
                    </h3>
                    <div className="flex items-center gap-2 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm">Live</span>
                    </div>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {[
                        { location: 'India', device: 'Mobile', browser: 'Chrome', time: new Date().toISOString() },
                        { location: 'USA', device: 'Desktop', browser: 'Safari', time: new Date().toISOString() },
                        { location: 'UK', device: 'Tablet', browser: 'Firefox', time: new Date().toISOString() }
                    ].map((activity, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                        >
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                <Activity size={14} className="text-cyan-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white text-sm font-medium">
                                    Visitor from {activity.location}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    {activity.device} • {activity.browser} • {new Date(activity.time).toLocaleTimeString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};