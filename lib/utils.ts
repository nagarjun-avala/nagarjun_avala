// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Experience } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format date for relative time (e.g., "2 days ago")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// Calculate reading time based on word count
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Generate slug from title
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim(); // Remove leading/trailing whitespace
}

// Validate environment variables
export function validateEnv() {
  const requiredEnvVars = ['DATABASE_URL'];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

type DateRange = {
  start: Date;
  end: Date;
};

export function calculateTotalExperience(
  experiences: Experience[]
): { years: number; months: number; totalMonths: number } {
  const now = new Date();

  // 1️⃣ Normalize ranges
  const ranges: DateRange[] = experiences.map(exp => ({
    start: new Date(exp.start),
    end: (!exp.end || exp.end === "present") ? now : new Date(exp.end)
  }));

  // 2️⃣ Sort by start date
  ranges.sort((a, b) => a.start.getTime() - b.start.getTime());

  // 3️⃣ Merge overlapping ranges
  const merged: DateRange[] = [];

  for (const range of ranges) {
    if (
      !merged.length ||
      range.start > merged[merged.length - 1].end
    ) {
      merged.push(range);
    } else {
      merged[merged.length - 1].end = new Date(
        Math.max(
          merged[merged.length - 1].end.getTime(),
          range.end.getTime()
        )
      );
    }
  }

  // 4️⃣ Calculate total months
  let totalMonths = 0;

  for (const range of merged) {
    const yearsDiff =
      range.end.getFullYear() - range.start.getFullYear();
    const monthsDiff =
      range.end.getMonth() - range.start.getMonth();

    totalMonths += yearsDiff * 12 + monthsDiff;
  }

  // 5️⃣ Convert to years + months
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return { years, months, totalMonths };
}

type ExperienceResult = {
  display: string;
  showPlus: boolean;
  displaySuffix?: string;
};

export function formatExperience(
  years: number,
  months: number,
): ExperienceResult {
  // 🟢 Case 1: Less than 1 year → show months only
  if (years === 0) {
    return {
      display: `${months} month${months > 1 ? "s" : ""}`,
      displaySuffix: "month" + (months > 1 ? "s" : ""),
      showPlus: false
    };
  }

  // 🟢 Case 2: Years >= 1
  const showPlus = months > 0;

  return {
    display: `${years}${showPlus ? "+" : ""} year${years > 1 ? "s" : ""}`,
    displaySuffix: "year" + (years > 1 ? "s" : ""),
    showPlus
  };
}
