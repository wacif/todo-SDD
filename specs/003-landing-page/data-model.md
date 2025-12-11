# Data Model: Landing Page Content Entities

**Feature**: Professional Landing Page & Website Design  
**Date**: 2025-12-09  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the content entities and data structures for the landing page. Since the landing page is static content (no database persistence), these entities represent TypeScript interfaces for component props and content constants.

## Core Entities

### 1. Hero Section

**Purpose**: Above-the-fold section that captures attention and communicates value proposition.

**Entity Definition**:
```typescript
interface HeroContent {
  headline: string;           // Primary value proposition (5-10 words)
  subheadline: string;        // Supporting explanation (15-25 words)
  ctaPrimary: CallToAction;   // Main action button
  ctaSecondary?: CallToAction; // Optional secondary action
  heroVisual: HeroVisual;     // Hero image/illustration
  badges?: TrustBadge[];      // Optional trust indicators
}

interface CallToAction {
  label: string;              // Button text (2-4 words)
  href: string;               // Destination URL
  variant: 'primary' | 'secondary' | 'outline';
  ariaLabel: string;          // Accessibility label
}

interface HeroVisual {
  src: string;                // Image path
  alt: string;                // Descriptive alt text
  width: number;              // Image width (px)
  height: number;             // Image height (px)
  priority: boolean;          // Load priority (true for hero)
}

interface TrustBadge {
  icon: string;               // Icon name or path
  label: string;              // Badge text
}
```

**Validation Rules**:
- `headline`: 5-60 characters, no punctuation at end
- `subheadline`: 50-200 characters, complete sentence
- `ctaPrimary.label`: 2-25 characters, action-oriented verb
- `heroVisual.alt`: Descriptive, not "image" or "photo"

**Example Data**:
```typescript
const heroContent: HeroContent = {
  headline: "Your tasks, simplified",
  subheadline: "Stop juggling scattered to-do lists. Organize, prioritize, and accomplish more with one powerful tool.",
  ctaPrimary: {
    label: "Start organizing for free",
    href: "/signup",
    variant: "primary",
    ariaLabel: "Sign up for a free account",
  },
  ctaSecondary: {
    label: "See how it works",
    href: "#features",
    variant: "outline",
    ariaLabel: "Scroll to features section",
  },
  heroVisual: {
    src: "/images/landing/hero-illustration.svg",
    alt: "Illustration of organized task list with checkmarks",
    width: 600,
    height: 400,
    priority: true,
  },
  badges: [
    { icon: "CheckBadgeIcon", label: "Free to start" },
    { icon: "ShieldCheckIcon", label: "Secure & private" },
  ],
};
```

---

### 2. Feature Card

**Purpose**: Showcase individual product capabilities with visual icon and description.

**Entity Definition**:
```typescript
interface Feature {
  id: string;                 // Unique identifier (slug)
  icon: string;               // Heroicon name
  title: string;              // Feature name (2-6 words)
  description: string;        // Feature explanation (10-30 words)
  benefit?: string;           // Optional outcome statement
  expandable?: boolean;       // Can expand for more details
  detailContent?: FeatureDetail; // Extended content (if expandable)
}

interface FeatureDetail {
  longDescription: string;    // Detailed explanation (50-150 words)
  screenshot?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  benefits: string[];         // List of specific benefits
}

interface FeaturesSection {
  sectionTitle: string;       // Section heading
  sectionDescription?: string; // Optional section intro
  features: Feature[];        // Array of 3-5 features
}
```

**Validation Rules**:
- `id`: Lowercase, hyphen-separated (e.g., "smart-reminders")
- `title`: 2-40 characters, title case
- `description`: 50-200 characters, complete sentence
- `features.length`: 3-5 features (optimal for landing page)

**Example Data**:
```typescript
const featuresSection: FeaturesSection = {
  sectionTitle: "Everything you need to stay organized",
  sectionDescription: "Simple yet powerful features that help you manage tasks efficiently.",
  features: [
    {
      id: "smart-reminders",
      icon: "BellAlertIcon",
      title: "Never miss a deadline",
      description: "Smart reminders and due date tracking keep you on schedule automatically.",
      benefit: "Reduce stress and improve reliability",
    },
    {
      id: "priority-system",
      icon: "StarIcon",
      title: "Focus on what matters",
      description: "Priority levels and filters help you focus on high-impact work first.",
      benefit: "Increase productivity by 40%",
    },
    {
      id: "quick-capture",
      icon: "BoltIcon",
      title: "Capture tasks instantly",
      description: "Add tasks in seconds from any device. No complicated forms or menus.",
      benefit: "Save 10 minutes per day",
    },
  ],
};
```

---

### 3. Testimonial

**Purpose**: Provide social proof through user quotes and credibility indicators.

**Entity Definition**:
```typescript
interface Testimonial {
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

interface SocialProofSection {
  sectionTitle: string;       // Section heading
  testimonials: Testimonial[]; // Array of 2-4 testimonials
  statistics: Statistic[];    // Usage metrics
}
```

**Validation Rules**:
- `quote`: 100-500 characters, authentic voice
- `author.name`: Full name (first + last)
- `author.role`: Professional title, not generic
- `rating`: Integer 1-5 if present

**Example Data**:
```typescript
const socialProofSection: SocialProofSection = {
  sectionTitle: "Trusted by thousands of productive people",
  testimonials: [
    {
      id: "testimonial-sarah",
      quote: "This app helped me reclaim 5 hours a week. I finally feel in control of my workload instead of drowning in it.",
      author: {
        name: "Sarah Johnson",
        role: "Product Manager",
        company: "TechCorp",
        avatar: "/images/landing/testimonials/sarah.jpg",
      },
      rating: 5,
    },
    {
      id: "testimonial-michael",
      quote: "The priority system changed everything. I used to waste time on low-impact tasks. Now I always know what to do next.",
      author: {
        name: "Michael Chen",
        role: "Freelance Designer",
      },
      rating: 5,
    },
  ],
  statistics: [
    { number: "10,000+", label: "Tasks completed daily", icon: "CheckCircleIcon" },
    { number: "5,000+", label: "Active users", icon: "UsersIcon" },
    { number: "4.9/5", label: "Average rating", icon: "StarIcon" },
  ],
};
```

---

### 4. Statistic

**Purpose**: Display quantifiable social proof and usage metrics.

**Entity Definition**:
```typescript
interface Statistic {
  number: string;             // Formatted number (e.g., "10,000+", "99%")
  label: string;              // Metric description (2-6 words)
  icon?: string;              // Optional icon name
  trend?: 'up' | 'down' | 'neutral'; // Optional trend indicator
}
```

**Validation Rules**:
- `number`: Formatted with commas/+/% for readability
- `label`: Concise, avoid jargon
- Numbers should be credible (not exaggerated)

**Example Data**:
```typescript
const statistics: Statistic[] = [
  {
    number: "10,000+",
    label: "Tasks completed daily",
    icon: "CheckCircleIcon",
    trend: "up",
  },
  {
    number: "5,000+",
    label: "Active users",
    icon: "UsersIcon",
    trend: "up",
  },
  {
    number: "4.9/5",
    label: "Average rating",
    icon: "StarIcon",
  },
];
```

---

### 5. How It Works Step

**Purpose**: Explain user workflow in simple, sequential steps.

**Entity Definition**:
```typescript
interface WorkflowStep {
  stepNumber: number;         // Sequential order (1-based)
  title: string;              // Step name (2-5 words)
  description: string;        // Step explanation (15-40 words)
  icon: string;               // Visual icon for step
}

interface HowItWorksSection {
  sectionTitle: string;       // Section heading
  sectionDescription?: string; // Optional intro
  steps: WorkflowStep[];      // Array of 3-5 steps
}
```

**Validation Rules**:
- `stepNumber`: Sequential integers starting at 1
- `title`: Action-oriented (verb + object)
- `steps.length`: 3-5 steps (optimal for comprehension)

**Example Data**:
```typescript
const howItWorksSection: HowItWorksSection = {
  sectionTitle: "Get organized in minutes",
  sectionDescription: "Simple workflow that fits into your existing routine.",
  steps: [
    {
      stepNumber: 1,
      title: "Create your account",
      description: "Sign up with email in 30 seconds. No credit card required.",
      icon: "UserPlusIcon",
    },
    {
      stepNumber: 2,
      title: "Add your tasks",
      description: "Quickly capture tasks with due dates, priorities, and categories.",
      icon: "PlusCircleIcon",
    },
    {
      stepNumber: 3,
      title: "Stay on track",
      description: "Get reminders, mark tasks complete, and watch your productivity soar.",
      icon: "CheckBadgeIcon",
    },
  ],
};
```

---

### 6. Navigation Menu

**Purpose**: Provide site navigation and prominent CTAs.

**Entity Definition**:
```typescript
interface NavigationItem {
  label: string;              // Link text
  href: string;               // Destination URL
  external?: boolean;         // Opens in new tab
  ariaLabel?: string;         // Accessibility label
}

interface Navigation {
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
```

**Validation Rules**:
- `links.length`: 3-6 links (avoid overwhelming users)
- `logo.alt`: Brand name, not "logo"
- CTAs distinct from regular links (button styling)

**Example Data**:
```typescript
const navigation: Navigation = {
  logo: {
    src: "/images/logo.svg",
    alt: "Todo App",
    href: "/",
  },
  links: [
    { label: "Features", href: "#features", ariaLabel: "Jump to features section" },
    { label: "How it works", href: "#how-it-works", ariaLabel: "Jump to how it works section" },
    { label: "Testimonials", href: "#testimonials", ariaLabel: "Jump to testimonials section" },
  ],
  cta: {
    label: "Start for free",
    href: "/signup",
    variant: "primary",
    ariaLabel: "Sign up for free account",
  },
  authLinks: {
    login: {
      label: "Login",
      href: "/login",
      ariaLabel: "Log in to your account",
    },
    signup: {
      label: "Sign up",
      href: "/signup",
      ariaLabel: "Create a free account",
    },
    dashboard: {
      label: "Go to Dashboard",
      href: "/tasks",
      ariaLabel: "Go to your task dashboard",
    },
  },
};
```

---

### 7. Footer

**Purpose**: Provide legal, contact, and supplementary information.

**Entity Definition**:
```typescript
interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;              // Section heading
  links: FooterLink[];        // Links in section
}

interface Footer {
  sections: FooterSection[];  // Grouped footer links
  copyright: string;          // Copyright text
  socialLinks?: SocialLink[]; // Optional social media
}

interface SocialLink {
  platform: 'twitter' | 'github' | 'linkedin' | 'youtube';
  url: string;
  ariaLabel: string;
}
```

**Validation Rules**:
- `sections.length`: 2-4 sections (Legal, Company, Resources, etc.)
- Links must include privacy policy and terms of service
- `copyright`: Current year + company name

**Example Data**:
```typescript
const footer: Footer = {
  sections: [
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Blog", href: "/blog" },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} Todo App. All rights reserved.`,
  socialLinks: [
    {
      platform: "twitter",
      url: "https://twitter.com/todoapp",
      ariaLabel: "Follow us on Twitter",
    },
    {
      platform: "github",
      url: "https://github.com/todoapp",
      ariaLabel: "View our GitHub repository",
    },
  ],
};
```

---

## State Management

Since the landing page is static content, state management is minimal:

### Client-Side State

```typescript
// Auth state (client-side detection)
interface AuthState {
  isAuthenticated: boolean;   // User logged in
  user?: {
    id: string;
    name: string;
  };
}

// UI state (expandable features, mobile menu)
interface UIState {
  mobileMenuOpen: boolean;    // Mobile nav toggle
  expandedFeatureId?: string; // Currently expanded feature card
}
```

### State Transitions

**Authentication Detection**:
```
Anonymous → Authenticated (on page load, check auth cookie)
```

**Mobile Menu**:
```
Closed → Open (user clicks hamburger icon)
Open → Closed (user clicks close button or selects link)
```

**Feature Expansion** (if implemented):
```
Collapsed → Expanded (user clicks "Learn more")
Expanded → Collapsed (user clicks "Show less" or another card)
```

---

## Content Storage

**Location**: `/frontend/lib/constants/landing-content.ts`

All content entities will be exported as constants:

```typescript
// lib/constants/landing-content.ts
export const landingContent = {
  hero: heroContent,
  features: featuresSection,
  socialProof: socialProofSection,
  howItWorks: howItWorksSection,
  navigation,
  footer,
};
```

**Rationale**: Centralized content makes updates easy and enables future CMS integration if needed.

---

## Type Exports

All interfaces will be exported from a types file for reuse across components:

```typescript
// lib/types/landing.ts
export type {
  HeroContent,
  CallToAction,
  HeroVisual,
  TrustBadge,
  Feature,
  FeatureDetail,
  FeaturesSection,
  Testimonial,
  SocialProofSection,
  Statistic,
  WorkflowStep,
  HowItWorksSection,
  NavigationItem,
  Navigation,
  FooterLink,
  FooterSection,
  Footer,
  SocialLink,
  AuthState,
  UIState,
};
```

---

## Summary

**Entities Defined**: 7 core entities (Hero, Feature, Testimonial, Statistic, WorkflowStep, Navigation, Footer)  
**Data Location**: `/frontend/lib/constants/landing-content.ts`  
**Type Definitions**: `/frontend/lib/types/landing.ts`  
**Validation**: TypeScript interfaces + runtime validation for user input (if CMS added later)  
**State Management**: Minimal client-side state (auth detection, mobile menu, feature expansion)

This data model supports all 15 functional requirements from the specification and enables test-driven development with clear contracts.
