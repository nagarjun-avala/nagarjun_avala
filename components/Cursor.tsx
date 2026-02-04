"use client"
import { motion } from 'framer-motion'
import { useMotionValue, useSpring } from 'motion/react';
import { useEffect } from 'react'

type Props = {}

const Cursor = (props: Props) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX - 16);
            mouseY.set(e.clientY - 16);
        };
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, [mouseX, mouseY]);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 rounded-full bg-rose-500 pointer-events-none z-9999 mix-blend-difference hidden md:block"
                style={{ x: mouseX, y: mouseY, translateX: 8, translateY: 8 }}
            />
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-rose-500 pointer-events-none z-9998 hidden md:block"
                style={{ x: cursorX, y: cursorY }}
            />
        </>
    );
}

export default Cursor