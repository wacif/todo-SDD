// frontend/src/components/landing/FeaturesSection.tsx
import { FeaturesSection, Feature } from '@/lib/types/landing';
import FeatureCard from './FeatureCard';

interface FeaturesSectionProps {
  content: FeaturesSection;
}

// Server Component
export default function LandingFeaturesSection({ content }: FeaturesSectionProps) {
  return (
    <section id="features" className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="features-heading" className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
            {content.sectionTitle}
          </h2>
          {content.sectionDescription && (
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
              {content.sectionDescription}
            </p>
          )}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-4 md:grid-cols-2">
          {content.features.map((feature: Feature, index: number) => (
            // Apply a staggered fade-in animation for visual appeal using CSS (T027 optimization)
            <div
              key={feature.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
