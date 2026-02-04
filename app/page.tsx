import { ContactAndFooter } from '@/components/ContactAndFooter';
import { HeroSection } from '@/components/Hero';
import AboutSection from '@/components/About';
import ProjectsSection from '@/components/Projects';
import ExperienceSection from '@/components/Experience';
import SkillsSection from '@/components/Skills';
import EducationSection from '@/components/Education';
import CertificationsSection from '@/components/Certifications';
import BlogsSection from '@/components/Blogs';
import Cursor from '@/components/Cursor';
import Navbar from '@/components/Navbar';
import { calculateTotalExperience, formatExperience } from '@/lib/utils';
import { MOCK_DATA, PortfolioDataTypes } from '@/lib/data';
import { Metadata } from 'next';

// Data Fetching Function
async function getData(): Promise<PortfolioDataTypes> {
  let fetchedData: any = null;

  try {
    let apiUri = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

    // Ensure absolute URL for server-side fetching
    if (apiUri.startsWith('/')) {
      apiUri = "http://localhost:5000/api";
    }

    // In SSR, we need absolute URL. 
    // console.log(`Fetching data from ${apiUri}/portfolio`);

    const res = await fetch(`${apiUri}/portfolio`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!res.ok) {
      console.error(`API Error: ${res.statusText}`);
      throw new Error(`API Error: ${res.statusText}`);
    }

    const json = await res.json();
    if (json.success && json.data) {
      fetchedData = json.data;
    } else {
      console.error("Invalid API response format");
    }

  } catch (error) {
    console.error("Failed to fetch portfolio data, falling back to mock data:", error);
    fetchedData = MOCK_DATA;
  }

  // If fetch failed completely or returned no data, use MOCK_DATA
  if (!fetchedData) {
    fetchedData = MOCK_DATA;
  }

  // --- Data Transformation ---

  // 1. Transform Dates in Experience
  const experienceTransformed = (fetchedData.experience || []).map((exp: any) => ({
    ...exp,
    start: new Date(exp.start),
    end: exp.end ? new Date(exp.end) : "present"
  }));

  // 2. Transform Dates in Certifications
  const certificationsTransformed = (fetchedData.certifications || []).map((cert: any) => ({
    ...cert,
    issueDate: new Date(cert.issueDate)
  }));


  // Calculate years of experience dynamically
  let totalYears = 0;
  let totalMonths = 0;
  let displayStr = "";
  let displaySuffixStr = "";
  let showPlusBool = false;

  if (experienceTransformed.length > 0) {
    const result = calculateTotalExperience(experienceTransformed);
    const { display, displaySuffix, showPlus } = formatExperience(result.years, result.months);
    totalYears = result.years;
    totalMonths = result.months;
    displayStr = display;
    displaySuffixStr = displaySuffix ?? "";
    showPlusBool = showPlus;
  }

  const name = fetchedData.name || MOCK_DATA.name;
  const firstName = name.split(' ')[0];

  const enrichedData: PortfolioDataTypes = {
    name: name,
    meta: {
      title: fetchedData.title || fetchedData.meta?.title || MOCK_DATA.meta.title,
      email: fetchedData.email || fetchedData.profile?.email || MOCK_DATA.meta.email,
      phone: fetchedData.phone || fetchedData.profile?.phone || MOCK_DATA.meta.phone
    },
    hero: fetchedData.hero ? {
      ...fetchedData.hero,
      ctaPrimary: fetchedData.hero.ctaPrimaryText || fetchedData.hero.ctaPrimary || MOCK_DATA.hero.ctaPrimary,
      ctaSecondary: fetchedData.hero.ctaSecondaryText || fetchedData.hero.ctaSecondary || MOCK_DATA.hero.ctaSecondary,
      ctaPrimaryLink: fetchedData.hero.ctaPrimaryLink,
      ctaSecondaryLink: fetchedData.hero.ctaSecondaryLink
    } : MOCK_DATA.hero,
    about: {
      ...fetchedData.about,
      title: `Hi, I'm ${firstName}.`,
      experience: {
        years: totalYears,
        months: totalMonths,
        label: fetchedData.about?.experienceLabel || MOCK_DATA.about.experience.label,
        display: displayStr || MOCK_DATA.about.experience.display,
        displaySuffix: displaySuffixStr,
        sign: showPlusBool ? "+" : ""
      },
      languages: fetchedData.about?.languages || MOCK_DATA.about.languages,
      location: fetchedData.about?.location || MOCK_DATA.about.location,
      image: fetchedData.avatar || fetchedData.about?.image || MOCK_DATA.about.image,
      description: fetchedData.about?.description || MOCK_DATA.about.description,
      skills: fetchedData.about?.skills || MOCK_DATA.about.skills
    },
    techStack: fetchedData.techStack || MOCK_DATA.techStack,
    education: fetchedData.education || MOCK_DATA.education,
    certifications: certificationsTransformed,
    projects: fetchedData.projects || MOCK_DATA.projects,
    experience: experienceTransformed,
    blogs: fetchedData.blogs || MOCK_DATA.blogs,
    avatar: fetchedData.avatar || MOCK_DATA.avatar,
    socials: fetchedData.socials || MOCK_DATA.socials,
    themeColor: fetchedData.themeColor,
    fontPairing: fetchedData.fontPairing,
    borderRadius: fetchedData.borderRadius
  };

  return enrichedData;
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getData();
  return {
    title: `${data.name} | Creative Developer`,
    description: data.meta.title,
  };
}

export default async function Home() {
  const data = await getData();

  return (
    <div className={`min-h-screen selection:bg-rose-500/30 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
      <Cursor />

      <Navbar isDetailView={false} />

      <main>
        <HeroSection data={data.hero} />
        <AboutSection data={data.about} />
        <SkillsSection techStack={data.techStack} />
        <ProjectsSection projects={data.projects} />
        <ExperienceSection experience={data.experience} totalExperiance={data.about.experience.display} />
        <EducationSection education={data.education} />
        <CertificationsSection certifications={data.certifications} />
        <BlogsSection blogs={data.blogs} />
        <ContactAndFooter email={data.meta.email} phone={data.meta.phone} name={data.name} socials={data.socials} />
      </main>
    </div>
  );
}