// components/admin/OverviewTab.tsx
import React from 'react';
import { Map } from 'lucide-react';
import { DetailedAnalytics } from '@/app/admin/page';

interface Visitor {
    country: string;
    city?: string;
    visits: number;
    lastVisit: string;
}

interface CountryStat {
    country: string;
    count: number;
}


interface OverviewTabProps {
    analytics: DetailedAnalytics | null;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ analytics }) => (
    <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4">Today&apos;s Overview</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-cyan-400">{analytics?.overview.todayVisitors || 0}</p>
                        <p className="text-gray-400 text-sm">Today&apos;s Visitors</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">156</p>
                        <p className="text-gray-400 text-sm">Page Views</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">3</p>
                        <p className="text-gray-400 text-sm">New Messages</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-400">2.3m</p>
                        <p className="text-gray-400 text-sm">Avg. Session</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {analytics?.visitors.recent.slice(0, 5).map((visitor: Visitor, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                            <div>
                                <p className="text-white text-sm">
                                    {visitor.country} {visitor.city && `, ${visitor.city}`}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    {visitor.visits} visit{visitor.visits > 1 ? 's' : ''}
                                </p>
                            </div>
                            <p className="text-gray-400 text-xs">
                                {new Date(visitor.lastVisit).toLocaleTimeString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="space-y-6">
            {/* Top Countries */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Map className="text-green-400" size={20} />
                    Top Countries
                </h3>
                <div className="space-y-3">
                    {analytics?.visitors.topCountries.slice(0, 5).map((country: CountryStat, i: number) => (
                        <div key={i} className="flex justify-between items-center">
                            <span className="text-white">{country.country}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-green-400 h-2 rounded-full"
                                        style={{ width: `${(country.count / (analytics?.visitors.topCountries[0]?.count || 1)) * 100}%` }}
                                    />
                                </div>
                                <span className="text-gray-400 text-sm w-6">{country.count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4">Performance</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Avg. Load Time</span>
                        <span className="text-green-400 font-medium">1.2s</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Bounce Rate</span>
                        <span className="text-yellow-400 font-medium">23%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Pages/Session</span>
                        <span className="text-cyan-400 font-medium">3.4</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Conversion Rate</span>
                        <span className="text-purple-400 font-medium">8.7%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);