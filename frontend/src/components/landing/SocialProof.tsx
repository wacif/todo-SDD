// frontend/src/components/landing/SocialProof.tsx
import React from 'react';
import { SocialProofSection } from '@/lib/types/landing';
import { landingContent } from '@/lib/constants/landing-content';
import { TestimonialCard } from './TestimonialCard';
import { Star, CheckCircle, Users } from 'lucide-react'; // Assuming Lucide is available
import { motion } from 'framer-motion';

// Component mapping for statistics icons
const StatisticIconMap: Record<string, React.ElementType> = {
  'CheckCircle': CheckCircle,
  'Users': Users,
  'Star': Star,
};

interface SocialProofProps {
  socialProofContent: SocialProofSection;
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const SocialProofComponent: React.FC<SocialProofProps> = ({ socialProofContent }) => {
  const { sectionTitle, testimonials, statistics } = socialProofContent;

  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-indigo-50/50" aria-labelledby="social-proof-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="social-proof-heading" className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {sectionTitle}
          </h2>
        </div>

        {/* Testimonials Grid (FR-003) */}
        {testimonials && testimonials.length > 0 && (
          <motion.div
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.id} variants={itemVariants}>
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Statistics Row (FR-003) */}
        {statistics && statistics.length > 0 && (
          <motion.div
            className="mt-20 border-t border-gray-300 pt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
          >
            {statistics.map((stat, index) => {
              const Icon = StatisticIconMap[stat.icon || ''] || CheckCircle;
              return (
                <motion.div key={index} variants={itemVariants} className="flex flex-col items-center text-center">
                  <Icon className="h-10 w-10 text-indigo-600 mb-4" />
                  <p className="text-5xl font-extrabold text-gray-900">{stat.number}</p>
                  <p className="mt-2 text-base font-medium text-gray-500">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export const SocialProof = () => <SocialProofComponent socialProofContent={landingContent.socialProof} />;
export default SocialProof;
