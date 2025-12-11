# Quickstart Guide: Landing Page Development

**Feature**: Professional Landing Page & Website Design  
**Branch**: `003-landing-page`  
**Date**: 2025-12-09

## Prerequisites

- **Node.js**: 20+ (check with `node --version`)
- **npm**: 10+ (check with `npm --version`)
- **Git**: For version control
- **VS Code** (recommended): With ESLint, Prettier, Tailwind CSS IntelliSense extensions

## Project Setup

### 1. Clone and Branch

```bash
# Navigate to project root
cd /home/wasi/Desktop/todo-app

# Ensure you're on the landing page feature branch
git checkout 003-landing-page

# Pull latest changes
git pull origin 003-landing-page
```

### 2. Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Expected dependencies (already in package.json):
# - next: ^16.0.0 (App Router with Turbopack)
# - react: ^19.0.0
# - react-dom: ^19.0.0
# - tailwindcss: ^3.4.0
# - framer-motion: ^10.16.0 (for animations)
# - better-auth: ^1.3.4 (auth state detection)
```

### 3. Environment Setup

```bash
# Copy environment file (if not exists)
cp .env.local.example .env.local

# Edit .env.local with required values
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
# From frontend directory
npm run dev

# Server starts on http://localhost:3000
# Turbopack enabled by default in Next.js 16
# Fast Refresh enabled (changes reflect instantly)
```

**Expected Output**:
```
▲ Next.js 16.0.7 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 800ms
```

### 5. Verify Setup

Open browser to http://localhost:3000

**Expected Behavior**:
- Landing page loads (root route `/`)
- Hero section visible above fold
- Navigation sticky on scroll
- Responsive layout on mobile/desktop

---

## Development Workflow

### File Structure

```
frontend/
├── app/
│   ├── page.tsx                    # 👈 Landing page route (START HERE)
│   ├── layout.tsx                  # Root layout (existing)
│   ├── (auth)/
│   │   ├── login/page.tsx          # Existing login page
│   │   └── signup/page.tsx         # Existing signup page
│   └── (dashboard)/
│       └── tasks/page.tsx          # Existing dashboard
│
├── components/
│   ├── landing/                    # 👈 NEW: Landing page components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── SocialProof.tsx
│   │   ├── Testimonial.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Footer.tsx
│   │   └── LandingNav.tsx
│   ├── ui/                         # Existing UI components (reuse)
│   │   ├── Button.tsx
│   │   └── Badge.tsx
│   └── auth/                       # Existing auth components
│
├── lib/
│   ├── constants/
│   │   └── landing-content.ts      # 👈 NEW: Content constants
│   ├── types/
│   │   └── landing.ts              # 👈 NEW: TypeScript types
│   ├── auth.ts                     # Existing auth utilities
│   └── utils.ts                    # Existing utilities
│
├── public/
│   └── images/
│       └── landing/                # 👈 NEW: Landing page images
│           ├── hero-illustration.svg
│           └── feature-icons/
│
├── tests/
│   ├── components/
│   │   └── landing/                # 👈 NEW: Component tests
│   │       ├── Hero.test.tsx
│   │       └── Features.test.tsx
│   └── e2e/
│       └── landing.spec.ts         # 👈 NEW: E2E tests
│
└── tailwind.config.js              # Existing (may extend for landing)
```

### Component Development Order

**Phase 1: Foundation** (Parallel - no dependencies)
1. Create type definitions (`lib/types/landing.ts`)
2. Create content constants (`lib/constants/landing-content.ts`)
3. Setup test utilities

**Phase 2: Core Components** (Parallel - independent)
1. `Hero.tsx` + tests
2. `LandingNav.tsx` + tests
3. `Footer.tsx` + tests

**Phase 3: Feature Sections** (Parallel - independent)
1. `FeatureCard.tsx` → `Features.tsx` + tests
2. `HowItWorks.tsx` + tests
3. `Testimonial.tsx` → `SocialProof.tsx` + tests

**Phase 4: Integration**
1. Assemble `app/page.tsx` with all sections
2. Add scroll animations (Framer Motion)
3. E2E tests

**Phase 5: Optimization**
1. Image optimization (WebP, lazy loading)
2. Performance tuning (code splitting, font loading)
3. Lighthouse audits (90+ performance, 95+ accessibility)

---

## Running Tests

### Unit & Component Tests (Jest)

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- Hero.test.tsx
```

**Expected Coverage Target**: 85%+ per constitution

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test landing.spec.ts
```

### Lighthouse Audits

```bash
# Install Lighthouse CLI (first time only)
npm install -g @lhci/cli

# Build production version
npm run build

# Start production server
npm start

# Run Lighthouse audit (in separate terminal)
lhci autorun --url=http://localhost:3000
```

**Target Scores**:
- Performance: 90+ (mobile & desktop)
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

---

## Common Development Tasks

### Add New Component

```bash
# 1. Create component file
touch components/landing/NewComponent.tsx

# 2. Create test file
touch tests/components/landing/NewComponent.test.tsx

# 3. Create component with TypeScript
# See contracts/component-contracts.md for interface
```

**Component Template**:
```tsx
import React from 'react';

interface NewComponentProps {
  // Define props based on contract
  title: string;
  className?: string;
}

export function NewComponent({ title, className }: NewComponentProps) {
  return (
    <section className={className}>
      <h2>{title}</h2>
      {/* Component content */}
    </section>
  );
}
```

### Add New Content

```typescript
// lib/constants/landing-content.ts

export const newSection = {
  title: "Section Title",
  items: [
    { id: "item-1", label: "Item 1" },
    { id: "item-2", label: "Item 2" },
  ],
};
```

### Add New Image

```bash
# 1. Add image to public directory
cp ~/Downloads/image.svg public/images/landing/

# 2. Use in component with next/image
import Image from 'next/image';

<Image
  src="/images/landing/image.svg"
  alt="Descriptive alt text"
  width={600}
  height={400}
  loading="lazy"  // or priority={true} for hero
/>
```

### Add Animation

```tsx
// Using Framer Motion
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
>
  {/* Animated content */}
</motion.div>
```

### Check Accessibility

```bash
# Run axe-core in tests (automatic)
npm test

# Manual keyboard navigation test
# 1. Open http://localhost:3000
# 2. Press Tab to navigate
# 3. Verify all interactive elements reachable
# 4. Press Enter/Space to activate buttons/links

# Screen reader test (macOS)
# 1. Enable VoiceOver: Cmd + F5
# 2. Navigate with VO + Right Arrow
# 3. Verify all content announced correctly
```

---

## Debugging

### TypeScript Errors

```bash
# Check types without running app
npm run type-check  # (add to package.json if missing)

# Or use VS Code built-in TypeScript checking
# Errors show in Problems panel (Cmd/Ctrl + Shift + M)
```

### Layout Issues

```bash
# Inspect with browser DevTools
# Chrome: Cmd/Ctrl + Shift + C
# Firefox: Cmd/Ctrl + Shift + I

# Check responsive breakpoints
# Chrome DevTools > Toggle device toolbar (Cmd/Ctrl + Shift + M)
# Test: 320px (mobile), 768px (tablet), 1024px (desktop)
```

### Performance Issues

```bash
# Use React DevTools Profiler
# 1. Install React DevTools browser extension
# 2. Open DevTools > Profiler tab
# 3. Record interaction
# 4. Analyze component render times

# Check bundle size
npm run build
# Output shows bundle sizes
# Flag: Large bundles (>200KB for landing page)
```

### Animation Issues

```bash
# Disable animations for debugging
# Add to component temporarily:
const disableAnimations = true;

<motion.div animate={disableAnimations ? {} : variants}>
```

---

## Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix linting issues
npm run lint -- --fix
```

### Formatting

```bash
# Format code with Prettier (if configured)
npm run format  # (add to package.json if missing)

# Or use VS Code format on save
# Settings > Editor: Format On Save (enable)
```

### Pre-commit Checks

```bash
# Run all checks before committing
npm run lint && npm test && npm run build

# Success: Ready to commit
# Failure: Fix errors before committing
```

---

## Deployment Preview

### Build Production Version

```bash
# Create optimized production build
npm run build

# Output: .next/ directory with static files
# Check build size: Total page size should be <1MB
```

### Test Production Build Locally

```bash
# Start production server
npm start

# Server runs on http://localhost:3000
# Test: Performance should be better than dev mode
```

### Static Export (Optional)

```bash
# For static hosting (Netlify, Vercel, S3)
# Add to next.config.js:
# output: 'export'

npm run build

# Output: out/ directory with static HTML/CSS/JS
# Deploy: Upload out/ directory to static host
```

---

## Troubleshooting

### Port 3000 Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Turbopack Build Errors

```bash
# If Turbopack causes issues, disable temporarily
# Add to package.json scripts:
"dev:legacy": "next dev --no-turbopack"

npm run dev:legacy
```

### Image Optimization Errors

```bash
# Ensure images are in public/ directory
# Check file paths start with /images/

# For SVG issues, use <img> instead of next/image
<img src="/images/logo.svg" alt="Logo" className="h-8" />
```

---

## Resources

### Documentation
- **Next.js App Router**: https://nextjs.org/docs/app
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Heroicons**: https://heroicons.com/

### Design Reference
- **Awwwards Landing Pages**: https://www.awwwards.com/websites/landing-page/
- **SaaS Landing Page Examples**: https://www.saaspages.xyz/

### Testing
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- **Playwright Docs**: https://playwright.dev/docs/intro
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

## Getting Help

**Common Issues**:
- Check `CLAUDE.md` in project root for AI assistant guidance
- Review specification: `specs/003-landing-page/spec.md`
- Review contracts: `specs/003-landing-page/contracts/component-contracts.md`
- Review research: `specs/003-landing-page/research.md`

**Report Bugs**:
- Create issue with steps to reproduce
- Include: Browser, OS, error messages, screenshots
- Tag: `landing-page`, `bug`

---

## Next Steps

1. ✅ Run `npm run dev` and verify frontend starts
2. ✅ Create type definitions in `lib/types/landing.ts`
3. ✅ Create content constants in `lib/constants/landing-content.ts`
4. ✅ Build `Hero.tsx` component (TDD: tests first)
5. ✅ Build `LandingNav.tsx` component (TDD: tests first)
6. Continue with remaining components per development order above

**Ready to start coding!** 🚀

All specifications, contracts, and research are complete. Follow TDD workflow: write tests first, implement components, validate with Lighthouse audits.
