import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { TaskForm } from '@/components/dashboard/TaskForm'

describe('TaskForm', () => {
  describe('Rendering', () => {
    it('renders all form fields', () => {
      render(<TaskForm onSubmit={() => {}} onCancel={() => {}} />)
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /submit|create|save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('renders in create mode by default', () => {
      render(<TaskForm onSubmit={() => {}} onCancel={() => {}} />)
      expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument()
    })

    it('renders in edit mode with initial values', () => {
      const initialTask = {
        id: '1',
        title: 'Edit Task',
        description: 'Edit Description',
        completed: false,
      }
      render(
        <TaskForm
          onSubmit={() => {}}
          onCancel={() => {}}
          initialTask={initialTask}
        />
      )
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
      expect(screen.getByDisplayValue('Edit Task')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Edit Description')).toBeInTheDocument()
    })

    it('renders without description in edit mode', () => {
      const initialTask = {
        id: '1',
        title: 'Edit Task',
        description: null,
        completed: false,
      }
      render(
        <TaskForm
          onSubmit={() => {}}
          onCancel={() => {}}
          initialTask={initialTask}
        />
      )
      expect(screen.getByDisplayValue('Edit Task')).toBeInTheDocument()
      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement
      expect(descriptionInput.value).toBe('')
    })
  })

  describe('Validation', () => {
    it('shows error when title is empty', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={() => {}} onCancel={() => {}} />)

      const submitButton = screen.getByRole('button', { name: /create task/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      })
    })

    it('does not show error for empty description', async () => {
      const user = userEvent.setup()
      const onSubmit = jest.fn()
      render(<TaskForm onSubmit={onSubmit} onCancel={() => {}} />)

      const titleInput = screen.getByLabelText(/title/i)
      await user.type(titleInput, 'Test Task')

      const submitButton = screen.getByRole('button', { name: /create task/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          title: 'Test Task',
          description: '',
        })
      })
    })

    it('validates title length', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={() => {}} onCancel={() => {}} />)

      const titleInput = screen.getByLabelText(/title/i)
      await user.type(titleInput, 'Ab')

      const submitButton = screen.getByRole('button', { name: /create task/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('calls onSubmit with form data', async () => {
      const user = userEvent.setup()
      const onSubmit = jest.fn()
      render(<TaskForm onSubmit={onSubmit} onCancel={() => {}} />)

      const titleInput = screen.getByLabelText(/title/i)
      const descriptionInput = screen.getByLabelText(/description/i)

      await user.type(titleInput, 'New Task')
      await user.type(descriptionInput, 'New Description')

      const submitButton = screen.getByRole('button', { name: /create task/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          title: 'New Task',
          description: 'New Description',
        })
      })
    })

    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      const onCancel = jest.fn()
      render(<TaskForm onSubmit={() => {}} onCancel={onCancel} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('shows loading state during submission', async () => {
      const user = userEvent.setup()
      const onSubmit = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )
      render(<TaskForm onSubmit={onSubmit} onCancel={() => {}} />)

      const titleInput = screen.getByLabelText(/title/i)
      await user.type(titleInput, 'New Task')

      const submitButton = screen.getByRole('button', { name: /create task/i })
      await user.click(submitButton)

      // Button should show loading state
      expect(submitButton).toBeDisabled()
    })

    it('resets form after successful submission in create mode', async () => {
      const user = userEvent.setup()
      const onSubmit = jest.fn().mockResolvedValue(undefined)
      render(<TaskForm onSubmit={onSubmit} onCancel={() => {}} />)

      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement
      await user.type(titleInput, 'New Task')

      const submitButton = screen.getByRole('button', { name: /create task/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(titleInput.value).toBe('')
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper form structure', () => {
      const { container } = render(<TaskForm onSubmit={() => {}} onCancel={() => {}} />)
      const form = container.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('title input has required attribute', () => {
      render(<TaskForm onSubmit={() => {}} onCancel={() => {}} />)
      const titleInput = screen.getByLabelText(/title/i)
      expect(titleInput).toBeRequired()
    })

    it('description is optional', () => {
      render(<TaskForm onSubmit={() => {}} onCancel={() => {}} />)
      const descriptionInput = screen.getByLabelText(/description/i)
      expect(descriptionInput).not.toBeRequired()
    })
  })
})
