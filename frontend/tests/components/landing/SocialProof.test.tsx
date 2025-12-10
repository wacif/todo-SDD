// frontend/tests/components/landing/SocialProof.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { TestimonialCard } from '../../../src/components/landing/TestimonialCard';
import { Testimonial, SocialProofSection } from '../../../lib/types/landing';
import { SocialProofComponent } from '../../../src/components/landing/SocialProof';

// Mock Next.js Image component
jest.mock('next/image', () => {
    return ({ alt, src, width, height, ...props }: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img alt={alt} src={src} {...props} />;
    };
});

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Star: ({ className }: { className: string }) => <svg data-testid={`StarIcon-${className}`} />,
    CheckCircle: () => <svg data-testid="CheckCircleIcon" />,
    Users: () => <svg data-testid="UsersIcon" />,
}));


// Mock content based on data-model.md definitions
const mockTestimonial: Testimonial = {
    id: "t-1",
    quote: "This app revolutionized how my team handles daily tasks. We saw a noticeable increase in project completion rates within the first month.",
    author: {
        name: "Alex Smith",
        role: "Lead Developer",
        company: "Innovate Solutions",
        avatar: "/avatars/alex.jpg",
    },
    rating: 5,
};

const mockSocialProof: SocialProofSection = {
    sectionTitle: "Trusted by top industry leaders",
    testimonials: [
        mockTestimonial,
        {
            ...mockTestimonial,
            id: "t-2",
            author: { name: "Jane Doe", role: "CEO" },
            rating: 4,
        } as Testimonial,
    ],
    statistics: [
        { number: "15,000+", label: "Tasks completed", icon: "CheckCircle" },
        { number: "7,000", label: "Active users", icon: "Users" },
    ],
};


describe('TestimonialCard Component (T044 - partial)', () => {
    test('renders quote, author, role, and company', () => {
        render(<TestimonialCard testimonial={mockTestimonial} />);

        // Check quote
        expect(screen.getByText(/This app revolutionized how my team handles daily tasks/i)).toBeInTheDocument();

        // Check author details
        expect(screen.getByText('Alex Smith')).toBeInTheDocument();
        expect(screen.getByText('Lead Developer')).toBeInTheDocument();
        expect(screen.getByText('at Innovate Solutions')).toBeInTheDocument();

        // Check avatar
        expect(screen.getByRole('img', { name: 'Avatar of Alex Smith' })).toHaveAttribute('src', '/avatars/alex.jpg');
    });

    test('renders correct star rating', () => {
        render(<TestimonialCard testimonial={mockTestimonial} />); // Rating 5
        expect(screen.getAllByTestId(/StarIcon/i)).toHaveLength(5);

        const rating4: Testimonial = { ...mockTestimonial, id: "t-3", rating: 4 };
        render(<TestimonialCard testimonial={rating4} />);
        expect(screen.getAllByTestId(/StarIcon/i)).toHaveLength(10); // 5 + 5 total star icons found in the DOM
        expect(screen.getAllByTestId(/StarIcon.*text-gray-300/i)).toHaveLength(1); // One unfilled star
    });
});


describe('SocialProof Component (T043)', () => {
    test('renders section title and all testimonials', () => {
        render(<SocialProofComponent socialProofContent={mockSocialProof} />);

        // Check section title
        expect(screen.getByRole('heading', { name: /Trusted by top industry leaders/i, level: 2 })).toBeInTheDocument();

        // Check all testimonials are present
        expect(screen.getByText('Alex Smith')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();

        // Check statistics
        expect(screen.getByText('15,000+')).toBeInTheDocument();
        expect(screen.getByText('Tasks completed')).toBeInTheDocument();
        expect(screen.getByText('7,000')).toBeInTheDocument();
        expect(screen.getByText('Active users')).toBeInTheDocument();
    });
});
