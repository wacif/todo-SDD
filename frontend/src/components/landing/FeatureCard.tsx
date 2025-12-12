// frontend/src/components/landing/FeatureCard.tsx
import { Feature } from '@/lib/types/landing';
import { SparklesIcon, BoltIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const iconMap = {
  'SparklesIcon': SparklesIcon,
  'BoltIcon': BoltIcon,
  'UsersIcon': UsersIcon,
  'ChartBarIcon': ChartBarIcon,
};

const Icon = ({ iconName }: { iconName: string }) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || SparklesIcon;
  return <IconComponent className="w-8 h-8 text-primary-600" aria-hidden="true" />;
};

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 mb-4 bg-primary-100 rounded-full">
          <Icon iconName={feature.icon} />
        </div>
        <CardTitle className="text-xl">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-base">
          {feature.description}
        </p>
        {feature.benefit && (
          <p className="mt-3 text-sm font-medium text-primary-600">
            {feature.benefit}
          </p>
        )}
        {feature.expandable && (
          <a
            href={`#feature-detail-${feature.id}`}
            className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            aria-label={`Learn more about ${feature.title}`}
          >
            Learn more &rarr;
          </a>
        )}
      </CardContent>
    </Card>
  );
}
