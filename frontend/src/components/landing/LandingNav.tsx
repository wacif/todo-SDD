'use client'

// frontend/src/components/landing/LandingNav.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Navigation, NavigationItem, AuthState } from '@/lib/types/landing';
import { landingContent } from '@/lib/constants/landing-content';
import { Button } from '@/components/ui/button';

const useAuth = (): AuthState => {
  if (typeof window !== 'undefined' && window.localStorage.getItem('isLoggedIn') === 'true') {
    return { isAuthenticated: true, user: { id: '1', name: 'User' } };
  }
  return { isAuthenticated: false };
};

interface LandingNavProps {
  navigationContent: Navigation;
}

const LandingNavComponent: React.FC<LandingNavProps> = ({ navigationContent }) => {
  const { logo, links, authLinks } = navigationContent;
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const authCta: NavigationItem = isAuthenticated
    ? authLinks.dashboard
    : authLinks.signup;

  const secondCta: NavigationItem | null = isAuthenticated
    ? null
    : authLinks.login;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetElement = document.getElementById(href.substring(1));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background shadow-md border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex items-center">
            <Link href={logo.href} aria-label={logo.alt}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                aria-label={link.ariaLabel}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs (Login/Signup/Dashboard) */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {!isAuthenticated && secondCta && (
              <Link href={secondCta.href} aria-label={secondCta.ariaLabel}>
                <Button variant="ghost">
                  {secondCta.label}
                </Button>
              </Link>
            )}
            <Link href={authCta.href} aria-label={authCta.ariaLabel}>
              <Button variant="primary">
                {authCta.label}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 w-full bg-background border-b border-border shadow-lg" id="mobile-menu" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                aria-label={link.ariaLabel}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="space-y-1 px-5">
              {!isAuthenticated && secondCta && (
                <Link href={secondCta.href} aria-label={secondCta.ariaLabel} className="block">
                  <Button
                    variant="ghost"
                    className="w-full"
                  >
                    {secondCta.label}
                  </Button>
                </Link>
              )}
              <Link href={authCta.href} aria-label={authCta.ariaLabel} className="block">
                <Button
                  variant="primary"
                  className="w-full"
                >
                  {authCta.label}
                </Button>
              </Link>
          </div>
        </div>
      </div>
      )}
    </header>
  );
};

export const LandingNav = () => <LandingNavComponent navigationContent={landingContent.navigation} />;
export default LandingNav;

export { LandingNavComponent };

