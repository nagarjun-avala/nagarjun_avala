"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VisitorCounter() {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await fetch("/api/visitors", { method: "POST" });
                const data = await res.json();
                setCount(data.totalVisitors || 0);
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
                    key={count}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="text-lg font-semibold"
                >
                    {count !== null ? (
                        <>👀 {count.toLocaleString()} unique visitors</>
                    ) : (
                        <>Loading visitor count...</>
                    )}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}
