// frontend/tests/components/landing/Footer.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Footer, { FooterComponent } from '@/components/landing/Footer';
import { landingContent } from '@/lib/constants/landing-content';
import { Footer as FooterType } from '@/lib/types/landing';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const mockFooterContent: FooterType = {
  sections: [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms', external: true },
      ],
    },
  ],
  copyright: '© 2025 Test App. All rights reserved.',
  socialLinks: [
    { platform: 'twitter', url: 'https://twitter.com/test', ariaLabel: 'Follow us on Twitter' },
    { platform: 'github', url: 'https://github.com/test', ariaLabel: 'View our GitHub repository' },
  ],
};

describe('Footer Component', () => {
  test('renders the main sections and titles (T006)', () => {
    render(<FooterComponent footerContent={mockFooterContent} />);

    // Check for section headings
    expect(screen.getByRole('heading', { name: /Product/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Legal/i, level: 3 })).toBeInTheDocument();

    // Check for links
    expect(screen.getByRole('link', { name: /Features/i })).toHaveAttribute('href', '/features');
    expect(screen.getByRole('link', { name: /Privacy Policy/i })).toHaveAttribute('href', '/privacy');

    // Check for external link attributes
    const termsLink = screen.getByRole('link', { name: /Terms of Service/i });
    expect(termsLink).toHaveAttribute('href', '/terms');
    expect(termsLink).toHaveAttribute('target', '_blank');
    expect(termsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders copyright text (T006)', () => {
    render(<FooterComponent footerContent={mockFooterContent} />);
    expect(screen.getByText('© 2025 Test App. All rights reserved.')).toBeInTheDocument();
  });

  test('renders social media links with correct aria-labels (T006)', () => {
    render(<FooterComponent footerContent={mockFooterContent} />);

    const twitterLink = screen.getByRole('link', { name: 'Follow us on Twitter' });
    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/test');
    expect(twitterLink).toHaveAttribute('target', '_blank');

    const githubLink = screen.getByRole('link', { name: 'View our GitHub repository' });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test');
  });

  test('uses default content when exported Footer is rendered', () => {
    // This tests the use of landingContent.footer (T006)
    render(<Footer />);

    // Check one item from the default content (Phase 1 T003 constants)
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} Todo App. All rights reserved.`)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Legal/i, level: 3 })).toBeInTheDocument();
  });
});
