// components/admin/VisitorsTab.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DetailedAnalytics } from '@/app/admin/page';

interface Visitor {
    id: string;
    country?: string;
    city?: string;
    ip: string;
    visits: number;
    lastVisit: string | number | Date;
    userAgent?: string;
}

interface VisitorsTabProps {
    analytics: DetailedAnalytics | null;
}

export const VisitorsTab: React.FC<VisitorsTabProps> = ({ analytics }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCountry, setFilterCountry] = useState('');

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-gray-800/30 p-4 rounded-xl">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by IP, country, or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500"
                    />
                </div>

                <select
                    value={filterCountry}
                    onChange={(e) => setFilterCountry(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500"
                >
                    <option value="">All Countries</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                </select>

                <Button size="sm" variant="outline">
                    <Filter size={16} className="mr-2" />
                    Export Data
                </Button>
            </div>

            {/* Visitor Table */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-lg font-semibold">Recent Visitors</h3>
                    {analytics?.visitors.recent.slice(0, 10).map((visitor: Visitor,) => (

                        <div className="overflow-x-auto" key={visitor.id}>
                            <table className="w-full">
                                <thead className="bg-gray-700/30">
                                    <tr>
                                        <th className="text-left p-4 text-gray-300 font-medium">Location</th>
                                        <th className="text-left p-4 text-gray-300 font-medium">IP Address</th>
                                        <th className="text-left p-4 text-gray-300 font-medium">Visits</th>
                                        <th className="text-left p-4 text-gray-300 font-medium">Last Visit</th>
                                        <th className="text-left p-4 text-gray-300 font-medium">Device</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics?.visitors.recent.slice(0, 10).map((visitor: Visitor, i: number) => (
                                        <motion.tr
                                            key={visitor.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div>
                                                    <p className="text-white text-sm font-medium">
                                                        {visitor.country || 'Unknown'}
                                                    </p>
                                                    {visitor.city && (
                                                        <p className="text-gray-400 text-xs">{visitor.city}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <code className="text-cyan-400 text-xs bg-cyan-500/10 px-2 py-1 rounded">
                                                    {visitor.ip.substring(0, 12)}...
                                                </code>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-white font-medium">{visitor.visits}</span>
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="text-white text-sm">
                                                        {new Date(visitor.lastVisit).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-gray-400 text-xs">
                                                        {new Date(visitor.lastVisit).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-gray-300 text-sm">
                                                    {visitor.userAgent?.includes('Mobile') ? '📱 Mobile' :
                                                        visitor.userAgent?.includes('Tablet') ? '📱 Tablet' : '💻 Desktop'}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};