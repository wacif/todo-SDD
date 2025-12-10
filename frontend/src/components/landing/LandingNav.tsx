// frontend/src/components/landing/LandingNav.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react'; // Assuming Lucide is available
import { Navigation, CallToAction, NavigationItem, AuthState } from '@/lib/types/landing';
import { landingContent } from '@/lib/constants/landing-content';
// Mock Better Auth hook - this is a foundational mock for US4 integration (T015)
const useAuth = (): AuthState => {
  // TODO: Replace with actual Better Auth hook in T015
  if (typeof window !== 'undefined' && window.localStorage.getItem('isLoggedIn') === 'true') {
    return { isAuthenticated: true, user: { id: '1', name: 'User' } };
  }
  return { isAuthenticated: false };
};

interface LandingNavProps {
  navigationContent: Navigation;
}

const Button: React.FC<CallToAction & { className?: string }> = ({ label, href, variant, ariaLabel, className }) => {
  // Simple button component to handle CTA styling
  let baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2";

  switch (variant) {
    case 'primary':
      baseClasses += " bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500";
      break;
    case 'outline':
      baseClasses += " border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500";
      break;
    default:
      baseClasses += " bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500";
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={`${baseClasses} ${className}`}>
      {label}
    </Link>
  );
};

const LandingNavComponent: React.FC<LandingNavProps> = ({ navigationContent }) => {
  const { logo, links, authLinks } = navigationContent;
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Sticky navigation logic (FR-012) is already implemented via the sticky class on the header element.

  // Determine the right button to show (US4 - T015)
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
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-indigo-50/50">
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
                className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs (Login/Signup/Dashboard) */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {!isAuthenticated && secondCta && (
              <Link
                href={secondCta.href}
                aria-label={secondCta.ariaLabel}
                className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {secondCta.label}
              </Link>
            )}
            <Button
              label={authCta.label}
              href={authCta.href}
              variant={isAuthenticated ? 'primary' : 'primary'} // Primary for sign up or dashboard
              ariaLabel={authCta.ariaLabel}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
        <div className="lg:hidden absolute top-20 w-full bg-white border-b border-gray-100 shadow-lg" id="mobile-menu" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                aria-label={link.ariaLabel}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="space-y-1 px-5">
               {!isAuthenticated && secondCta && (
                <Button
                    label={secondCta.label}
                    href={secondCta.href}
                    variant={'outline'}
                    ariaLabel={secondCta.ariaLabel}
                    className="w-full"
                />
               )}
                <Button
                    label={authCta.label}
                    href={authCta.href}
                    variant={'primary'}
                    ariaLabel={authCta.ariaLabel}
                    className="w-full"
                />
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

