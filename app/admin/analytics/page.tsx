"use client";

import { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

type Visitor = {
    id: string;
    ip: string;
    visits: number;
    country?: string | null;
    region?: string | null;
    city?: string | null;
    createdAt: Date;
    updatedAt: Date;
};

type VisitsOverTime = {
    date: string;
    visits: number;
};

type VisitsByCountry = {
    country: string;
    visits: number;
};


export default function AnalyticsPage() {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch("/api/visitors");
                const data = await res.json();
                setVisitors(data.visitors || []);
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <p className="text-center">Loading analytics...</p>;

    // 🟢 Visits Over Time (group by date)
    const visitsOverTime: VisitsOverTime[] = Object.values(
        visitors.reduce<Record<string, VisitsOverTime>>((acc, v) => {
            const date = new Date(v.createdAt).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = { date, visits: 0 };
            }
            acc[date].visits += v.visits;
            return acc;
        }, {})
    );

    // 🟢 Visits by Country
    const visitsByCountry: VisitsByCountry[] = Object.values(
        visitors.reduce<Record<string, VisitsByCountry>>((acc, v) => {
            const country = v.country || "Unknown";
            if (!acc[country]) {
                acc[country] = { country, visits: 0 };
            }
            acc[country].visits += v.visits;
            return acc;
        }, {})
    );


    const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

    return (
        <div className="p-6 space-y-10">
            <h1 className="text-2xl font-bold">📊 Visitor Analytics</h1>

            {/* Stat Card */}
            <div className="p-4 rounded-2xl shadow bg-gray-900 text-white text-center">
                <p className="text-sm">Total Unique Visitors</p>
                <h2 className="text-3xl font-bold">{visitors.length}</h2>
            </div>

            {/* Visits Over Time */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
                <h2 className="text-lg font-semibold mb-4">Visits Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={visitsOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="visits" stroke="#6366f1" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Visits by Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
                    <h2 className="text-lg font-semibold mb-4">Visits by Country</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={visitsByCountry}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="country" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="visits" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
                    <h2 className="text-lg font-semibold mb-4">Visits Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={visitsByCountry}
                                dataKey="visits"
                                nameKey="country"
                                outerRadius={100}
                                label
                            >
                                {visitsByCountry.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
