import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  describe('Rendering', () => {
    it('renders with placeholder text', () => {
      render(<Input placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('renders with label', () => {
      render(<Input label="Email" id="email" />)
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
    })

    it('renders with value', () => {
      render(<Input value="test value" onChange={() => {}} />)
      expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<Input className="custom-class" data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveClass('custom-class')
    })
  })

  describe('States', () => {
    it('renders disabled state', () => {
      render(<Input disabled placeholder="Disabled" />)
      const input = screen.getByPlaceholderText('Disabled')
      expect(input).toBeDisabled()
    })

    it('renders error state with message', () => {
      render(<Input error="This field is required" label="Name" id="name" />)
      expect(screen.getByText('This field is required')).toBeInTheDocument()
      const input = screen.getByLabelText('Name')
      expect(input).toHaveClass('border-error')
    })

    it('renders required field with asterisk', () => {
      render(<Input label="Email" id="email" required />)
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('renders with helper text', () => {
      render(<Input helperText="Enter your email address" label="Email" id="email" />)
      expect(screen.getByText('Enter your email address')).toBeInTheDocument()
    })
  })

  describe('Types', () => {
    it('renders password input type', () => {
      render(<Input type="password" placeholder="Password" />)
      const input = screen.getByPlaceholderText('Password')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('renders email input type', () => {
      render(<Input type="email" placeholder="Email" />)
      const input = screen.getByPlaceholderText('Email')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('renders number input type', () => {
      render(<Input type="number" placeholder="Age" />)
      const input = screen.getByPlaceholderText('Age')
      expect(input).toHaveAttribute('type', 'number')
    })
  })

  describe('Interactions', () => {
    it('handles onChange event', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      render(<Input onChange={handleChange} placeholder="Type here" />)
      
      const input = screen.getByPlaceholderText('Type here')
      await user.type(input, 'test')
      
      expect(handleChange).toHaveBeenCalled()
    })

    it('handles onFocus event', async () => {
      const user = userEvent.setup()
      const handleFocus = jest.fn()
      render(<Input onFocus={handleFocus} placeholder="Focus me" />)
      
      const input = screen.getByPlaceholderText('Focus me')
      await user.click(input)
      
      expect(handleFocus).toHaveBeenCalled()
    })

    it('handles onBlur event', async () => {
      const user = userEvent.setup()
      const handleBlur = jest.fn()
      render(<Input onBlur={handleBlur} placeholder="Blur me" />)
      
      const input = screen.getByPlaceholderText('Blur me')
      await user.click(input)
      await user.tab()
      
      expect(handleBlur).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('associates label with input using htmlFor', () => {
      render(<Input label="Username" id="username" />)
      const input = screen.getByLabelText('Username')
      expect(input).toHaveAttribute('id', 'username')
    })

    it('provides aria-invalid when error exists', () => {
      render(<Input error="Invalid input" id="test" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('provides aria-describedby for error message', () => {
      render(<Input error="Error message" id="test" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby')
    })

    it('provides aria-required for required fields', () => {
      render(<Input required id="test" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('Variants', () => {
    it('renders with full width', () => {
      render(<Input fullWidth data-testid="input" />)
      const container = screen.getByTestId('input').parentElement
      expect(container).toHaveClass('w-full')
    })

    it('renders with custom size classes', () => {
      render(<Input className="h-12 text-lg" data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveClass('h-12', 'text-lg')
    })
  })
})
