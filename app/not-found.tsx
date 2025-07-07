// app/not-found.tsx

'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {  Home, Search } from "lucide-react";
import { useEffect } from "react";

export default function NotFoundPage() {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'h') window.location.href = '/';
            if (e.key.toLowerCase() === 'b') window.location.href = '/blog';
            if (e.key.toLowerCase() === 'p') window.location.href = '/projects';
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <motion.section
            className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-black via-black/80 to-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div
                className="absolute inset-0 pointer-events-none blur-xl opacity-20 animate-pulse"
                style={{ background: "radial-gradient(circle, #0ff, #00f, #000)" }}
            ></div>

            <motion.h1
                className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-500 drop-shadow-lg"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
            >
                404
            </motion.h1>

            <p className="mt-4 text-xl text-muted-foreground">
                Oops! The page you&apos;re looking for doesn’t exist.
            </p>

            <motion.form
                className="mt-6 w-full max-w-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="flex items-center bg-white/10 backdrop-blur rounded-xl overflow-hidden">
                    <Search className="ml-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search blog or projects..."
                        className="w-full px-3 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    />
                </div>
            </motion.form>

            <motion.div
                className="mt-8 flex flex-col gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Link href="/">
                    <Button className="relative overflow-hidden flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 group">
                        <span className="absolute inset-0 w-full h-full bg-white opacity-0 transition-opacity group-active:opacity-20 rounded-full"></span>
                        <Home size={16} /> Go back home
                        <motion.span
                            className="ml-2 text-xs text-white bg-black/30 px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            Shortcut: H
                        </motion.span>
                    </Button>
                </Link>
                <Link href="/blog">
                    <Button variant="outline" className="relative overflow-hidden flex items-center gap-2 text-cyan-400 border-cyan-400 group">
                        <span className="absolute inset-0 w-full h-full bg-cyan-200 opacity-0 transition-opacity group-active:opacity-10 rounded-full"></span>
                        📚 Visit Blog
                        <motion.span
                            className="ml-2 text-xs text-cyan-200 bg-cyan-800/30 px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                        >
                            Shortcut: B
                        </motion.span>
                    </Button>
                </Link>
                <Link href="/projects">
                    <Button variant="outline" className="relative overflow-hidden flex items-center gap-2 text-pink-400 border-pink-400 group">
                        <span className="absolute inset-0 w-full h-full bg-pink-200 opacity-0 transition-opacity group-active:opacity-10 rounded-full"></span>
                        🚀 View Projects
                        <motion.span
                            className="ml-2 text-xs text-pink-200 bg-pink-800/30 px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                        >
                            Shortcut: P
                        </motion.span>
                    </Button>
                </Link>
            </motion.div>

            <motion.p
                className="mt-8 text-xs text-gray-500"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                Tip: Press <code>H</code> for Home, <code>B</code> for Blog, <code>P</code> for Projects
            </motion.p>
        </motion.section>
    );
}
