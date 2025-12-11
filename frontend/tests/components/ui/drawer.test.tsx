import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Drawer } from '@/components/ui/drawer'

describe('Drawer', () => {
  describe('Rendering', () => {
    it('renders when open', () => {
      render(
        <Drawer open={true} onClose={() => {}}>
          <div>Drawer content</div>
        </Drawer>
      )
      expect(screen.getByText('Drawer content')).toBeInTheDocument()
    })

    it('does not render when closed', () => {
      render(
        <Drawer open={false} onClose={() => {}}>
          <div>Drawer content</div>
        </Drawer>
      )
      expect(screen.queryByText('Drawer content')).not.toBeInTheDocument()
    })

    it('renders with title', () => {
      render(
        <Drawer open={true} onClose={() => {}} title="Menu">
          <div>Content</div>
        </Drawer>
      )
      expect(screen.getByText('Menu')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onClose when overlay is clicked', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()
      render(
        <Drawer open={true} onClose={onClose}>
          <div>Content</div>
        </Drawer>
      )

      const overlay = screen.getByTestId('drawer-overlay')
      await user.click(overlay)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()
      render(
        <Drawer open={true} onClose={onClose} title="Menu">
          <div>Content</div>
        </Drawer>
      )

      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not close when clicking inside drawer', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()
      render(
        <Drawer open={true} onClose={onClose}>
          <div>Content</div>
        </Drawer>
      )

      const content = screen.getByText('Content')
      await user.click(content)

      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('Positions', () => {
    it('renders from left by default', () => {
      const { container } = render(
        <Drawer open={true} onClose={() => {}}>
          <div>Content</div>
        </Drawer>
      )
      const drawer = container.querySelector('[data-position="left"]')
      expect(drawer).toBeInTheDocument()
    })

    it('renders from right', () => {
      const { container } = render(
        <Drawer open={true} onClose={() => {}} position="right">
          <div>Content</div>
        </Drawer>
      )
      const drawer = container.querySelector('[data-position="right"]')
      expect(drawer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has dialog role', () => {
      render(
        <Drawer open={true} onClose={() => {}}>
          <div>Content</div>
        </Drawer>
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('has aria-modal attribute', () => {
      render(
        <Drawer open={true} onClose={() => {}}>
          <div>Content</div>
        </Drawer>
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })
  })
})
