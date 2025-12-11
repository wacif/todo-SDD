// frontend/src/components/landing/FeatureCard.tsx
import { Feature } from '@/lib/types/landing';
import { SparklesIcon, BoltIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// Placeholder component for dynamic icon rendering
const iconMap = {
  // Mapping to actual Heroicons based on placeholder names used in constants/landing-content.ts
  'SparklesIcon': SparklesIcon, // Used for Smart Prioritization
  'BoltIcon': BoltIcon,         // Used for Instant Capture
  'UsersIcon': UsersIcon,       // Used for Collaborative Lists
  'ChartBarIcon': ChartBarIcon, // Used for Deep Analytics
};

const Icon = ({ iconName }: { iconName: string }) => {
  // Default to a generic icon if the name isn't mapped
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || SparklesIcon;
  return <IconComponent className="w-8 h-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />;
};

interface FeatureCardProps {
  feature: Feature;
}

// Keeping this as a Server Component for initial load performance
export default function FeatureCard({ feature }: FeatureCardProps) {
  // Use className for subtle fade-in-up animation defined in tailwind.config.js (T013)
  return (
    <div className="group flex flex-col h-full p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 rounded-full dark:bg-indigo-900/50">
        <Icon iconName={feature.icon} />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {feature.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-base flex-grow">
        {feature.description}
      </p>

      {feature.benefit && (
        <p className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {feature.benefit}
        </p>
      )}

      {/* If feature is expandable, add a link/button. */}
      {feature.expandable && (
        <a
          href={`#feature-detail-${feature.id}`}
          className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          aria-label={`Learn more about ${feature.title}`}
        >
          Learn more &rarr;
        </a>
      )}
    </div>
  );
}
