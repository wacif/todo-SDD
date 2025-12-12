import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Toast, ToastProvider, useToast } from '@/components/ui/toast'

// Test component that uses the toast hook
function TestComponent() {
  const { toast } = useToast()

  return (
    <div>
      <button onClick={() => toast({ title: 'Test toast', description: 'This is a test' })}>
        Show Toast
      </button>
      <button onClick={() => toast({ title: 'Success!', variant: 'success' })}>
        Show Success
      </button>
      <button onClick={() => toast({ title: 'Error!', variant: 'destructive' })}>
        Show Error
      </button>
    </div>
  )
}

describe('Toast', () => {
  describe('Rendering', () => {
    it('renders toast with title', async () => {
      const user = userEvent.setup()
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Toast'))
      await waitFor(() => {
        expect(screen.getByText('Test toast')).toBeInTheDocument()
      })
    })

    it('renders toast with title and description', async () => {
      const user = userEvent.setup()
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Toast'))
      await waitFor(() => {
        expect(screen.getByText('Test toast')).toBeInTheDocument()
        expect(screen.getByText('This is a test')).toBeInTheDocument()
      })
    })
  })

  describe('Variants', () => {
    it('renders success variant', async () => {
      const user = userEvent.setup()
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Success'))
      await waitFor(() => {
        const toast = screen.getByText('Success!').closest('[role="status"]')
        expect(toast).toHaveClass('bg-success')
      })
    })

    it('renders destructive variant', async () => {
      const user = userEvent.setup()
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Error'))
      await waitFor(() => {
        const toast = screen.getByText('Error!').closest('[role="alert"]')
        expect(toast).toHaveClass('bg-error')
      })
    })
  })

  describe('Interactions', () => {
    it('closes toast when close button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Toast'))
      await waitFor(() => {
        expect(screen.getByText('Test toast')).toBeInTheDocument()
      })

      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Test toast')).not.toBeInTheDocument()
      })
    })

    it('auto-dismisses after duration', async () => {
      const user = userEvent.setup()
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Toast'))
      await waitFor(() => {
        expect(screen.getByText('Test toast')).toBeInTheDocument()
      })

      // Wait for auto-dismiss (default 5000ms)
      await waitFor(
        () => {
          expect(screen.queryByText('Test toast')).not.toBeInTheDocument()
        },
        { timeout: 6000 }
      )
    }, 10000) // Increase test timeout to 10 seconds
  })

  describe('Multiple Toasts', () => {
    it('renders multiple toasts simultaneously', async () => {
      const user = userEvent.setup()
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Toast'))
      await user.click(screen.getByText('Show Success'))

      await waitFor(() => {
        expect(screen.getByText('Test toast')).toBeInTheDocument()
        expect(screen.getByText('Success!')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('uses correct ARIA role for default toast', async () => {
      const user = userEvent.setup()
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Toast'))
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument()
      })
    })

    it('uses alert role for destructive toast', async () => {
      const user = userEvent.setup()
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Error'))
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
    })

    it('has accessible close button', async () => {
      const user = userEvent.setup()
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Toast'))
      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close/i })
        expect(closeButton).toBeInTheDocument()
      })
    })
  })
})
