// frontend/tests/components/landing/Features.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { landingContent } from '@/lib/constants/landing-content';

import FeatureCard from '@/src/components/landing/FeatureCard';
import FeaturesSection from '@/src/components/landing/FeaturesSection';
import HowItWorks from '@/src/components/landing/HowItWorks';
import { Feature } from '@/lib/types/landing';

// Mock Heroicons to prevent dependency issues in test environment
jest.mock('@heroicons/react/24/outline', () => ({
  SparklesIcon: () => <svg data-testid="SparklesIcon" />,
  BoltIcon: () => <svg data-testid="BoltIcon" />,
  UsersIcon: () => <svg data-testid="UsersIcon" />,
  ChartBarIcon: () => <svg data-testid="ChartBarIcon" />,
  ArrowLongRightIcon: () => <svg data-testid="ArrowIcon" />,
  UserPlusIcon: () => <svg data-testid="UserPlusIcon" />,
  PlusCircleIcon: () => <svg data-testid="PlusCircleIcon" />,
  CheckBadgeIcon: () => <svg data-testid="CheckBadgeIcon" />,
}));


// --- FeatureCard Tests ---
describe('FeatureCard', () => {
  const feature = landingContent.features.features[0] as Feature; // Smart Prioritization

  it('renders title, description, and benefit', () => {
    render(<FeatureCard feature={feature} />);

    expect(screen.getByRole('heading', { name: feature.title })).toBeInTheDocument();
    expect(screen.getByText(feature.description)).toBeInTheDocument();
    expect(screen.getByText(feature.benefit!)).toBeInTheDocument();
  });

  it('renders the correct icon placeholder', () => {
    render(<FeatureCard feature={feature} />);
    // Check for the icon name based on the data model/constants
    expect(screen.getByTestId('SparklesIcon')).toBeInTheDocument();
  });

  it('renders "Learn more" link if expandable', () => {
    render(<FeatureCard feature={feature} />);

    const link = screen.getByRole('link', { name: `Learn more about ${feature.title}` });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `#feature-detail-${feature.id}`);
  });
});


// --- FeaturesSection Tests ---
describe('FeaturesSection', () => {
  const content = landingContent.features;

  it('renders the section title and description', () => {
    render(<FeaturesSection content={content} />);

    expect(screen.getByRole('heading', { name: content.sectionTitle })).toBeInTheDocument();
    expect(screen.getByText(content.sectionDescription!)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /everything you need/i })).toBeInTheDocument(); // Check for semantic section tag
  });

  it('renders all feature cards', () => {
    render(<FeaturesSection content={content} />);

    // Check for all feature titles from the constant data
    content.features.forEach((feature) => {
      expect(screen.getByRole('heading', { name: feature.title })).toBeInTheDocument();
    });

    // Check for the total number of cards
    const featureHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(featureHeadings.length).toBe(content.features.length);
  });
});


// --- HowItWorks Tests ---
describe('HowItWorks', () => {
  const content = landingContent.howItWorks;

  it('renders the section title and description', () => {
    render(<HowItWorks content={content} />);

    expect(screen.getByRole('heading', { name: content.sectionTitle })).toBeInTheDocument();
    expect(screen.getByText(content.sectionDescription!)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /The simple workflow/i })).toBeInTheDocument(); // Check for semantic section tag
  });

  it('renders all workflow steps', () => {
    render(<HowItWorks content={content} />);

    // Check for all step titles and descriptions
    content.steps.forEach((step) => {
      expect(screen.getByRole('heading', { name: step.title })).toBeInTheDocument();
      expect(screen.getByText(step.description)).toBeInTheDocument();
      // Check for the icon based on the mock map (assuming the component logic is correct)
      expect(screen.getByTestId(step.icon)).toBeInTheDocument();
    });

    // Check that there are 3 step titles
    const stepHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(stepHeadings.length).toBe(content.steps.length);
  });
});
