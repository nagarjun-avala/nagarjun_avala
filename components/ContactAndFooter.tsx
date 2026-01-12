"use client"
import { ArrowRight, ArrowUpRight, Github, Linkedin, Terminal, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

// Component: Local Time Display
const LocalTime = () => {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour12: false }) + " " + (now.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2] || ''));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return <span className="font-mono text-slate-500 dark:text-slate-400">{time}</span>;
};

// Combined Contact & Footer (Mega Footer)
export const ContactAndFooter = ({ email, name }: { email: string, name: string }) => {
    return (
        <footer id="contact" className="bg-slate-50 dark:bg-slate-950 pt-32 pb-12 border-t border-slate-200 dark:border-slate-900">
            <div className="max-w-7xl mx-auto px-4">

                {/* Hero CTA & Form Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    {/* Left: CTA */}
                    <div className="flex flex-col justify-center text-center lg:text-left">
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
                            Let's build <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 dark:from-rose-400 dark:to-purple-500">something epic.</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6">
                            <Button size="lg" className="text-xl h-auto py-4 px-8 rounded-full" asChild>
                                <a href={`mailto:${email}`}>
                                    {email} <ArrowUpRight className="ml-2" size={24} />
                                </a>
                            </Button>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg mt-2">
                                Open for freelance projects, collaborations, and consulting opportunities.
                            </p>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div>
                        <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-2">
                            <CardHeader>
                                <CardTitle>Send a Message</CardTitle>
                                <CardDescription>Got a project in mind? Let's talk.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
                                        <Input placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                                        <Input placeholder="john@example.com" type="email" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Message</label>
                                    <Textarea placeholder="Tell me about your project..." className="min-h-[150px]" />
                                </div>
                                <Button className="w-full font-bold h-12 text-md">Send Message</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 border-t border-slate-200 dark:border-slate-900 pt-16">
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-slate-900 dark:text-white font-bold text-xl mb-6 flex items-center gap-2">
                            <Terminal className="text-rose-500" /> {name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-500 leading-relaxed mb-6">
                            Crafting digital experiences with code and creative design. Based in the Cloud.
                        </p>
                        <div className="flex gap-4">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"><Github className="w-5 h-5" /></Button>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"><Twitter className="w-5 h-5" /></Button>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"><Linkedin className="w-5 h-5" /></Button>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-slate-900 dark:text-slate-300 font-bold mb-6">Sitemap</h4>
                        <ul className="space-y-4 text-slate-600 dark:text-slate-500">
                            <li><a href="#hero" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">Home</a></li>
                            <li><a href="#work" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">Work</a></li>
                            <li><a href="#about" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">About</a></li>
                            <li><a href="#blogs" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">Writing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-slate-900 dark:text-slate-300 font-bold mb-6">Services</h4>
                        <ul className="space-y-4 text-slate-600 dark:text-slate-500">
                            <li>Web Development</li>
                            <li>DevOps & CI/CD</li>
                            <li>UI/UX Design</li>
                            <li>Performance Optimization</li>
                        </ul>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <h4 className="text-slate-900 dark:text-slate-300 font-bold mb-6">Newsletter</h4>
                        <p className="text-slate-600 dark:text-slate-500 text-sm mb-4">Subscribe for latest updates.</p>
                        <div className="flex gap-2">
                            <Input placeholder="Email address" className="bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                            <Button variant="default" size="icon" className="shrink-0"><ArrowRight className="w-4 h-4" /></Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center text-slate-600 dark:text-slate-500 text-sm pt-8 border-t border-slate-200 dark:border-slate-900">
                    <div className="flex items-center gap-4">
                        <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
                        <span className="hidden md:inline text-slate-400 dark:text-slate-800">|</span>
                        <LocalTime />
                    </div>
                    <div className="flex gap-2 items-center mt-4 md:mt-0">
                        <span>Built with React, Tailwind, Framer Motion & Shadcn/UI</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
};