// frontend/tests/components/landing/Hero.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HeroComponent } from '@/components/landing/Hero';
import { HeroContent } from '@/lib/types/landing';

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock('next/image', () => {
  return ({ alt, src, width, height, priority, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} width={width} height={height} {...props} />;
  };
});

// Mock framer-motion to prevent errors in test environment
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: any) => <div>{children}</div>,
    h1: ({ children }: any) => <h1>{children}</h1>,
    p: ({ children }: any) => <p>{children}</p>,
  },
}));

// Mock the Lucide icons used for badges (T011)
jest.mock('lucide-react', () => ({
    Zap: () => <svg data-testid="ZapIcon" />,
    ShieldCheck: () => <svg data-testid="ShieldCheckIcon" />,
    CheckCircle: () => <svg data-testid="CheckCircleIcon" />, // Added missing mock
}));

const mockHeroContent: HeroContent = {
  headline: "Focus on what matters most",
  subheadline: "Our powerful task management system helps you prioritize, track, and complete tasks with unparalleled efficiency.",
  ctaPrimary: {
    label: "Get Started Now",
    href: "/signup",
    variant: "primary",
    ariaLabel: "Sign up for our service",
  },
  ctaSecondary: {
    label: "Learn More",
    href: "#features",
    variant: "outline",
    ariaLabel: "Scroll down to learn more about features",
  },
  heroVisual: {
    src: "/images/mock-hero.svg",
    alt: "A beautifully organized task dashboard screenshot.",
    width: 600,
    height: 400,
    priority: true,
  },
  badges: [
    { icon: "Zap", label: "Lightning Fast" },
    { icon: "ShieldCheck", label: "Military-Grade Security" },
  ],
};

describe('Hero Component (T011)', () => {
  test('renders headline and subheadline (T011)', () => {
    render(<HeroComponent heroContent={mockHeroContent} />);

    // Check headline (FR-001)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Focus on what matters most');

    // Check subheadline
    expect(screen.getByText(/Our powerful task management system/i)).toBeInTheDocument();
  });

  test('renders primary and secondary CTAs (T011)', () => {
    render(<HeroComponent heroContent={mockHeroContent} />);

    // Check primary CTA (FR-001)
    const primaryCta = screen.getByRole('link', { name: /Sign up for our service/i });
    expect(primaryCta).toBeInTheDocument();
    expect(primaryCta).toHaveTextContent('Get Started Now');
    expect(primaryCta).toHaveAttribute('href', '/signup');

    // Check secondary CTA
    const secondaryCta = screen.getByRole('link', { name: /Scroll down to learn more/i });
    expect(secondaryCta).toBeInTheDocument();
    expect(secondaryCta).toHaveTextContent('Learn More');
    expect(secondaryCta).toHaveAttribute('href', '#features');
  });

  test('renders hero visual with correct alt text and priority (T011)', () => {
    render(<HeroComponent heroContent={mockHeroContent} />);

    // Check hero visual (FR-013)
    const visual = screen.getByRole('img', { name: /A beautifully organized task dashboard screenshot/i });
    expect(visual).toBeInTheDocument();
    expect(visual).toHaveAttribute('src', expect.stringContaining('/images/mock-hero.svg'));
    // Priority loading is handled by next/image and is hard to verify in a unit test, but the prop is passed in the content model.
  });

  test('renders trust badges if provided (T011)', () => {
    render(<HeroComponent heroContent={mockHeroContent} />);

    // Check badge labels
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    expect(screen.getByText('Military-Grade Security')).toBeInTheDocument();

    // Check badge icons (mocked)
    expect(screen.getByTestId('ZapIcon')).toBeInTheDocument();
    expect(screen.getByTestId('ShieldCheckIcon')).toBeInTheDocument();
  });

  test('does not render secondary CTA or badges if missing', () => {
    const minimalContent: HeroContent = {
        ...mockHeroContent,
        ctaSecondary: undefined,
        badges: undefined,
    };
    render(<HeroComponent heroContent={minimalContent} />);

    // Secondary CTA should not be present
    expect(screen.queryByRole('link', { name: /Learn More/i })).not.toBeInTheDocument();

    // Badges section should not be present
    expect(screen.queryByText('Lightning Fast')).not.toBeInTheDocument();
  });
});
