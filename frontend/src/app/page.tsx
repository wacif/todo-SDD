// frontend/src/app/page.tsx
import type { Metadata } from 'next';
import dynamicImport from 'next/dynamic';
import { landingContent } from '@/lib/constants/landing-content';

// Set page to be statically generated at build time (research.md #1)
export const dynamic = 'force-static';

// Critical components (should be Server Components)
import LandingNav from '@/src/components/landing/LandingNav'; // T007/T009
import Hero from '@/src/components/landing/Hero'; // T010
import Footer from '@/src/components/landing/Footer'; // T005

// Dynamically import below-fold components for performance optimization (T025, T027)
const SocialProof = dynamicImport(() => import('@/src/components/landing/SocialProof'), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse py-16" />,
  // Setting up intersection observer in dynamic component handles lazy loading (T025)
}); // T018

const FeaturesSection = dynamicImport(() => import('@/src/components/landing/FeaturesSection'), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-50 dark:bg-gray-900 animate-pulse py-24" />,
}); // T021

const HowItWorks = dynamicImport(() => import('@/src/components/landing/HowItWorks'), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse py-16" />,
}); // T022


// --- SEO Metadata (T027 requirement, research.md #7) ---
export const metadata: Metadata = {
  title: 'Todo App - Your tasks, simplified',
  description: 'Organize, prioritize, and accomplish more with intelligent task management. Free to start.',
  openGraph: {
    title: 'Todo App - Your tasks, simplified',
    description: 'Organize, prioritize, and accomplish more with intelligent task management.',
    url: 'https://yourdomain.com',
    siteName: 'Todo App',
    // Placeholder image
    images: [{ url: 'https://yourdomain.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Todo App - Your tasks, simplified',
    description: 'Organize, prioritize, and accomplish more with intelligent task management.',
    images: ['https://yourdomain.com/og-image.png'],
  },
};

// Next.js App Router root route ('/')
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* T007/T009: Navigation */}
      <LandingNav />

      <main className="flex-grow">
        {/* T010: Hero Section (US1 - P1) */}
        <Hero />

        {/* T018: Social Proof (US2 - P2) */}
        <SocialProof />

        {/* T021: Features Section (US3 - P3) */}
        <FeaturesSection content={landingContent.features} />

        {/* T022: How it Works (FR-010) */}
        <HowItWorks content={landingContent.howItWorks} />
      </main>

      {/* T005: Footer (FR-006) */}
      <Footer />
    </div>
  );
}
