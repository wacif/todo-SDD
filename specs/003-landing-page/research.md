# Research: Landing Page Implementation

**Feature**: Professional Landing Page & Website Design  
**Date**: 2025-12-09  
**Phase**: 0 - Research & Technical Decisions

## Research Tasks Completed

### 1. Next.js 16 Landing Page Best Practices

**Decision**: Use Next.js App Router with static export for optimal performance

**Rationale**:
- **App Router** (vs Pages Router): Supports React Server Components, streaming, and better performance out-of-the-box
- **Static Export**: Landing page has no dynamic server-side data, can be pre-rendered at build time
- **Turbopack**: Already enabled in project (Next.js 16 default), provides faster builds
- **Image Optimization**: Use `next/image` with priority loading for hero, lazy loading for below-fold

**Alternatives Considered**:
1. **Client-side only (SPA)**: Rejected - worse SEO, slower initial load
2. **Server-side rendering (SSR)**: Rejected - unnecessary for static marketing content, adds latency
3. **Incremental Static Regeneration (ISR)**: Rejected - no content updates needed between deployments

**Implementation Notes**:
- Root route `app/page.tsx` uses `export const dynamic = 'force-static'`
- All landing components are React Server Components (default)
- Auth state detection happens client-side via `'use client'` navigation component
- Images stored in `public/images/landing/`, optimized with `next/image`

**References**:
- Next.js App Router: https://nextjs.org/docs/app
- Static Exports: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- Image Optimization: https://nextjs.org/docs/app/building-your-application/optimizing/images

---

### 2. Responsive Design Strategy

**Decision**: Mobile-first design with Tailwind CSS responsive utilities

**Rationale**:
- **Mobile-first approach**: Start with 320px base, progressively enhance for larger screens
- **Tailwind breakpoints**:
  - `sm: 640px` - Small tablets
  - `md: 768px` - Tablets
  - `lg: 1024px` - Desktops
  - `xl: 1280px` - Large desktops
- **Fluid typography**: Use `clamp()` CSS function for responsive text scaling without breakpoints
- **Container queries**: Use for feature cards to adapt based on available space (not parent viewport)

**Alternatives Considered**:
1. **Desktop-first**: Rejected - mobile traffic is majority, harder to simplify complex layouts
2. **CSS Grid only**: Rejected - Flexbox better for linear landing page sections
3. **Custom breakpoints**: Rejected - Tailwind defaults align with industry standards

**Implementation Notes**:
```tsx
// Hero section example
<section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
  <h1 className="text-4xl sm:text-5xl lg:text-6xl">
    {/* Responsive heading */}
  </h1>
</section>

// Fluid typography example
<style jsx>{`
  h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
  }
`}</style>
```

**References**:
- Tailwind Responsive Design: https://tailwindcss.com/docs/responsive-design
- Fluid Typography: https://css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-viewport/

---

### 3. Animation & Micro-Interactions

**Decision**: Use CSS transitions + Framer Motion (already installed) for complex animations

**Rationale**:
- **CSS transitions**: Lightweight, GPU-accelerated, sufficient for hover effects and simple fade-ins
- **Framer Motion**: React animation library with declarative API, ideal for scroll-triggered animations
- **Intersection Observer**: Native API for scroll animations, wrapped by Framer Motion's `useInView`
- **Performance**: CSS animations run on compositor thread (no main thread blocking)
- **Accessibility**: Respect `prefers-reduced-motion` to disable animations for users with vestibular disorders

**Alternatives Considered**:
1. **GSAP**: Rejected - overkill for landing page, larger bundle size
2. **Pure CSS keyframes**: Rejected - harder to coordinate scroll-based animations
3. **React Spring**: Rejected - Framer Motion has better Next.js integration

**Implementation Notes**:
```tsx
// Simple CSS transition (hover effects)
<button className="transition-all duration-300 hover:scale-105">
  Sign Up
</button>

// Scroll-triggered fade-in with Framer Motion
import { motion, useInView } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
>
  {/* Feature card */}
</motion.div>

// Respect reduced motion preference
const shouldReduceMotion = typeof window !== 'undefined' && 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
>
```

**References**:
- Framer Motion: https://www.framer.com/motion/
- MDN prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

---

### 4. Performance Optimization Strategy

**Decision**: Multi-layered optimization for Lighthouse 90+/95+ scores

**Rationale**:
- **Critical CSS**: Inline Tailwind styles for above-the-fold content
- **Code splitting**: Dynamic imports for below-fold components
- **Image optimization**:
  - WebP format with AVIF fallback (Next.js handles automatically)
  - Priority loading for hero image
  - Lazy loading for testimonials, features below fold
  - Responsive images with `srcset` (Next.js generates)
- **Font optimization**: 
  - Use `next/font` with `display: swap` to prevent layout shift
  - Preload font files for critical text
- **Bundle size**: Tree-shake unused Tailwind utilities (production build)
- **Lighthouse CI**: Automated performance testing in PR workflow

**Alternatives Considered**:
1. **Third-party CDN for images**: Rejected - Next.js image optimization is sufficient
2. **Service worker caching**: Deferred - can add in Phase IV (cloud deployment)
3. **Edge runtime**: Rejected - no server-side logic needed

**Implementation Notes**:
```tsx
// Priority image loading (hero)
import Image from 'next/image';

<Image
  src="/images/landing/hero-illustration.svg"
  alt="Hero illustration"
  width={600}
  height={400}
  priority
/>

// Lazy loading (below fold)
<Image
  src="/images/landing/feature-icon.svg"
  alt="Feature icon"
  width={64}
  height={64}
  loading="lazy"
/>

// Font optimization
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

// Dynamic import for heavy component
const Testimonials = dynamic(() => import('@/components/landing/SocialProof'), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200" />
});
```

**Performance Budget**:
- Initial HTML: < 50KB gzipped
- Critical CSS: < 20KB
- JavaScript: < 200KB (including React + Next.js runtime)
- Hero image: < 100KB (WebP)
- Total page weight: < 1MB on initial load

**References**:
- Next.js Image Optimization: https://nextjs.org/docs/app/building-your-application/optimizing/images
- Lighthouse Performance: https://developer.chrome.com/docs/lighthouse/performance/performance-scoring

---

### 5. Accessibility Standards (WCAG 2.1 AA)

**Decision**: Implement semantic HTML, ARIA labels, keyboard navigation, and contrast ratios

**Rationale**:
- **WCAG 2.1 AA compliance**: Required for 95+ Lighthouse accessibility score
- **Semantic HTML**: Use `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` for proper document structure
- **ARIA labels**: Add `aria-label` to interactive elements, `aria-describedby` for context
- **Keyboard navigation**: Ensure all CTAs and links are reachable via Tab, Enter/Space activate
- **Color contrast**: Minimum 4.5:1 for normal text, 3:1 for large text (18px+ or bold 14px+)
- **Focus indicators**: Visible focus rings (`focus:ring-2 focus:ring-offset-2`)
- **Alt text**: Descriptive alt text for all images (decorative images use `alt=""`)

**Alternatives Considered**:
1. **AAA compliance**: Rejected - not required, 7:1 contrast ratio too restrictive for brand colors
2. **ARIA overuse**: Rejected - native HTML semantics preferred over ARIA when possible
3. **Skip link only**: Rejected - full keyboard navigation required for all features

**Implementation Notes**:
```tsx
// Semantic HTML structure
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    {/* Navigation items */}
  </nav>
</header>

<main role="main">
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">Your tasks, simplified</h1>
    <button aria-label="Sign up for free account">
      Sign Up
    </button>
  </section>
</main>

<footer role="contentinfo">
  {/* Footer content */}
</footer>

// Color contrast checker (design tokens)
const colors = {
  primary: '#3B82F6', // 4.5:1 on white
  text: '#1F2937',    // 16:1 on white
  secondary: '#6B7280', // 4.6:1 on white
};

// Focus visible (Tailwind)
<a className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Learn More
</a>
```

**Testing Strategy**:
- Automated: Lighthouse CI, axe-core in Jest tests
- Manual: Keyboard-only navigation testing
- Screen reader: VoiceOver (macOS) or NVDA (Windows) testing

**References**:
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/

---

### 6. Content Strategy & Copywriting

**Decision**: Use benefit-driven copy with Problem-Agitate-Solution (PAS) framework

**Rationale**:
- **PAS Framework**:
  1. **Problem**: "Tired of scattered to-do lists and missed deadlines?"
  2. **Agitate**: "You're not alone. 80% of people feel overwhelmed by task management."
  3. **Solution**: "Our app brings order to chaos with intelligent task organization."
- **Benefit-focused**: Lead with outcomes ("Get more done") not features ("Has drag-and-drop")
- **Action-oriented CTAs**: "Start organizing for free" (specific) vs "Sign up" (vague)
- **Social proof**: Specific numbers ("10,000+ tasks completed") more credible than vague claims

**Alternatives Considered**:
1. **Feature-first**: Rejected - users care about outcomes, not technical details
2. **Long-form sales copy**: Rejected - modern users scan, don't read walls of text
3. **Humorous tone**: Rejected - professional productivity tool requires serious tone

**Implementation Notes**:
```tsx
// Hero section copy
const heroCopy = {
  headline: "Your tasks, simplified",
  subheadline: "Stop juggling scattered to-do lists. Organize, prioritize, and accomplish more with one powerful tool.",
  cta: "Start organizing for free",
};

// Features (benefit-focused)
const features = [
  {
    title: "Never miss a deadline",
    description: "Smart reminders and due date tracking keep you on schedule.",
    benefit: "Reduce stress and improve reliability",
  },
  {
    title: "See what matters most",
    description: "Priority levels and filters help you focus on high-impact work.",
    benefit: "Increase productivity by 40%",
  },
];

// Social proof (specific)
const socialProof = {
  testimonials: [
    {
      quote: "This app helped me reclaim 5 hours a week. I finally feel in control.",
      author: "Sarah Johnson",
      role: "Product Manager",
    },
  ],
  statistics: [
    { number: "10,000+", label: "Tasks completed daily" },
    { number: "5,000+", label: "Active users" },
  ],
};
```

**References**:
- Copywriting formulas: https://copyblogger.com/copywriting-formulas/
- SaaS landing page best practices: https://www.julian.com/guide/startup/landing-pages

---

### 7. SEO Fundamentals

**Decision**: Implement meta tags, Open Graph, schema markup, and sitemap

**Rationale**:
- **Meta tags**: Title (50-60 chars), description (150-160 chars) for search results
- **Open Graph**: Social media preview when shared (image, title, description)
- **Schema.org markup**: Structured data helps search engines understand content
- **Sitemap**: Auto-generated by Next.js for search engine crawling
- **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3) for content structure

**Alternatives Considered**:
1. **Full SEO suite**: Rejected - defer advanced SEO (blog, backlinks) to future phases
2. **JSON-LD only**: Rejected - also use Open Graph for social media
3. **Manual sitemap**: Rejected - Next.js auto-generates from routes

**Implementation Notes**:
```tsx
// app/page.tsx metadata
export const metadata = {
  title: 'Todo App - Your tasks, simplified',
  description: 'Organize, prioritize, and accomplish more with intelligent task management. Free to start.',
  openGraph: {
    title: 'Todo App - Your tasks, simplified',
    description: 'Organize, prioritize, and accomplish more with intelligent task management.',
    url: 'https://yourdomain.com',
    siteName: 'Todo App',
    images: [
      {
        url: 'https://yourdomain.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Todo App - Your tasks, simplified',
    description: 'Organize, prioritize, and accomplish more with intelligent task management.',
    images: ['https://yourdomain.com/og-image.png'],
  },
};

// Schema.org structured data
const schemaMarkup = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Todo App",
  "applicationCategory": "ProductivityApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};
```

**References**:
- Next.js Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- Schema.org: https://schema.org/SoftwareApplication

---

### 8. Design System & Visual Consistency

**Decision**: Extend existing Tailwind configuration with landing page tokens

**Rationale**:
- **Reuse existing tokens**: Colors, typography, spacing already defined in `tailwind.config.js`
- **Landing-specific additions**:
  - Larger type scale for hero (5xl, 6xl, 7xl)
  - Extended color palette for gradients (hero background)
  - Custom animations (fade-in-up, slide-in-left)
- **Component library**: Reuse existing `Button`, `Badge` components
- **Iconography**: Use Heroicons (MIT license, Tailwind-optimized)

**Alternatives Considered**:
1. **Separate design system**: Rejected - creates inconsistency with dashboard
2. **UI library (Shadcn, Radix)**: Rejected - already using custom components
3. **Custom illustrations**: Deferred - use unDraw (open-source) for MVP

**Implementation Notes**:
```js
// tailwind.config.js additions
module.exports = {
  theme: {
    extend: {
      fontSize: {
        '7xl': '4.5rem',
        '8xl': '6rem',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out',
      },
    },
  },
};
```

**Visual Hierarchy**:
- H1 (hero): 56px (desktop), 36px (mobile), bold
- H2 (sections): 36px (desktop), 28px (mobile), semibold
- H3 (feature cards): 24px, semibold
- Body: 18px (desktop), 16px (mobile), regular
- CTA buttons: 18px, semibold, high contrast

**References**:
- Heroicons: https://heroicons.com/
- unDraw illustrations: https://undraw.co/

---

## Summary of Decisions

| Area | Decision | Key Benefit |
|------|----------|-------------|
| **Architecture** | Next.js App Router with static export | Optimal performance, SEO, simplicity |
| **Styling** | Tailwind CSS (mobile-first) | Fast development, consistent design |
| **Animations** | CSS transitions + Framer Motion | Smooth UX, performance, accessibility |
| **Performance** | Image optimization, code splitting | Lighthouse 90+/95+ scores |
| **Accessibility** | Semantic HTML, ARIA, WCAG 2.1 AA | Inclusive design, 95+ accessibility score |
| **Content** | PAS framework, benefit-driven copy | Higher conversion rate |
| **SEO** | Meta tags, Open Graph, schema markup | Search visibility, social sharing |
| **Design** | Extend existing design system | Visual consistency, reuse components |

## Next Steps

Proceed to **Phase 1: Design & Contracts**:
1. Generate `data-model.md` (content entities: Hero, Feature, Testimonial, etc.)
2. Create `contracts/` (no new APIs, document component props contracts)
3. Create `quickstart.md` (setup instructions, run landing page locally)
4. Update agent context with landing page technical stack
