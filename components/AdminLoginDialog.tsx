// components/AdminLoginDialog.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AdminUser } from '@prisma/client';

const LoginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof LoginSchema>;

interface AdminLoginDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: AdminUser) => void;
}

const AdminLoginDialog: React.FC<AdminLoginDialogProps> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Login successful!');
                onSuccess(result.user);
                reset();
                onClose();
            } else {
                toast.error(result.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-900/95 backdrop-blur border border-cyan-500/30 rounded-2xl p-8 w-full max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/20 rounded-lg">
                                    <Lock className="text-cyan-400" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Admin Access</h2>
                                    <p className="text-gray-400 text-sm">Enter your credentials</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        {...register('username')}
                                        type="text"
                                        placeholder="Username or Email"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
                                )}
                            </div>

                            <div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        className="w-full pl-11 pr-11 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        disabled={loading}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={18} />
                                            Signing In...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="mr-2" size={18} />
                                            Sign In
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </form>

                        {/* Demo Credentials */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg"
                        >
                            <p className="text-amber-400 text-xs font-medium mb-2">Demo Credentials:</p>
                            <div className="space-y-1 text-xs">
                                <p className="text-gray-300">Username: <span className="text-amber-300 font-mono">admin</span></p>
                                <p className="text-gray-300">Password: <span className="text-amber-300 font-mono">portfolio123</span></p>
                            </div>
                        </motion.div>

                        {/* Security Notice */}
                        <p className="text-gray-500 text-xs text-center mt-4">
                            🔐 This area is protected. Unauthorized access is prohibited.
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AdminLoginDialog;