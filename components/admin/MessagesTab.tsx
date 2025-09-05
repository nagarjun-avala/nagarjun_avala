// components/admin/MessagesTab.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, MoreHorizontal, Mail, Archive, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactSubmission } from '@prisma/client';

interface MessagesTabProps {
    messages: ContactSubmission[];
}

export const MessagesTab: React.FC<MessagesTabProps> = ({ messages }) => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

    const filteredMessages = messages.filter(msg =>
        statusFilter === 'all' || msg.status === statusFilter
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-xl font-semibold">Contact Messages</h3>
                    <p className="text-gray-400 text-sm">Manage and respond to visitor inquiries</p>
                </div>

                <div className="flex gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-cyan-500"
                    >
                        <option value="all">All Messages ({messages.length})</option>
                        <option value="new">New ({messages.filter(m => m.status === 'new').length})</option>
                        <option value="read">Read ({messages.filter(m => m.status === 'read').length})</option>
                        <option value="replied">Replied ({messages.filter(m => m.status === 'replied').length})</option>
                    </select>

                    <Button size="sm" variant="outline" className="border-green-500/30 text-green-400">
                        <Mail size={16} className="mr-2" />
                        Mark All Read
                    </Button>

                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-400">
                        <Trash2 size={16} className="mr-2" />
                        Clear Spam
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {filteredMessages.length > 0 ? filteredMessages.map((message, i) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`bg-gray-800/50 rounded-xl border transition-all duration-300 p-6 hover:border-cyan-500/30 ${message.status === 'new' ? 'border-green-500/30' : 'border-gray-700'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedMessages.includes(message.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedMessages([...selectedMessages, message.id]);
                                                } else {
                                                    setSelectedMessages(selectedMessages.filter(id => id !== message.id));
                                                }
                                            }}
                                            className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded"
                                        />
                                        <h4 className="text-white font-medium">{message.name}</h4>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${message.status === 'new'
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : message.status === 'read'
                                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                        {message.status}
                                    </span>
                                </div>
                                <p className="text-cyan-400 text-sm mb-3">{message.email}</p>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {message.message}
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-2 ml-4">
                                <span className="text-gray-400 text-xs">
                                    {new Date(message.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex gap-2">
                                    <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500">
                                        <Mail size={14} className="mr-1" />
                                        Reply
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        <Archive size={14} />
                                    </Button>
                                    <Button size="sm" variant="outline" className="p-2">
                                        <MoreHorizontal size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="text-center py-12">
                        <MessageSquare className="mx-auto text-gray-500 mb-4" size={48} />
                        <h4 className="text-lg font-medium text-gray-300 mb-2">No Messages Found</h4>
                        <p className="text-gray-400">
                            {statusFilter === 'all'
                                ? "When visitors contact you, their messages will appear here."
                                : `No ${statusFilter} messages found.`
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Bulk Actions */}
            {selectedMessages.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-cyan-500/30 rounded-xl p-4 shadow-2xl"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-white text-sm font-medium">
                            {selectedMessages.length} message{selectedMessages.length > 1 ? 's' : ''} selected
                        </span>
                        <div className="flex gap-2">
                            <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500">
                                <Mail size={14} className="mr-2" />
                                Mark as Read
                            </Button>
                            <Button size="sm" variant="outline">
                                <Archive size={14} className="mr-2" />
                                Archive
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/30 text-red-400">
                                <Trash2 size={14} className="mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};