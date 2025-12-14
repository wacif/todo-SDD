// frontend/src/components/landing/HowItWorks.tsx
import { HowItWorksSection, WorkflowStep } from '@/lib/types/landing';
import { ArrowLongRightIcon, UserPlusIcon, PlusCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

// Placeholder mapping for icons defined in data-model/constants
const iconMap = {
  UserPlusIcon: UserPlusIcon,
  PlusCircleIcon: PlusCircleIcon,
  CheckBadgeIcon: CheckBadgeIcon,
};

interface HowItWorksProps {
  content: HowItWorksSection;
}

const StepCard = ({ step, isLast }: { step: WorkflowStep; isLast: boolean }) => {
  const IconComponent = iconMap[step.icon as keyof typeof iconMap] || UserPlusIcon;

  return (
    <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">

      {/* Connector line (Mobile vertical) */}
      <div className={`absolute top-12 left-1/2 transform -translate-x-1/2 h-[calc(100%-3rem)] w-0.5 bg-gray-200 dark:bg-gray-700 lg:hidden ${isLast ? 'hidden' : ''}`} aria-hidden="true" />

      {/* Connector Arrow (Desktop horizontal, replaced by full-width line) */}
      {!isLast && (
        <div className="hidden lg:flex absolute top-1/2 left-[calc(100%_+_0.5rem)] transform -translate-y-1/2 z-0">
          <ArrowLongRightIcon className="w-8 h-8 text-indigo-400 dark:text-indigo-600" aria-hidden="true" />
        </div>
      )}

      {/* Step number and icon */}
      <div className="relative z-10 flex items-center justify-center w-12 h-12 mb-6 rounded-full bg-indigo-600 text-white font-bold text-lg shadow-lg dark:bg-indigo-500">
        <IconComponent className="w-6 h-6" aria-hidden="true" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {step.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 flex-grow max-w-sm">
        {step.description}
      </p>
    </div>
  );
};

// Server Component
export function HowItWorks({ content }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white dark:bg-gray-800" aria-labelledby="how-it-works-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="how-it-works-heading" className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
            {content.sectionTitle}
          </h2>
          {content.sectionDescription && (
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
              {content.sectionDescription}
            </p>
          )}
        </div>

        <div className="mt-16 relative">
          {/* Desktop horizontal line for visual continuity */}
          <div className="hidden lg:block absolute top-1/4 -mt-1 h-0.5 w-full bg-gray-200 dark:bg-gray-700" aria-hidden="true" />

          <div className="grid gap-12 lg:grid-cols-3">
            {content.steps.map((step, index) => (
              <div
                key={step.stepNumber}
                className="lg:col-span-1 lg:pt-8"
              >
                <StepCard step={step} isLast={index === content.steps.length - 1} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
