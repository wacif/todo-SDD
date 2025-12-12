// frontend/lib/constants/landing-content.ts
import {
  LandingContent,
  CallToAction,
  HeroVisual,
  TrustBadge,
  Feature,
  FeaturesSection,
  Testimonial,
  SocialProofSection,
  WorkflowStep,
  HowItWorksSection,
  Navigation,
  Footer,
} from '../types/landing';

// Helper for Heroicons (using placeholder string, actual icons are from a library like `@heroicons/react`)
const ICON_PLACEHOLDER = 'IconPlaceholder';

// --- Call To Action Definitions ---
const ctaPrimary: CallToAction = {
  label: "Start organizing for free",
  href: "/signup",
  variant: "primary",
  ariaLabel: "Sign up for a free account",
} as CallToAction;

const ctaSecondary: CallToAction = {
  label: "See how it works",
  href: "#how-it-works",
  variant: "outline",
  ariaLabel: "Scroll to the features and workflow section",
} as CallToAction;

const ctaLogin: CallToAction = {
  label: "Login",
  href: "/login",
  variant: "outline",
  ariaLabel: "Log in to your account",
} as CallToAction;

const ctaDashboard: CallToAction = {
  label: "Go to Dashboard",
  href: "/tasks",
  variant: "primary",
  ariaLabel: "Go to your task dashboard",
} as CallToAction;

// --- Hero Section Content ---
const heroContent: LandingContent['hero'] = {
  headline: "Your tasks, simplified. Finally.",
  subheadline: "Stop juggling scattered to-do lists. Organize, prioritize, and accomplish more with one powerful tool built for efficiency and speed.",
  ctaPrimary,
  ctaSecondary,
  heroVisual: {
    src: "/images/landing/hero-illustration.svg",
    alt: "Illustration of organized task list with checkmarks and calendar items.",
    width: 600,
    height: 400,
    priority: true,
  } as HeroVisual,
  badges: [
    { icon: ICON_PLACEHOLDER, label: "Free forever plan" },
    { icon: ICON_PLACEHOLDER, label: "Trusted by 5,000+ users" },
  ] as TrustBadge[],
};

// --- Features Section Content ---
const features: Feature[] = [
  {
    id: "smart-prioritization",
    icon: ICON_PLACEHOLDER,
    title: "Smart Prioritization",
    description: "Automatically highlight high-impact tasks. Focus on what truly moves the needle to maximize your productivity.",
    benefit: "Increase productivity by 40%",
    expandable: true,
  },
  {
    id: "quick-capture",
    icon: ICON_PLACEHOLDER,
    title: "Instant Capture",
    description: "Add tasks in seconds from any device. No complicated forms or menus. Just type and go.",
    benefit: "Save 10 minutes per day",
    expandable: false,
  },
  {
    id: "collaborative-lists",
    icon: ICON_PLACEHOLDER,
    title: "Collaborative Lists",
    description: "Share projects with your team. Assign tasks, set due dates, and track progress together in real-time.",
    benefit: "Seamless teamwork, zero friction",
    expandable: true,
  },
  {
    id: "deep-analytics",
    icon: ICON_PLACEHOLDER,
    title: "Deep Analytics",
    description: "Understand your work patterns with insightful reports on task completion rates and time spent per project.",
    benefit: "Identify bottlenecks and optimize workflow",
    expandable: false,
  },
];

const featuresSection: LandingContent['features'] = {
  sectionTitle: "Everything you need to stay organized",
  sectionDescription: "Simple yet powerful features that help you manage tasks efficiently, so you can stop planning and start doing.",
  features: features,
};

// --- Social Proof Content (Realistic Placeholders) ---
const socialProofSection: LandingContent['socialProof'] = {
  sectionTitle: "Trusted by thousands of productive people",
  testimonials: [
    {
      id: "t-sarah",
      quote: "This app helped me reclaim 5 hours a week. I finally feel in control of my workload instead of drowning in it. The design is beautiful and a pleasure to use.",
      author: {
        name: "Sarah Johnson",
        role: "Product Manager",
        company: "TechCorp Global",
        avatar: "/images/landing/testimonials/sarah.jpg",
      },
      rating: 5,
    } as Testimonial,
    {
      id: "t-michael",
      quote: "The clean interface and smart prioritization changed everything. I used to waste time on low-impact tasks. Now I always know what to do next.",
      author: {
        name: "Michael Chen",
        role: "Freelance Designer",
        avatar: "/images/landing/testimonials/michael.jpg",
      },
      rating: 5,
    } as Testimonial,
  ],
  statistics: [
    { number: "10,000+", label: "Tasks completed daily", icon: ICON_PLACEHOLDER },
    { number: "5,000+", label: "Active users", icon: ICON_PLACEHOLDER },
    { number: "4.9/5", label: "Average rating", icon: ICON_PLACEHOLDER },
  ],
} as SocialProofSection;

// --- How It Works Content ---
const howItWorksSteps: WorkflowStep[] = [
  {
    stepNumber: 1,
    title: "Capture Ideas Instantly",
    description: "Use the quick-add feature to capture any thought or task before it slips your mind. It only takes a second.",
    icon: ICON_PLACEHOLDER,
  },
  {
    stepNumber: 2,
    title: "Set Your Focus",
    description: "Assign priority levels and due dates. Our smart system surfaces your most important tasks first, every time.",
    icon: ICON_PLACEHOLDER,
  },
  {
    stepNumber: 3,
    title: "Achieve Completion",
    description: "Work through your prioritized list with focus. Get notifications and satisfying completion feedback.",
    icon: ICON_PLACEHOLDER,
  },
];

const howItWorksSection: LandingContent['howItWorks'] = {
  sectionTitle: "The simple workflow to get organized in minutes",
  sectionDescription: "We minimize friction so you can focus on the work, not the tool.",
  steps: howItWorksSteps,
} as HowItWorksSection;

// --- Navigation Content ---
const navigation: LandingContent['navigation'] = {
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
  cta: ctaPrimary, // Main CTA in hero
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
} as Navigation;

// --- Footer Content ---
const footer: LandingContent['footer'] = {
  sections: [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Why us?", href: "/why-us" },
        { label: "Help Center", href: "/help" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Security", href: "/security" },
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
} as Footer;

// --- Combined Export ---
export const landingContent: LandingContent = {
  hero: heroContent,
  features: featuresSection,
  socialProof: socialProofSection,
  howItWorks: howItWorksSection,
  navigation: navigation,
  footer: footer,
};
