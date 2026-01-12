import React from 'react'
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
    toggleTheme: () => void, isDark: boolean, sections: {
        hero: boolean;
        about: boolean;
        projects: any;
        experience: any;
        blogs: any;
    }
}

const Navbar = ({ toggleTheme, isDark, sections }: Props) => {
    const navItems = [
        { id: 'hero', label: 'Index', show: sections.hero },
        { id: 'about', label: 'Profile', show: sections.about },
        { id: 'work', label: 'Work', show: sections.projects },
        { id: 'experience', label: 'Timeline', show: sections.experience },
        { id: 'blogs', label: 'Blogs', show: sections.blogs },
        { id: 'contact', label: 'Connect', show: true }
    ];

    return (
        <nav className="fixed top-6 left-0 w-full flex justify-center z-50 px-4">
            <div className="backdrop-blur-md bg-white/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-full px-2 py-2 flex items-center gap-2 shadow-2xl overflow-x-auto max-w-[90vw] no-scrollbar">
                {navItems.filter(item => item.show).map((item) => (
                    <Button key={item.id} variant="ghost" size="sm" asChild>
                        <a href={`#${item.id}`}>{item.label}</a>
                    </Button>
                ))}
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-2" />
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
            </div>
        </nav>
    );
}

export default Navbar





