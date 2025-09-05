// components/admin/SettingsTab.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Shield, Bell, Palette, Globe, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const SettingsTab: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        // Profile Settings
        displayName: 'Nagarjun Avala',
        title: 'Web Developer | Aspiring Data Engineer',
        bio: 'Passionate full-stack developer with expertise in modern web technologies.',

        // Site Configuration
        analyticsEnabled: true,
        contactFormEnabled: true,
        blogSectionEnabled: true,
        visitorCounterEnabled: true,

        // SEO Settings
        siteTitle: 'Nagarjun Avala - Portfolio',
        siteDescription: 'Full-stack developer specializing in modern web technologies',

        // Notification Settings
        emailNotifications: true,
        contactFormNotifications: true,
        blogCommentNotifications: false,

        // Theme Settings
        primaryColor: '#06b6d4',
        accentColor: '#8b5cf6',
        darkMode: true
    });

    const handleSave = async (section: string) => {
        setLoading(true);
        try {
            // API call to save settings
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
            toast.success(`${section} settings saved successfully!`);
        } catch {
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold mb-2">Portfolio Settings</h3>
                <p className="text-gray-400">Configure your portfolio and site preferences</p>
            </div>

            <div className="grid gap-8">
                {/* Profile Settings */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <User className="text-cyan-400" size={20} />
                        </div>
                        <div>
                            <h4 className="text-lg font-medium">Profile Settings</h4>
                            <p className="text-gray-400 text-sm">Update your personal information</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                            <input
                                type="text"
                                value={settings.displayName}
                                onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Professional Title</label>
                            <input
                                type="text"
                                value={settings.title}
                                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                        <textarea
                            value={settings.bio}
                            onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                        />
                    </div>

                    <Button
                        onClick={() => handleSave('Profile')}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-500"
                    >
                        <Save size={16} className="mr-2" />
                        {loading ? 'Saving...' : 'Update Profile'}
                    </Button>
                </motion.div>

                {/* Site Configuration */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Settings className="text-purple-400" size={20} />
                        </div>
                        <div>
                            <h4 className="text-lg font-medium">Site Configuration</h4>
                            <p className="text-gray-400 text-sm">Control site features and functionality</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <ToggleSetting
                                label="Visitor Analytics"
                                description="Track visitor data and generate insights"
                                checked={settings.analyticsEnabled}
                                onChange={(checked) => setSettings({ ...settings, analyticsEnabled: checked })}
                            />
                            <ToggleSetting
                                label="Contact Form"
                                description="Allow visitors to send you messages"
                                checked={settings.contactFormEnabled}
                                onChange={(checked) => setSettings({ ...settings, contactFormEnabled: checked })}
                            />
                        </div>
                        <div className="space-y-4">
                            <ToggleSetting
                                label="Blog Section"
                                description="Display blog posts on your portfolio"
                                checked={settings.blogSectionEnabled}
                                onChange={(checked) => setSettings({ ...settings, blogSectionEnabled: checked })}
                            />
                            <ToggleSetting
                                label="Visitor Counter"
                                description="Show total visitor count"
                                checked={settings.visitorCounterEnabled}
                                onChange={(checked) => setSettings({ ...settings, visitorCounterEnabled: checked })}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={() => handleSave('Site Configuration')}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-500"
                    >
                        <Save size={16} className="mr-2" />
                        {loading ? 'Saving...' : 'Save Configuration'}
                    </Button>
                </motion.div>

                {/* SEO Settings */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Globe className="text-green-400" size={20} />
                        </div>
                        <div>
                            <h4 className="text-lg font-medium">SEO Settings</h4>
                            <p className="text-gray-400 text-sm">Optimize your site for search engines</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Site Title</label>
                            <input
                                type="text"
                                value={settings.siteTitle}
                                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
                            <textarea
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 resize-none"
                            />
                            <p className="text-gray-500 text-xs mt-1">Recommended: 150-160 characters</p>
                        </div>
                    </div>

                    <Button
                        onClick={() => handleSave('SEO')}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-500"
                    >
                        <Save size={16} className="mr-2" />
                        {loading ? 'Saving...' : 'Update SEO'}
                    </Button>
                </motion.div>

                {/* Theme & Appearance */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-pink-500/20 rounded-lg">
                            <Palette className="text-pink-400" size={20} />
                        </div>
                        <div>
                            <h4 className="text-lg font-medium">Theme & Appearance</h4>
                            <p className="text-gray-400 text-sm">Customize your portfolio&apos;s visual style</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={settings.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    className="w-12 h-10 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm focus:border-pink-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Accent Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={settings.accentColor}
                                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                                    className="w-12 h-10 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.accentColor}
                                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm focus:border-pink-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <ToggleSetting
                            label="Dark Mode"
                            description="Use dark theme for the portfolio"
                            checked={settings.darkMode}
                            onChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                        />
                    </div>

                    <Button
                        onClick={() => handleSave('Theme')}
                        disabled={loading}
                        className="bg-pink-600 hover:bg-pink-500"
                    >
                        <Save size={16} className="mr-2" />
                        {loading ? 'Saving...' : 'Update Theme'}
                    </Button>
                </motion.div>

                {/* Notification Settings */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <Bell className="text-yellow-400" size={20} />
                        </div>
                        <div>
                            <h4 className="text-lg font-medium">Notifications</h4>
                            <p className="text-gray-400 text-sm">Manage email notifications and alerts</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <ToggleSetting
                            label="Email Notifications"
                            description="Receive email alerts for important events"
                            checked={settings.emailNotifications}
                            onChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                        />
                        <ToggleSetting
                            label="Contact Form Notifications"
                            description="Get notified when someone sends a message"
                            checked={settings.contactFormNotifications}
                            onChange={(checked) => setSettings({ ...settings, contactFormNotifications: checked })}
                        />
                        <ToggleSetting
                            label="Blog Comment Notifications"
                            description="Receive alerts for new blog comments"
                            checked={settings.blogCommentNotifications}
                            onChange={(checked) => setSettings({ ...settings, blogCommentNotifications: checked })}
                        />
                    </div>

                    <Button
                        onClick={() => handleSave('Notifications')}
                        disabled={loading}
                        className="bg-yellow-600 hover:bg-yellow-500"
                    >
                        <Save size={16} className="mr-2" />
                        {loading ? 'Saving...' : 'Save Notifications'}
                    </Button>
                </motion.div>

                {/* Security Settings */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                            <Shield className="text-red-400" size={20} />
                        </div>
                        <div>
                            <h4 className="text-lg font-medium">Security Settings</h4>
                            <p className="text-gray-400 text-sm">Manage account security and access</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <div>
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Change Password</h5>
                                <Button variant="outline" className="w-full border-gray-600">
                                    Update Password
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Two-Factor Authentication</h5>
                                <Button variant="outline" className="w-full border-gray-600">
                                    Enable 2FA
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <h5 className="text-red-400 font-medium mb-2">Danger Zone</h5>
                        <p className="text-gray-300 text-sm mb-3">
                            These actions are irreversible. Please be careful.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                Export Data
                            </Button>
                            <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Toggle Setting Component
const ToggleSetting = ({ label, description, checked, onChange }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) => (
    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
        <div>
            <p className="text-white font-medium text-sm">{label}</p>
            <p className="text-gray-400 text-xs">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
        </label>
    </div>
);

