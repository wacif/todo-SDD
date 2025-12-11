// frontend/src/components/landing/Hero.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroContent, CallToAction } from '@/lib/types/landing';
import { landingContent } from '@/lib/constants/landing-content';
// Assuming Lucide icons are available for badges
import { Zap, ShieldCheck, CheckCircle } from 'lucide-react';
// Motion components for subtle, performant CSS-based animations (FR-009)
import { motion } from 'framer-motion';

// Component mapping for badge icons
const BadgeIconMap: Record<string, React.ElementType> = {
  'Zap': Zap,
  'ShieldCheck': ShieldCheck,
  'CheckCircle': CheckCircle,
  // Add other icons used in landing-content.ts here
};

interface HeroProps {
  heroContent: HeroContent;
}

const Button: React.FC<CallToAction & { className?: string }> = ({ label, href, variant, ariaLabel, className }) => {
  // Simple button component to handle CTA styling (reused from LandingNav)
  let baseClasses = "inline-flex items-center justify-center rounded-lg text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 px-6 py-3";

  switch (variant) {
    case 'primary':
      baseClasses += " bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-xl hover:shadow-2xl";
      break;
    case 'outline':
      baseClasses += " border border-indigo-200 text-indigo-700 hover:bg-indigo-50 focus:ring-indigo-500";
      break;
    default:
      baseClasses += " bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500";
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={`${baseClasses} ${className}`}>
      {label}
    </Link>
  );
};

// Animation variants (T012 - Subtle animation)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.42, 0, 0.58, 1] as any, // easeOut bezier curve
    },
  },
};


export const HeroComponent: React.FC<HeroProps> = ({ heroContent }) => {
  const { headline, subheadline, ctaPrimary, ctaSecondary, heroVisual, badges } = heroContent;

  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-20 sm:pt-16 lg:pt-24 lg:pb-32" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-center">

          <motion.div
            className="col-span-12 lg:col-span-6 xl:col-span-5 pt-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {badges && badges.length > 0 && (
              <motion.div variants={itemVariants} className="mb-6 flex flex-wrap gap-x-6 gap-y-3">
                {badges.map((badge, index) => {
                  const Icon = BadgeIconMap[badge.icon] || CheckCircle;
                  return (
                    <div key={index} className="flex items-center space-x-2 text-sm text-indigo-700 bg-indigo-50 rounded-full px-4 py-1.5 font-medium border border-indigo-200">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{badge.label}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}

            <motion.h1
              id="hero-heading"
              className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:text-6xl xl:text-8xl"
              variants={itemVariants}
            >
              {headline}
            </motion.h1>

            <motion.p
              className="mt-6 text-lg text-gray-500 sm:text-xl max-w-lg"
              variants={itemVariants}
            >
              {subheadline}
            </motion.p>

            <motion.div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4" variants={itemVariants}>
              <Button {...ctaPrimary} variant="primary" />
              {ctaSecondary && <Button {...ctaSecondary} variant="outline" className="mt-3 sm:mt-0" />}
            </motion.div>
          </motion.div>

          {/* Visual (Right Column) */}
          <motion.div
            className="mt-12 lg:mt-0 col-span-12 lg:col-span-6 lg:col-start-7 xl:col-start-7 xl:col-span-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Image
              src={heroVisual.src}
              alt={heroVisual.alt}
              width={heroVisual.width}
              height={heroVisual.height}
              priority={heroVisual.priority}
              className="mx-auto w-full lg:max-w-none rounded-lg shadow-2xl ring-1 ring-gray-900/10"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const LandingHero = () => <HeroComponent heroContent={landingContent.hero} />;
export default LandingHero;
