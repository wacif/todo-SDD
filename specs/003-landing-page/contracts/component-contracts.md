# Component Contracts: Landing Page

**Feature**: Professional Landing Page & Website Design  
**Date**: 2025-12-09  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the contracts (props interfaces) for all landing page React components. Since this is a frontend-only feature, contracts are TypeScript interfaces rather than API endpoints.

---

## Component Hierarchy

```
LandingPage (app/page.tsx)
├── LandingNav
├── Hero
├── Features
│   └── FeatureCard (×3-5)
├── HowItWorks
│   └── WorkflowStep (×3-5)
├── SocialProof
│   └── Testimonial (×2-4)
│   └── Statistic (×3-4)
└── Footer
    └── FooterSection (×2-4)
```

---

## Component Contracts

### 1. LandingNav Component

**Purpose**: Site navigation with logo, links, and CTAs. Conditional rendering based on auth state.

**Props Contract**:
```typescript
interface LandingNavProps {
  logo: {
    src: string;
    alt: string;
    href: string;
  };
  links: NavigationItem[];
  cta: CallToAction;
  authLinks: {
    login: NavigationItem;
    signup: NavigationItem;
    dashboard: NavigationItem;
  };
  className?: string;
}

interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

interface CallToAction {
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
  ariaLabel: string;
}
```

**Behavior**:
- Sticky navigation on scroll (applies `sticky top-0 z-50` classes)
- Mobile: Hamburger menu below 768px
- Auth detection: Shows "Login" + "Sign up" for anonymous users, "Go to Dashboard" for authenticated users
- Smooth scroll for anchor links (e.g., `#features`)

**Accessibility**:
- `role="banner"` on `<header>`
- `role="navigation"` on `<nav>`
- `aria-label="Main navigation"`
- Focus trap in mobile menu when open
- Escape key closes mobile menu

**Test Contract**:
```typescript
describe('LandingNav', () => {
  it('renders logo with correct link');
  it('renders all navigation links');
  it('shows login/signup for anonymous users');
  it('shows dashboard link for authenticated users');
  it('becomes sticky on scroll');
  it('opens mobile menu on hamburger click (mobile viewport)');
  it('closes mobile menu on escape key');
  it('has proper ARIA labels');
});
```

---

### 2. Hero Component

**Purpose**: Above-the-fold hero section with headline, CTA, and visual.

**Props Contract**:
```typescript
interface HeroProps {
  headline: string;
  subheadline: string;
  ctaPrimary: CallToAction;
  ctaSecondary?: CallToAction;
  heroVisual: HeroVisual;
  badges?: TrustBadge[];
  className?: string;
}

interface HeroVisual {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority: boolean;
}

interface TrustBadge {
  icon: string;        // Heroicon name
  label: string;
}
```

**Behavior**:
- Hero visual uses `next/image` with `priority={true}` (LCP optimization)
- Responsive layout: Stacked (mobile), side-by-side (desktop ≥1024px)
- CTAs use `<Button>` component with appropriate variants
- Fade-in animation on page load (Framer Motion)

**Accessibility**:
- `<h1>` for headline (only one h1 per page)
- `<h2>` for subheadline (or large `<p>`)
- CTA buttons have descriptive `aria-label`
- Hero visual has descriptive `alt` text

**Test Contract**:
```typescript
describe('Hero', () => {
  it('renders headline and subheadline');
  it('renders primary CTA with correct link');
  it('renders secondary CTA if provided');
  it('renders hero visual with priority loading');
  it('renders trust badges if provided');
  it('has h1 element with correct text');
  it('CTAs have aria-labels');
});
```

---

### 3. Features Component

**Purpose**: Section showcasing 3-5 product features with icons.

**Props Contract**:
```typescript
interface FeaturesProps {
  sectionTitle: string;
  sectionDescription?: string;
  features: Feature[];
  className?: string;
}

interface Feature {
  id: string;
  icon: string;        // Heroicon name
  title: string;
  description: string;
  benefit?: string;
  expandable?: boolean;
  detailContent?: FeatureDetail;
}

interface FeatureDetail {
  longDescription: string;
  screenshot?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  benefits: string[];
}
```

**Behavior**:
- Responsive grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Icons from Heroicons library
- If `expandable={true}`, show "Learn more" button
- Scroll-triggered fade-in animation (Framer Motion `whileInView`)

**Accessibility**:
- `<section>` with `aria-labelledby="features-heading"`
- Feature cards use `<article>` elements
- Icons have `aria-hidden="true"` (decorative)

**Test Contract**:
```typescript
describe('Features', () => {
  it('renders section title and description');
  it('renders all feature cards');
  it('passes correct props to FeatureCard');
  it('uses responsive grid layout');
  it('has proper ARIA labels');
});
```

---

### 4. FeatureCard Component

**Purpose**: Individual feature card with icon, title, description.

**Props Contract**:
```typescript
interface FeatureCardProps {
  feature: Feature;
  className?: string;
}

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  benefit?: string;
  expandable?: boolean;
  detailContent?: FeatureDetail;
}
```

**Behavior**:
- Icon rendered from Heroicons (24×24px base size)
- Hover effect: Subtle scale (1.02) and shadow increase
- If `expandable={true}`, clicking card/button shows modal with `detailContent`
- Benefit text styled differently (e.g., muted color, smaller font)

**Accessibility**:
- `<article>` element for semantic structure
- Icon has `aria-hidden="true"`
- If expandable, button has `aria-label="Learn more about {title}"`
- Modal (if shown) has `role="dialog"` and focus trap

**Test Contract**:
```typescript
describe('FeatureCard', () => {
  it('renders icon, title, and description');
  it('renders benefit if provided');
  it('shows "Learn more" button if expandable');
  it('applies hover effects');
  it('has proper semantic HTML (article)');
});
```

---

### 5. HowItWorks Component

**Purpose**: Step-by-step workflow explanation.

**Props Contract**:
```typescript
interface HowItWorksProps {
  sectionTitle: string;
  sectionDescription?: string;
  steps: WorkflowStep[];
  className?: string;
}

interface WorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
}
```

**Behavior**:
- Vertical layout (mobile), horizontal with connecting line (desktop)
- Step numbers displayed in circles
- Icons from Heroicons
- Scroll-triggered stagger animation (each step fades in sequentially)

**Accessibility**:
- `<section>` with `aria-labelledby="how-it-works-heading"`
- `<ol>` for step list (ordered list)
- Icons are decorative (`aria-hidden="true"`)

**Test Contract**:
```typescript
describe('HowItWorks', () => {
  it('renders section title and description');
  it('renders all workflow steps in order');
  it('uses ordered list for semantic structure');
  it('step numbers are sequential');
  it('has proper ARIA labels');
});
```

---

### 6. SocialProof Component

**Purpose**: Display testimonials and usage statistics.

**Props Contract**:
```typescript
interface SocialProofProps {
  sectionTitle: string;
  testimonials: Testimonial[];
  statistics: Statistic[];
  className?: string;
}

interface Testimonial {
  id: string;
  quote: string;
  author: {
    name: string;
    role: string;
    company?: string;
    avatar?: string;
  };
  rating?: number;
}

interface Statistic {
  number: string;
  label: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}
```

**Behavior**:
- Two-part layout: Testimonials grid + Statistics row
- Testimonials: 1 column (mobile), 2 columns (desktop)
- Statistics: Horizontal row, wraps on mobile
- Avatar images use `next/image` with lazy loading
- Star ratings rendered visually (accessible to screen readers)

**Accessibility**:
- `<section>` with `aria-labelledby="social-proof-heading"`
- Testimonials use `<blockquote>` with `<cite>`
- Star ratings have `aria-label="Rated {rating} out of 5 stars"`
- Avatar images have `alt="{author name} profile photo"`

**Test Contract**:
```typescript
describe('SocialProof', () => {
  it('renders section title');
  it('renders all testimonials');
  it('renders all statistics');
  it('testimonials use blockquote elements');
  it('ratings have aria-labels');
  it('has proper semantic structure');
});
```

---

### 7. Testimonial Component (Sub-component)

**Purpose**: Individual testimonial card.

**Props Contract**:
```typescript
interface TestimonialProps {
  testimonial: Testimonial;
  className?: string;
}

interface Testimonial {
  id: string;
  quote: string;
  author: {
    name: string;
    role: string;
    company?: string;
    avatar?: string;
  };
  rating?: number;
}
```

**Behavior**:
- Quote displayed in larger font with quotation marks
- Author info below quote (name, role, company)
- Avatar image (if provided) uses `next/image` with lazy loading
- Star rating (if provided) displayed visually

**Accessibility**:
- `<blockquote>` for quote
- `<cite>` for author attribution
- Rating has `aria-label="Rated {rating} out of 5 stars"`

**Test Contract**:
```typescript
describe('Testimonial', () => {
  it('renders quote in blockquote');
  it('renders author name and role');
  it('renders company if provided');
  it('renders avatar if provided');
  it('renders star rating if provided');
  it('rating has aria-label');
});
```

---

### 8. Footer Component

**Purpose**: Site footer with legal links, company info, and social media.

**Props Contract**:
```typescript
interface FooterProps {
  sections: FooterSection[];
  copyright: string;
  socialLinks?: SocialLink[];
  className?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface SocialLink {
  platform: 'twitter' | 'github' | 'linkedin' | 'youtube';
  url: string;
  ariaLabel: string;
}
```

**Behavior**:
- Responsive layout: Stacked sections (mobile), 4-column grid (desktop)
- Social links render as icon buttons
- Copyright text centered at bottom
- Minimal styling (muted colors, smaller text)

**Accessibility**:
- `<footer>` with `role="contentinfo"`
- Link sections use `<nav>` with `aria-label="{section title}"`
- External links have `rel="noopener noreferrer"`
- Social icons have descriptive `aria-label`

**Test Contract**:
```typescript
describe('Footer', () => {
  it('renders all footer sections');
  it('renders all links in each section');
  it('renders copyright text');
  it('renders social links if provided');
  it('external links have rel attributes');
  it('social links have aria-labels');
  it('has role="contentinfo"');
});
```

---

## Shared Component Contracts

### Button Component (Reused from existing UI library)

**Props Contract**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}
```

**Usage in Landing Page**:
- CTAs use `variant="primary"` or `variant="outline"`
- Size `lg` for hero CTAs, `md` for other buttons
- `aria-label` always provided for context

---

### Badge Component (Reused from existing UI library)

**Props Contract**:
```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}
```

**Usage in Landing Page**:
- Trust badges in hero section (`variant="success"`)
- Optional feature highlights

---

## Animation Contracts

### Framer Motion Variants

**Fade In Up** (Hero, Feature Cards):
```typescript
const fadeInUpVariant = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};
```

**Stagger Children** (Features Grid, How It Works):
```typescript
const staggerContainerVariant = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItemVariant = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
```

**Reduced Motion Handling**:
```typescript
const shouldReduceMotion = typeof window !== 'undefined' && 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const variants = shouldReduceMotion 
  ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
  : fadeInUpVariant;
```

---

## Testing Contracts Summary

### Component Test Requirements (Jest + React Testing Library)

Each component must have tests covering:
1. **Rendering**: All props render correctly
2. **Interactions**: Click handlers, keyboard navigation
3. **Accessibility**: ARIA labels, semantic HTML, focus management
4. **Responsive**: Layout changes at breakpoints (viewport mocking)
5. **Edge cases**: Missing optional props, empty arrays

### E2E Test Requirements (Playwright)

Landing page E2E tests must cover:
1. **Anonymous user journey**: View landing page → Click "Sign up" → Reach signup page
2. **Authenticated user journey**: View landing page (logged in) → Click "Go to Dashboard" → Reach dashboard
3. **Feature exploration**: Click feature "Learn more" → Modal opens with details
4. **Mobile navigation**: Open mobile menu → Click link → Menu closes, smooth scroll
5. **Performance**: Lighthouse audit (90+ performance, 95+ accessibility)

---

## Contract Validation

All component props will use TypeScript for compile-time validation:

```typescript
// Example: Strict type checking prevents contract violations
<Hero 
  headline="Your tasks, simplified"
  subheadline="Organize, prioritize, accomplish"
  ctaPrimary={{
    label: "Start for free",
    href: "/signup",
    variant: "primary", // ✅ Valid
    // variant: "danger", // ❌ TypeScript error: not in union type
    ariaLabel: "Sign up for free account",
  }}
  heroVisual={{
    src: "/images/hero.svg",
    alt: "Task organization illustration",
    width: 600,
    height: 400,
    priority: true,
  }}
/>
```

**Runtime Validation** (optional, for CMS integration later):
- Use Zod schemas to validate content at runtime
- Prevents malformed content from breaking UI

---

## Summary

**Total Components**: 8 (LandingNav, Hero, Features, FeatureCard, HowItWorks, SocialProof, Testimonial, Footer)  
**Reused Components**: 2 (Button, Badge from existing UI library)  
**Contract Files**: This document defines all TypeScript interfaces  
**Test Coverage Target**: 85%+ per constitution  
**Accessibility Standard**: WCAG 2.1 AA (all components)

All contracts support the 15 functional requirements from the specification and enable parallel component development with clear interfaces.
