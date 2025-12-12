import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  describe('Rendering', () => {
    it('renders with text content', () => {
      render(<Badge>Test Badge</Badge>)
      expect(screen.getByText('Test Badge')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<Badge className="custom-class">Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Badge variant="default">Default</Badge>)
      const badge = screen.getByText('Default')
      expect(badge).toHaveClass('bg-primary-600')
    })

    it('renders success variant', () => {
      render(<Badge variant="success">Success</Badge>)
      const badge = screen.getByText('Success')
      expect(badge).toHaveClass('bg-success')
    })

    it('renders warning variant', () => {
      render(<Badge variant="warning">Warning</Badge>)
      const badge = screen.getByText('Warning')
      expect(badge).toHaveClass('bg-warning')
    })

    it('renders error variant', () => {
      render(<Badge variant="error">Error</Badge>)
      const badge = screen.getByText('Error')
      expect(badge).toHaveClass('bg-error')
    })

    it('renders secondary variant', () => {
      render(<Badge variant="secondary">Secondary</Badge>)
      const badge = screen.getByText('Secondary')
      expect(badge).toHaveClass('bg-muted')
    })

    it('renders outline variant', () => {
      render(<Badge variant="outline">Outline</Badge>)
      const badge = screen.getByText('Outline')
      expect(badge).toHaveClass('border-border')
    })
  })

  describe('Sizes', () => {
    it('renders small size', () => {
      render(<Badge size="sm">Small</Badge>)
      const badge = screen.getByText('Small')
      expect(badge).toHaveClass('text-xs', 'px-2', 'py-0.5')
    })

    it('renders medium size by default', () => {
      render(<Badge>Medium</Badge>)
      const badge = screen.getByText('Medium')
      expect(badge).toHaveClass('text-sm', 'px-2.5', 'py-1')
    })

    it('renders large size', () => {
      render(<Badge size="lg">Large</Badge>)
      const badge = screen.getByText('Large')
      expect(badge).toHaveClass('text-base', 'px-3', 'py-1.5')
    })
  })

  describe('Accessibility', () => {
    it('renders as span by default', () => {
      const { container } = render(<Badge>Badge</Badge>)
      const badge = container.querySelector('span')
      expect(badge).toBeInTheDocument()
    })

    it('accepts aria-label', () => {
      render(<Badge aria-label="Status badge">Active</Badge>)
      const badge = screen.getByLabelText('Status badge')
      expect(badge).toBeInTheDocument()
    })

    it('can be used with status role', () => {
      render(<Badge role="status">Loading</Badge>)
      const badge = screen.getByRole('status')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Combinations', () => {
    it('combines variant and size', () => {
      render(
        <Badge variant="success" size="lg">
          Large Success
        </Badge>
      )
      const badge = screen.getByText('Large Success')
      expect(badge).toHaveClass('bg-success', 'text-base')
    })

    it('combines variant, size, and custom className', () => {
      render(
        <Badge variant="error" size="sm" className="font-bold">
          Small Error
        </Badge>
      )
      const badge = screen.getByText('Small Error')
      expect(badge).toHaveClass('bg-error', 'text-xs', 'font-bold')
    })
  })
})
