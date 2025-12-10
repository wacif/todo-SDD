// frontend/src/components/landing/TestimonialCard.tsx
import React from 'react';
import Image from 'next/image';
import { Testimonial } from '../../lib/types/landing';
import { Star } from 'lucide-react'; // Assuming Lucide is available

interface TestimonialCardProps {
  testimonial: Testimonial;
}

// Utility component to render star rating
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const isFilled = index < rating;
    return (
      <Star
        key={index}
        className={`h-5 w-5 ${isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        aria-hidden="true"
      />
    );
  });

  return (
    <div className="flex items-center space-x-1" aria-label={`Rated ${rating} out of 5 stars`}>
      {stars}
    </div>
  );
};

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const { quote, author, rating } = testimonial;
  const showRating = rating && rating >= 1 && rating <= 5;

  return (
    <figure className="flex flex-col justify-between h-full bg-white p-6 rounded-xl shadow-lg transition-shadow hover:shadow-xl border border-gray-100">
      <blockquote className="text-gray-700 italic flex-grow">
        <p className="before:content-['“'] after:content-['”'] before:text-2xl before:mr-1 after:text-2xl after:ml-1 leading-relaxed">
          {quote}
        </p>
      </blockquote>
      <figcaption className="mt-6 flex items-start space-x-4">
        {author.avatar && (
          <Image
            className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-50"
            src={author.avatar}
            alt={`Avatar of ${author.name}`}
            width={48}
            height={48}
            loading="lazy"
          />
        )}
        <div className="flex flex-col justify-center">
          <cite className="font-semibold not-italic text-gray-900">{author.name}</cite>
          <p className="text-sm text-indigo-600">{author.role}</p>
          {author.company && (
            <p className="text-sm text-gray-500">at {author.company}</p>
          )}
          {showRating && (
            <div className="mt-1">
              <StarRating rating={rating} />
            </div>
          )}
        </div>
      </figcaption>
    </figure>
  );
};
