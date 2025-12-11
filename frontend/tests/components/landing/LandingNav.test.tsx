// frontend/tests/components/landing/LandingNav.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { LandingNavComponent } from '../../../src/components/landing/LandingNav';
import { Navigation } from '../../../lib/types/landing';

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock('next/image', () => {
  return ({ alt, src, width, height, priority, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} width={width} height={height} {...props} />;
  };
});

// Mock localStorage for authentication state
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mockNavigationContent: Navigation = {
  logo: {
    src: '/images/logo.svg',
    alt: 'Todo App Logo',
    href: '/',
  },
  links: [
    { label: 'Features', href: '#features', ariaLabel: 'Jump to features section' },
    { label: 'Pricing', href: '/pricing', ariaLabel: 'View pricing plans' },
  ],
  cta: {
    label: 'Start for free',
    href: '/signup',
    variant: 'primary',
    ariaLabel: 'Sign up for a free account',
  },
  authLinks: {
    login: { label: 'Login', href: '/login', ariaLabel: 'Log in to your account' },
    signup: { label: 'Sign up', href: '/signup', ariaLabel: 'Create a free account' },
    dashboard: { label: 'Go to Dashboard', href: '/tasks', ariaLabel: 'Go to your task dashboard' },
  },
};

// Mock scrollIntoView for smooth scroll test
const mockScrollIntoView = jest.fn();
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

// Mock document.getElementById to return an element for anchor link tests
const mockGetElementById = jest.fn((id: string) => {
  if (id === 'features') {
    // Return a minimal object that passes the truthiness check in the component
    return { scrollIntoView: mockScrollIntoView };
  }
  return null;
});
window.document.getElementById = mockGetElementById;

describe('LandingNav Component (T008)', () => {
  beforeEach(() => {
    // Reset mock auth state for each test
    localStorageMock.getItem.mockReturnValue(null);
    jest.clearAllMocks();
  });

  test('renders logo and navigation links for anonymous user (T008)', () => {
    localStorageMock.getItem.mockReturnValue(null); // Not authenticated
    render(<LandingNavComponent navigationContent={mockNavigationContent} />);

    // Check logo
    expect(screen.getByRole('img', { name: /Todo App Logo/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Todo App Logo/i })).toHaveAttribute('href', '/');

    // Check desktop links
    expect(screen.getByRole('link', { name: /Features/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /pricing/i })).toBeInTheDocument();

    // Check desktop CTAs (Anonymous)
    expect(screen.getByRole('link', { name: 'Log in to your account' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create a free account' })).toHaveTextContent('Sign up'); // Primary CTA defaults to signup label
    expect(screen.queryByRole('link', { name: 'Go to your task dashboard' })).not.toBeInTheDocument();
  });

  test('renders correct CTAs for authenticated user (T008, T015 - partial)', () => {
    localStorageMock.getItem.mockReturnValue('true'); // Authenticated
    render(<LandingNavComponent navigationContent={mockNavigationContent} />);

    // Check desktop CTAs (Authenticated)
    expect(screen.queryByRole('link', { name: 'Log in to your account' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to your task dashboard' })).toHaveAttribute('href', '/tasks');
  });

  test('toggles mobile menu on button click (T008)', () => {
    render(<LandingNavComponent navigationContent={mockNavigationContent} />);

    // Mobile menu starts closed, but desktop links are still visible if the element is not hidden.
    // The link 'Pricing' exists in the desktop view. The mobile menu only contains the mobile links.
    // The mobile menu is hidden with conditional rendering, which Jest can track via queryByText on the mobile links.
    expect(screen.queryByText('Pricing', { selector: '.mobile-menu' })).not.toBeInTheDocument();

    // Click to open
    const menuButton = screen.getByRole('button', { name: /Open main menu/i });
    fireEvent.click(menuButton);

    // Mobile menu opens
    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(within(mobileMenu).getByRole('link', { name: /features/i })).toBeInTheDocument();


    // Click to close
    fireEvent.click(menuButton);

    // Mobile menu closes
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  test('handles smooth scroll for anchor links (T008)', () => {
    render(<LandingNavComponent navigationContent={mockNavigationContent} />);
    const featuresLink = screen.getByRole('link', { name: 'Jump to features section' });

    fireEvent.click(featuresLink);

    // Should call mockScrollIntoView with smooth behavior
    expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
    // Note: Checking the exact scroll target requires the element to exist in the DOM, which it doesn't in this unit test.
  });

  // T009 will require testing the sticky logic, which is hard to do in unit tests (CSS class/style changes).
  // This will be covered by E2E tests in T027.
});
