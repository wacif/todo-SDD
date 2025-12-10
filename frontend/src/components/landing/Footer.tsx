// frontend/src/components/landing/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { Footer, FooterLink, SocialLink } from '@/lib/types/landing';
import { landingContent } from '@/lib/constants/landing-content';
import { Code, GitBranch, Github, Linkedin, Twitter } from 'lucide-react'; // Placeholder icons - assuming Lucide is available

interface FooterProps {
  footerContent: Footer;
}

const socialIconMap: Record<SocialLink['platform'], React.ElementType> = {
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  youtube: Code, // Placeholder for other icons
};

const FooterComponent: React.FC<FooterProps> = ({ footerContent }) => {
  const { sections, copyright, socialLinks } = footerContent;

  return (
    <footer className="bg-white border-t border-gray-100 mt-20" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 text-gray-700">
          {sections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex === 0 ? 'col-span-2 md:col-span-1' : ''}>
              <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase">{section.title}</h3>
              <ul role="list" className="mt-4 space-y-4">
                {section.links.map((link: FooterLink) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : "_self"}
                      rel={link.external ? "noopener noreferrer" : ""}
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-300 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex space-x-6">
            {socialLinks && socialLinks.map((item) => {
              const Icon = socialIconMap[item.platform] || GitBranch;
              return (
                <a key={item.platform} href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 transition-colors" aria-label={item.ariaLabel}>
                  <Icon className="h-6 w-6" />
                </a>
              );
            })}
          </div>
          <p className="mt-8 text-xs text-gray-500 md:mt-0 order-first md:order-last">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

// Exporting the component with default content for ease of use
const LandingFooter = () => <FooterComponent footerContent={landingContent.footer} />;
export default LandingFooter;

export { FooterComponent };

