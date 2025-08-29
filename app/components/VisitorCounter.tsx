"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VisitorCounter() {
    const [analytics, setAnalytics] = useState({
        totalVisitors: 0,
        yourVisits: 0,
        location: {
            country: "",
        }
    });

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await fetch("/api/visitors", { method: "POST" });
                const data = await res.json();
                setAnalytics(data);
            } catch (err) {
                console.error("Failed to fetch visitors:", err);
            }
        };
        fetchCount();
    }, []);

    return (
        <div className="text-center py-6 text-muted-foreground">
            <AnimatePresence mode="wait">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="text-lg font-semibold"
                >
                    {analytics.totalVisitors !== null ? (
                        <>👀 {analytics.totalVisitors.toLocaleString()} unique visitors</>
                    ) : (
                        <>Loading visitor count...</>
                    )}
                    {analytics.location?.country && (
                        <span className="text-sm text-cyan-400">
                            👋 Hello from {analytics.location.country}!
                        </span>
                    )}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}
