"use client"
import { ArrowLeft, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { motion, useScroll } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";

type Props = {
    isDetailView: boolean;
};

const Navbar = ({ isDetailView }: Props) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const { scrollY } = useScroll();
    const lastYRef = useRef(0);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = theme === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    const navItems = [
        "Hero",
        "Profile",
        "Skills",
        "Work",
        "Timeline",
        "Education",
        "Blogs",
        "Connect",
    ];

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            const previous = lastYRef.current;
            // Show navbar if scrolling up or at the top
            if (latest < previous || latest < 50) {
                setIsVisible(true);
            } else if (latest > previous && latest < 50) {
                // Hide navbar if scrolling down
                setIsVisible(false);
                setIsMobileMenuOpen(false); // Close menu on hide
            }
            lastYRef.current = latest;
        });
        return () => unsubscribe();
    }, [scrollY]);

    if (isDetailView) {
        return (
            <motion.nav
                animate={{ y: isVisible ? 0 : -100 }}
                transition={{ duration: 0.3 }}
                className="fixed top-6 left-0 w-full flex justify-center z-50 px-4"
            >
                <div className="backdrop-blur-md bg-white/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 flex items-center gap-2 shadow-2xl">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="gap-2"
                    >
                        <Link href="/">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                    </Button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-2" />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-full"
                    >
                        {mounted ? (isDark ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )) : <div className="w-4 h-4" />}
                    </Button>
                </div>
            </motion.nav>
        );
    }

    return (
        <>
            <motion.nav
                animate={{ y: isVisible ? 0 : -100 }}
                transition={{ duration: 0.3 }}
                className="fixed top-6 left-0 w-full flex justify-center z-50 px-4"
            >
                <div className="backdrop-blur-md bg-white/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 flex items-center justify-between md:justify-center gap-2 shadow-2xl w-full max-w-sm md:w-auto md:max-w-max">
                    {/* Mobile: Left Menu Button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </Button>
                    </div>

                    {/* Desktop: Horizontal Links */}
                    <div className="hidden md:flex items-center gap-1 overflow-x-auto max-w-[90vw] no-scrollbar">
                        {navItems.map((item) => (
                            <Button key={item} variant="ghost" size="sm" asChild>
                                <a
                                    href={`#${item.toLowerCase() === "index" ? "hero" : item.toLowerCase()
                                        }`}
                                >
                                    {item}
                                </a>
                            </Button>
                        ))}
                    </div>

                    {/* Right: Theme Toggle (Visible on both) */}
                    <div className="flex items-center gap-2">
                        <div className="hidden md:block w-px h-4 bg-slate-300 dark:bg-slate-700 mx-2" />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="rounded-full"
                        >
                            {mounted ? (isDark ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )) : <div className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-20 left-4 right-4 z-40 md:hidden"
                    >
                        <div className="backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-2xl flex flex-col gap-1">
                            {navItems.map((item) => (
                                <Button
                                    key={item}
                                    variant="ghost"
                                    size="lg"
                                    className="justify-start w-full"
                                    asChild
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <a
                                        href={`#${item.toLowerCase() === "index"
                                            ? "hero"
                                            : item.toLowerCase()
                                            }`}
                                    >
                                        {item}
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
