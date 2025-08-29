// components/DynamicHome.tsx
import { Download, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import { MdMail } from "react-icons/md";
import { motion } from 'framer-motion';
import { Profile } from '@prisma/client';

interface DynamicHomeProps {
    profile: Profile;
}

const DynamicHomeComponent: React.FC<DynamicHomeProps> = ({ profile }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="relative flex justify-center mb-6">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Image
                        src={profile.avatarUrl || `https://github.com/${profile.githubUrl?.split('/').pop()}.png`}
                        alt={`${profile.name}'s avatar`}
                        width={120}
                        height={120}
                        className="rounded-full border-4 border-cyan-500 shadow-lg"
                    />
                </motion.div>
            </div>

            <motion.h1
                className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                {profile.name}
            </motion.h1>

            <motion.p
                className="text-base sm:text-lg text-gray-300 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                {profile.title}
            </motion.p>

            {profile.bio && (
                <motion.p
                    className="text-sm sm:text-base text-gray-400 mt-4 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {profile.bio}
                </motion.p>
            )}

            {profile.location && (
                <motion.div
                    className="flex items-center justify-center gap-1 mt-2 text-gray-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    <MapPin size={16} />
                    <span className="text-sm">{profile.location}</span>
                </motion.div>
            )}

            <motion.div
                className="flex justify-center gap-5 mt-6 items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                {profile.githubUrl && (
                    <Link
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors duration-300 transform hover:scale-110"
                    >
                        <SiGithub size={24} />
                    </Link>
                )}

                {profile.linkedinUrl && (
                    <Link
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors duration-300 transform hover:scale-110"
                    >
                        <SiLinkedin size={24} />
                    </Link>
                )}

                <Link
                    href={`mailto:${profile.email}`}
                    className="hover:text-cyan-400 transition-colors duration-300 transform hover:scale-110"
                >
                    <MdMail size={24} />
                </Link>

                {profile.phone && (
                    <Link
                        href={`tel:${profile.phone}`}
                        className="hover:text-cyan-400 transition-colors duration-300 transform hover:scale-110"
                    >
                        <Phone size={24} />
                    </Link>
                )}

                {profile.resumeUrl && (
                    <Link
                        href={profile.resumeUrl}
                        download
                        className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-300 transform hover:scale-105 bg-cyan-600/20 px-3 py-1 rounded-full border border-cyan-500/30"
                    >
                        <Download size={18} />
                        <span className="text-sm">Resume</span>
                    </Link>
                )}
            </motion.div>
        </motion.div>
    );
};

export default DynamicHomeComponent;