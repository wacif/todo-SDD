import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { EmptyState } from '@/components/ui/empty-state'
import { Inbox } from 'lucide-react'

describe('EmptyState', () => {
  describe('Rendering', () => {
    it('renders with title and description', () => {
      render(
        <EmptyState
          title="No items found"
          description="There are no items to display"
        />
      )
      expect(screen.getByText('No items found')).toBeInTheDocument()
      expect(screen.getByText('There are no items to display')).toBeInTheDocument()
    })

    it('renders with icon', () => {
      render(
        <EmptyState
          icon={Inbox}
          title="No items"
          description="Description"
        />
      )
      const icon = screen.getByTestId('empty-state-icon')
      expect(icon).toBeInTheDocument()
    })

    it('renders with action button', () => {
      render(
        <EmptyState
          title="No items"
          description="Description"
          action={{
            label: 'Add Item',
            onClick: () => {},
          }}
        />
      )
      expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument()
    })

    it('renders without description', () => {
      render(<EmptyState title="No items" />)
      expect(screen.getByText('No items')).toBeInTheDocument()
    })

    it('renders without icon', () => {
      render(<EmptyState title="No items" description="Description" />)
      expect(screen.queryByTestId('empty-state-icon')).not.toBeInTheDocument()
    })

    it('renders without action', () => {
      render(<EmptyState title="No items" description="Description" />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls action onClick when button is clicked', async () => {
      const user = userEvent.setup()
      const onClick = jest.fn()
      render(
        <EmptyState
          title="No items"
          description="Description"
          action={{
            label: 'Add Item',
            onClick,
          }}
        />
      )

      const button = screen.getByRole('button', { name: 'Add Item' })
      await user.click(button)

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('supports action with href', () => {
      render(
        <EmptyState
          title="No items"
          description="Description"
          action={{
            label: 'Add Item',
            href: '/add',
          }}
        />
      )

      const link = screen.getByRole('link', { name: 'Add Item' })
      expect(link).toHaveAttribute('href', '/add')
    })
  })

  describe('Variants', () => {
    it('renders default variant', () => {
      render(
        <EmptyState
          title="No items"
          description="Description"
          variant="default"
        />
      )
      const innerContainer = screen.getByText('No items').parentElement
      expect(innerContainer).toHaveClass('bg-muted/30')
    })

    it('renders minimal variant', () => {
      render(
        <EmptyState
          title="No items"
          description="Description"
          variant="minimal"
        />
      )
      const innerContainer = screen.getByText('No items').parentElement
      expect(innerContainer).not.toHaveClass('bg-muted/30')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<EmptyState title="No items" description="Description" />)
      const heading = screen.getByRole('heading', { name: 'No items' })
      expect(heading.tagName).toBe('H3')
    })

    it('icon has aria-hidden', () => {
      render(
        <EmptyState
          icon={Inbox}
          title="No items"
          description="Description"
        />
      )
      const icon = screen.getByTestId('empty-state-icon')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })

    it('action button is properly labeled', () => {
      render(
        <EmptyState
          title="No items"
          description="Description"
          action={{
            label: 'Add new item',
            onClick: () => {},
          }}
        />
      )
      const button = screen.getByRole('button', { name: 'Add new item' })
      expect(button).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('renders centered by default', () => {
      const { container } = render(
        <EmptyState title="No items" description="Description" />
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
    })

    it('applies custom className', () => {
      const { container } = render(
        <EmptyState
          title="No items"
          description="Description"
          className="custom-class"
        />
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('custom-class')
    })
  })
})
