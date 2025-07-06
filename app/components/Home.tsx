import { Download, Mail, Linkedin, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const GITHUB_USERNAME = "nagarjun-avala"; // Replace with your GitHub username
const AVATAR_URL = `https://github.com/${GITHUB_USERNAME}.png`;

const HomeComponent = () => {
  return (
    <>
      <div className="relative flex justify-center mb-6">
        <Image
          src={AVATAR_URL}
          alt="GitHub avatar"
          width={120}
          height={120}
          className="rounded-full border-4 border-cyan-500 shadow-lg"
        />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Nagarjun Avala
      </h1>
      <p className="text-base sm:text-lg text-gray-300 mt-2">
        Web Developer | Aspiring Data Engineer
      </p>
      <div className="flex justify-center gap-5 mt-6">
        <Link
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="hover:text-cyan-400 transition" />
        </Link>
        <Link
          href="https://linkedin.com/in/nagarjun-avala"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="hover:text-cyan-400 transition" />
        </Link>
        <Link href="mailto:nagarjun.avala.official@gmail.com">
          <Mail className="hover:text-cyan-400 transition" />
        </Link>
        <Link
          href="/resume.pdf"
          download
          className="flex items-center gap-1 hover:text-cyan-400 transition"
        >
          <Download size={18} /> Resume
        </Link>
      </div>
    </>
  );
}

export default HomeComponent