import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders children correctly', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(<Card className="custom-card">Content</Card>)
      const card = container.firstChild
      expect(card).toHaveClass('custom-card')
    })

    it('has proper semantic structure', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-background')
    })
  })

  describe('CardHeader', () => {
    it('renders header content', () => {
      render(<CardHeader>Header content</CardHeader>)
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('applies spacing classes', () => {
      const { container } = render(<CardHeader>Header</CardHeader>)
      const header = container.firstChild
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })
  })

  describe('CardTitle', () => {
    it('renders title text', () => {
      render(<CardTitle>Card Title</CardTitle>)
      expect(screen.getByText('Card Title')).toBeInTheDocument()
    })

    it('has proper heading styles', () => {
      const { container } = render(<CardTitle>Title</CardTitle>)
      const title = container.firstChild
      expect(title?.nodeName).toBe('H3')
      expect(title).toHaveClass('font-semibold', 'leading-none', 'tracking-tight')
    })
  })

  describe('CardDescription', () => {
    it('renders description text', () => {
      render(<CardDescription>This is a description</CardDescription>)
      expect(screen.getByText('This is a description')).toBeInTheDocument()
    })

    it('has muted text styling', () => {
      const { container } = render(<CardDescription>Description</CardDescription>)
      const description = container.firstChild
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('renders content', () => {
      render(<CardContent>Main content</CardContent>)
      expect(screen.getByText('Main content')).toBeInTheDocument()
    })

    it('has proper padding', () => {
      const { container } = render(<CardContent>Content</CardContent>)
      const content = container.firstChild
      expect(content).toHaveClass('p-6', 'pt-0')
    })
  })

  describe('CardFooter', () => {
    it('renders footer content', () => {
      render(<CardFooter>Footer content</CardFooter>)
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('has flex layout', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>)
      const footer = container.firstChild
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })
  })

  describe('Card Composition', () => {
    it('renders full card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>
            Test content
          </CardContent>
          <CardFooter>
            Test footer
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test content')).toBeInTheDocument()
      expect(screen.getByText('Test footer')).toBeInTheDocument()
    })

    it('works without optional sections', () => {
      render(
        <Card>
          <CardContent>Just content</CardContent>
        </Card>
      )

      expect(screen.getByText('Just content')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('can have aria-label for screen readers', () => {
      render(<Card aria-label="Product card">Content</Card>)
      const card = screen.getByLabelText('Product card')
      expect(card).toBeInTheDocument()
    })

    it('title has proper heading hierarchy', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Heading</CardTitle>
          </CardHeader>
        </Card>
      )

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('Heading')
    })
  })
})
