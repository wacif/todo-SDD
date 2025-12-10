// frontend/lib/types/landing.ts
// Generated from specs/003-landing-page/data-model.md

// -----------------------------------------------------------------------------
// Core Entities
// -----------------------------------------------------------------------------

export interface CallToAction {
  label: string;              // Button text (2-4 words)
  href: string;               // Destination URL
  variant: 'primary' | 'secondary' | 'outline';
  ariaLabel: string;          // Accessibility label
}

export interface HeroVisual {
  src: string;                // Image path
  alt: string;                // Descriptive alt text
  width: number;              // Image width (px)
  height: number;             // Image height (px)
  priority: boolean;          // Load priority (true for hero)
}

export interface TrustBadge {
  icon: string;               // Icon name or path
  label: string;              // Badge text
}

export interface HeroContent {
  headline: string;           // Primary value proposition (5-10 words)
  subheadline: string;        // Supporting explanation (15-25 words)
  ctaPrimary: CallToAction;   // Main action button
  ctaSecondary?: CallToAction; // Optional secondary action
  heroVisual: HeroVisual;     // Hero image/illustration
  badges?: TrustBadge[];      // Optional trust indicators
}

export interface FeatureDetail {
  longDescription: string;    // Detailed explanation (50-150 words)
  screenshot?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  benefits: string[];         // List of specific benefits
}

export interface Feature {
  id: string;                 // Unique identifier (slug)
  icon: string;               // Heroicon name
  title: string;              // Feature name (2-6 words)
  description: string;        // Feature explanation (10-30 words)
  benefit?: string;           // Optional outcome statement
  expandable?: boolean;       // Can expand for more details
  detailContent?: FeatureDetail; // Extended content (if expandable)
}

export interface FeaturesSection {
  sectionTitle: string;       // Section heading
  sectionDescription?: string; // Optional section intro
  features: Feature[];        // Array of 3-5 features
}

export interface Testimonial {
  id: string;                 // Unique identifier
  quote: string;              // User testimonial (20-100 words)
  author: {
    name: string;             // Full name
    role: string;             // Job title or description
    company?: string;         // Optional company name
    avatar?: string;          // Optional profile photo path
  };
  rating?: number;            // Optional star rating (1-5)
}

export interface Statistic {
  number: string;             // Formatted number (e.g., "10,000+", "99%")
  label: string;              // Metric description (2-6 words)
  icon?: string;              // Optional icon name
  trend?: 'up' | 'down' | 'neutral'; // Optional trend indicator
}

export interface SocialProofSection {
  sectionTitle: string;       // Section heading
  testimonials: Testimonial[]; // Array of 2-4 testimonials
  statistics: Statistic[];    // Usage metrics
}

export interface WorkflowStep {
  stepNumber: number;         // Sequential order (1-based)
  title: string;              // Step name (2-5 words)
  description: string;        // Step explanation (15-40 words)
  icon: string;               // Visual icon for step
}

export interface HowItWorksSection {
  sectionTitle: string;       // Section heading
  sectionDescription?: string; // Optional intro
  steps: WorkflowStep[];      // Array of 3-5 steps
}

export interface NavigationItem {
  label: string;              // Link text
  href: string;               // Destination URL
  external?: boolean;         // Opens in new tab
  ariaLabel?: string;         // Accessibility label
}

export interface Navigation {
  logo: {
    src: string;              // Logo image path
    alt: string;              // Alt text
    href: string;             // Home link
  };
  links: NavigationItem[];    // Navigation links
  cta: CallToAction;          // Primary CTA button
  authLinks: {                // Auth-specific links
    login: NavigationItem;
    signup: NavigationItem;
    dashboard: NavigationItem; // For logged-in users
  };
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;              // Section heading
  links: FooterLink[];        // Links in section
}

export interface SocialLink {
  platform: 'twitter' | 'github' | 'linkedin' | 'youtube';
  url: string;
  ariaLabel: string;
}

export interface Footer {
  sections: FooterSection[];  // Grouped footer links
  copyright: string;          // Copyright text
  socialLinks?: SocialLink[]; // Optional social media
}

// -----------------------------------------------------------------------------
// State Interfaces (Minimal for static page)
// -----------------------------------------------------------------------------

export interface AuthState {
  isAuthenticated: boolean;   // User logged in
  user?: {
    id: string;
    name: string;
  };
}

export interface UIState {
  mobileMenuOpen: boolean;    // Mobile nav toggle
  expandedFeatureId?: string; // Currently expanded feature card
}

export interface LandingContent {
  hero: HeroContent;
  features: FeaturesSection;
  socialProof: SocialProofSection;
  howItWorks: HowItWorksSection;
  navigation: Navigation;
  footer: Footer;
}
