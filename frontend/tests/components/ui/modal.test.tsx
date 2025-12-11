import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Modal } from '@/components/ui/modal'

describe('Modal', () => {
  describe('Rendering', () => {
    it('renders when open is true', () => {
      render(
        <Modal open={true} onClose={() => {}}>
          <Modal.Content>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Body>Modal content</Modal.Body>
          </Modal.Content>
        </Modal>
      )
      expect(screen.getByText('Test Modal')).toBeInTheDocument()
      expect(screen.getByText('Modal content')).toBeInTheDocument()
    })

    it('does not render when open is false', () => {
      render(
        <Modal open={false} onClose={() => {}}>
          <Modal.Content>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Body>Modal content</Modal.Body>
          </Modal.Content>
        </Modal>
      )
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    })

    it('renders with footer', () => {
      render(
        <Modal open={true} onClose={() => {}}>
          <Modal.Content>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Body>Modal content</Modal.Body>
            <Modal.Footer>Footer content</Modal.Footer>
          </Modal.Content>
        </Modal>
      )
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()
      render(
        <Modal open={true} onClose={onClose}>
          <Modal.Content>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Body>Modal content</Modal.Body>
          </Modal.Content>
        </Modal>
      )

      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when overlay is clicked', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()
      render(
        <Modal open={true} onClose={onClose}>
          <Modal.Content>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Body>Modal content</Modal.Body>
          </Modal.Content>
        </Modal>
      )

      const overlay = screen.getByTestId('modal-overlay')
      await user.click(overlay)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not close when clicking inside modal content', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()
      render(
        <Modal open={true} onClose={onClose}>
          <Modal.Content>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Body>Modal content</Modal.Body>
          </Modal.Content>
        </Modal>
      )

      const modalBody = screen.getByText('Modal content')
      await user.click(modalBody)

      expect(onClose).not.toHaveBeenCalled()
    })

    it('closes on Escape key press', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()
      render(
        <Modal open={true} onClose={onClose}>
          <Modal.Content>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Body>Modal content</Modal.Body>
          </Modal.Content>
        </Modal>
      )

      await user.keyboard('{Escape}')

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('has dialog role', () => {
      render(
        <Modal open={true} onClose={() => {}}>
          <Modal.Content>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Body>Modal content</Modal.Body>
          </Modal.Content>
        </Modal>
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('has aria-modal attribute', () => {
      render(
        <Modal open={true} onClose={() => {}}>
          <Modal.Content>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Body>Modal content</Modal.Body>
          </Modal.Content>
        </Modal>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    it('has aria-labelledby when header is present', () => {
      render(
        <Modal open={true} onClose={() => {}}>
          <Modal.Content>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Body>Modal content</Modal.Body>
          </Modal.Content>
        </Modal>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby')
    })

    it('traps focus inside modal', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <button>Outside button</button>
          <Modal open={true} onClose={() => {}}>
            <Modal.Content>
              <Modal.Header>Test Modal</Modal.Header>
              <Modal.Body>
                <button>Inside button</button>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </div>
      )

      const insideButton = screen.getByText('Inside button')
      const closeButton = screen.getByRole('button', { name: /close/i })

      // Focus is automatically set to first element when modal opens
      await waitFor(() => {
        expect(closeButton).toHaveFocus()
      })

      // Tab should cycle between elements inside modal only
      await user.tab()
      expect(insideButton).toHaveFocus()

      await user.tab()
      expect(closeButton).toHaveFocus()
    })
  })

  describe('Sizes', () => {
    it('renders with small size', () => {
      render(
        <Modal open={true} onClose={() => {}} size="sm">
          <Modal.Content>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Body>Modal content</Modal.Body>
          </Modal.Content>
        </Modal>
      )

      const content = screen.getByText('Modal content').closest('[role="dialog"]')
      expect(content).toHaveClass('max-w-md')
    })

    it('renders with large size', () => {
      render(
        <Modal open={true} onClose={() => {}} size="lg">
          <Modal.Content>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Body>Modal content</Modal.Body>
          </Modal.Content>
        </Modal>
      )

      const content = screen.getByText('Modal content').closest('[role="dialog"]')
      expect(content).toHaveClass('max-w-4xl')
    })
  })
})
