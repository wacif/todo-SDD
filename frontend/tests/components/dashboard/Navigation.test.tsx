import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Navigation } from '@/components/dashboard/Navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('Navigation', () => {
  describe('Rendering', () => {
    it('renders app name', () => {
      render(<Navigation />)
      expect(screen.getByText('TaskFlow')).toBeInTheDocument()
    })

    it('renders logout button', () => {
      render(<Navigation />)
      expect(screen.getByRole('button', { name: /logout|sign out/i })).toBeInTheDocument()
    })

    it('renders user info if provided', () => {
      render(<Navigation userName="John Doe" />)
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('does not render user info if not provided', () => {
      render(<Navigation />)
      expect(screen.queryByText(/john/i)).not.toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onLogout when logout button is clicked', async () => {
      const user = userEvent.setup()
      const onLogout = jest.fn()
      render(<Navigation onLogout={onLogout} />)

      const logoutButton = screen.getByRole('button', { name: /logout|sign out/i })
      await user.click(logoutButton)

      expect(onLogout).toHaveBeenCalledTimes(1)
    })

    it('shows loading state during logout', async () => {
      const user = userEvent.setup()
      const onLogout = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )
      render(<Navigation onLogout={onLogout} />)

      const logoutButton = screen.getByRole('button', { name: /logout|sign out/i })
      await user.click(logoutButton)

      expect(logoutButton).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('has navigation landmark', () => {
      const { container } = render(<Navigation />)
      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    it('logout button is properly labeled', () => {
      render(<Navigation />)
      const button = screen.getByRole('button', { name: /logout|sign out/i })
      expect(button).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('renders with proper structure', () => {
      const { container } = render(<Navigation userName="Test User" />)
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('border-b')
    })

    it('applies custom className', () => {
      const { container } = render(<Navigation className="custom-class" />)
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('custom-class')
    })
  })
})
