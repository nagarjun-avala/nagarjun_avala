// app/admin/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, MessageSquare, FolderOpen, FileText,
    TrendingUp, Eye, Edit,
    Settings, LogOut, Shield, Calendar,
    Activity, BarChart3,
    RefreshCw,
    Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AdminLoginDialog from '@/components/AdminLoginDialog';
import { AdminUser, ContactSubmission } from '@prisma/client';

import { AnalyticsTab } from '@/components/admin/AnalyticsTab';
import { AddSkillDialog } from '@/components/admin/dialogs/AddSkillDialog';
import { AddProjectDialog } from '@/components/admin/dialogs/AddProjectDialog';
import { ContentTab } from '@/components/admin/ContentTab';
import { StatsCard } from '@/components/admin/StatsCard';
import { QuickActionCard } from '@/components/admin/QuickActionCard';
import { OverviewTab } from '@/components/admin/OverviewTab';
import { VisitorsTab } from '@/components/admin/VisitorsTab';
import { SettingsTab } from '@/components/admin/SettingsTab';
import { MessagesTab } from '@/components/admin/MessagesTab';
import AddExperienceDialog from '@/components/admin/dialogs/AddExperienceDialog';
import AddBlogPostDialog from '@/components/admin/dialogs/AddBlogPostDialog';

// Enhanced Analytics Data Types
export interface DetailedAnalytics {
    overview: {
        totalVisitors: number;
        totalMessages: number;
        totalProjects: number;
        totalBlogPosts: number;
        todayVisitors: number;
        weeklyVisitors: number;
        monthlyVisitors: number;
        averageSessionTime: number;
    };
    visitors: {
        recent: Array<{
            id: string;
            ip: string;
            country: string;
            city: string;
            visits: number;
            lastVisit: string;
            userAgent: string;
        }>;
        topCountries: Array<{ country: string; count: number }>;
        dailyStats: Array<{ date: string; visitors: number; views: number }>;
        deviceStats: Array<{ device: string; count: number; percentage: number }>;
        browserStats: Array<{ browser: string; count: number; percentage: number }>;
    };
    messages: Array<ContactSubmission>;
    projects: Array<{
        id: string;
        name: string;
        views: number;
        status: string;
        featured: boolean;
    }>;
    blogPosts: Array<{
        id: string;
        title: string;
        views: number;
        isPublished: boolean;
        publishedAt: string;
    }>;
}


export default function AdminDashboard() {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [analytics, setAnalytics] = useState<DetailedAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [dateRange, setDateRange] = useState('7d');
    const [refreshing, setRefreshing] = useState(false);

    // Dialog states
    const [showLogin, setShowLogin] = useState(false);
    const [showAddProject, setShowAddProject] = useState(false);
    const [showAddSkill, setShowAddSkill] = useState(false);
    const [showAddExperience, setShowAddExperience] = useState(false);
    const [showAddBlog, setShowAddBlog] = useState(false);

    const fetchAnalytics = React.useCallback(async () => {
        try {
            setRefreshing(true);
            console.log('Fetching analytics for range:', dateRange);
            const response = await fetch(`/api/analytics?range=${dateRange}`);
            console.log('Response:', response);
            if (!response.ok) throw new Error('Failed to fetch analytics');
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [dateRange]);

    const checkAuth = React.useCallback(async () => {
        try {
            const response = await fetch('/api/admin/auth/verify');
            if (response.ok) {
                const { user } = await response.json();
                setUser(user);
                setShowLogin(false);
                fetchAnalytics();
                toast.success(`Welcome back, ${user.username}!`);
            } else {
                setShowLogin(true);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setShowLogin(true);
        } finally {
            setLoading(false);
        }
    }, [fetchAnalytics]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);


    const handleLogout = async () => {
        try {
            await fetch('/api/admin/auth/logout', { method: 'POST' });
            setUser(null);
            setAnalytics(null);
            setShowLogin(true);
            toast.success('Logged out successfully');
        } catch {
            toast.error('Logout failed');
        }
    };
    const handleLoginSuccess = (user: AdminUser) => {
        setUser(user);
        setShowLogin(false);
        fetchAnalytics();
        toast.success(`Welcome back, ${user.username}!`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4" />
                    <p className="text-gray-400">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 max-w-md"
                >
                    <div className="p-4 bg-cyan-500/20 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                        <Shield className="text-cyan-400" size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">You need to sign in to access the admin panel</p>
                    </div>
                    <Button
                        onClick={() => setShowLogin(true)}
                        className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                    >
                        <Lock className="mr-2" size={16} />
                        Sign In
                    </Button>
                </motion.div>

                <AdminLoginDialog
                    isOpen={showLogin}
                    onClose={() => setShowLogin(false)}
                    onSuccess={handleLoginSuccess}
                />
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Enhanced Top Navigation */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 backdrop-blur border-b border-gray-700 px-6 py-4 sticky top-0 z-40"
            >
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <Shield className="text-cyan-400" size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">Welcome, {user?.username}</h1>
                            <p className="text-gray-400 text-sm">Analytics & Content Management</p>
                        </div>

                        {/* Date Range Selector */}
                        <div className="hidden md:flex items-center gap-2 ml-8">
                            <Calendar size={16} className="text-gray-400" />
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm focus:border-cyan-500"
                            >
                                <option value="1d">Last 24 hours</option>
                                <option value="7d">Last 7 days</option>
                                <option value="30d">Last 30 days</option>
                                <option value="90d">Last 90 days</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-white text-sm font-medium">{user?.username}</p>
                            <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
                        </div>
                        <Button
                            onClick={fetchAnalytics}
                            variant="outline"
                            size="sm"
                            disabled={refreshing}
                            className="border-gray-600"
                        >
                            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>

                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            size="sm"
                            className="border-gray-600"
                        >
                            <LogOut size={16} className="mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </motion.nav>

            <div className="max-w-7xl mx-auto p-6">
                {/* Enhanced Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    <StatsCard
                        icon={<Users className="text-cyan-400" />}
                        title="Total Visitors"
                        value={analytics?.overview?.totalVisitors ?? 0}
                        subValue={`${analytics?.overview?.todayVisitors ?? 0} today`}
                        change="+12.5%"
                        changeType="positive"
                    />
                    <StatsCard
                        icon={<Eye className="text-blue-400" />}
                        title="Page Views"
                        value={2847}
                        subValue="This month"
                        change="+8.2%"
                        changeType="positive"
                    />
                    <StatsCard
                        icon={<MessageSquare className="text-green-400" />}
                        title="Messages"
                        value={analytics?.overview?.totalMessages ?? 0}
                        subValue="3 unread"
                        change="+5%"
                        changeType="positive"
                    />
                    <StatsCard
                        icon={<Activity className="text-purple-400" />}
                        title="Engagement"
                        value={73}
                        subValue="Avg. session (sec)"
                        change="+15%"
                        changeType="positive"
                    />
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <QuickActionCard
                            icon={<FolderOpen />}
                            title="Add Project"
                            description="Create new project"
                            onClick={() => setShowAddProject(true)}
                            color="cyan"
                        />
                        <QuickActionCard
                            icon={<Settings />}
                            title="Add Skill"
                            description="Add new skill"
                            onClick={() => setShowAddSkill(true)}
                            color="purple"
                        />
                        <QuickActionCard
                            icon={<FileText />}
                            title="Write Blog"
                            description="Create blog post"
                            onClick={() => setShowAddBlog(true)}
                            color="green"
                        />
                        <QuickActionCard
                            icon={<Users />}
                            title="Add Experience"
                            description="Add work experience"
                            onClick={() => setShowAddExperience(true)}
                            color="orange"
                        />
                    </div>
                </motion.div>

                {/* Enhanced Navigation Tabs */}
                <div className="flex space-x-1 mb-8 bg-gray-800/50 p-1 rounded-lg overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
                        { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={16} /> },
                        { id: 'visitors', label: 'Visitors', icon: <Users size={16} /> },
                        { id: 'content', label: 'Content', icon: <Edit size={16} /> },
                        { id: 'messages', label: 'Messages', icon: <MessageSquare size={16} /> },
                        { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-cyan-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'overview' && <OverviewTab analytics={analytics} />}
                    {activeTab === 'analytics' && <AnalyticsTab analytics={analytics} />}
                    {activeTab === 'visitors' && <VisitorsTab analytics={analytics} />}
                    {activeTab === 'content' && <ContentTab onAddBlog={() => setShowAddBlog(true)} onAddExperience={() => setShowAddExperience(true)} onAddProject={() => setShowAddProject(true)} onAddSkill={() => setShowAddSkill(true)} />}
                    {activeTab === 'messages' && <MessagesTab messages={analytics?.messages || []} />}
                    {activeTab === 'settings' && <SettingsTab />}
                </motion.div>
            </div>

            {/* Dialog Forms */}
            <AddProjectDialog isOpen={showAddProject} onClose={() => setShowAddProject(false)} />
            <AddSkillDialog isOpen={showAddSkill} onClose={() => setShowAddSkill(false)} />
            <AddExperienceDialog isOpen={showAddExperience} onClose={() => setShowAddExperience(false)} />
            <AddBlogPostDialog isOpen={showAddBlog} onClose={() => setShowAddBlog(false)} />
        </div>
    );
};
