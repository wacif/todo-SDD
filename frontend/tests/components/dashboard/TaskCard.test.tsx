import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { TaskCard } from '@/components/dashboard/TaskCard'

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('TaskCard', () => {
  describe('Rendering', () => {
    it('renders task title and description', () => {
      render(<TaskCard task={mockTask} onToggleComplete={() => {}} />)
      expect(screen.getByText('Test Task')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })

    it('renders without description', () => {
      const taskWithoutDesc = { ...mockTask, description: null }
      render(<TaskCard task={taskWithoutDesc} onToggleComplete={() => {}} />)
      expect(screen.getByText('Test Task')).toBeInTheDocument()
      expect(screen.queryByText('Test Description')).not.toBeInTheDocument()
    })

    it('renders completed badge when task is complete', () => {
      const completedTask = { ...mockTask, completed: true }
      render(<TaskCard task={completedTask} onToggleComplete={() => {}} />)
      expect(screen.getByText('Completed')).toBeInTheDocument()
    })

    it('renders pending badge when task is not complete', () => {
      render(<TaskCard task={mockTask} onToggleComplete={() => {}} />)
      expect(screen.getByText('Pending')).toBeInTheDocument()
    })

    it('renders formatted date', () => {
      render(<TaskCard task={mockTask} onToggleComplete={() => {}} />)
      // Date should be formatted (exact format may vary by locale)
      expect(screen.getByText(/Jan|January/)).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onToggleComplete when checkbox is clicked', async () => {
      const user = userEvent.setup()
      const onToggleComplete = jest.fn()
      render(<TaskCard task={mockTask} onToggleComplete={onToggleComplete} />)

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(onToggleComplete).toHaveBeenCalledWith('1')
    })

    it('calls onEdit when edit button is clicked', async () => {
      const user = userEvent.setup()
      const onEdit = jest.fn()
      render(
        <TaskCard task={mockTask} onToggleComplete={() => {}} onEdit={onEdit} />
      )

      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)

      expect(onEdit).toHaveBeenCalledWith(mockTask)
    })

    it('calls onDelete when delete button is clicked', async () => {
      const user = userEvent.setup()
      const onDelete = jest.fn()
      render(
        <TaskCard task={mockTask} onToggleComplete={() => {}} onDelete={onDelete} />
      )

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      expect(onDelete).toHaveBeenCalledWith('1')
    })

    it('checkbox reflects completed state', () => {
      const { rerender } = render(
        <TaskCard task={mockTask} onToggleComplete={() => {}} />
      )
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement
      expect(checkbox.checked).toBe(false)

      rerender(
        <TaskCard
          task={{ ...mockTask, completed: true }}
          onToggleComplete={() => {}}
        />
      )
      expect(checkbox.checked).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('has accessible checkbox label', () => {
      render(<TaskCard task={mockTask} onToggleComplete={() => {}} />)
      const checkbox = screen.getByRole('checkbox', {
        name: /mark.*complete/i,
      })
      expect(checkbox).toBeInTheDocument()
    })

    it('edit button has accessible label', () => {
      render(
        <TaskCard task={mockTask} onToggleComplete={() => {}} onEdit={() => {}} />
      )
      expect(screen.getByRole('button', { name: /edit task/i })).toBeInTheDocument()
    })

    it('delete button has accessible label', () => {
      render(
        <TaskCard
          task={mockTask}
          onToggleComplete={() => {}}
          onDelete={() => {}}
        />
      )
      expect(
        screen.getByRole('button', { name: /delete task/i })
      ).toBeInTheDocument()
    })
  })

  describe('Visual States', () => {
    it('applies completed styling when task is complete', () => {
      const completedTask = { ...mockTask, completed: true }
      render(<TaskCard task={completedTask} onToggleComplete={() => {}} />)
      const title = screen.getByText('Test Task')
      expect(title).toHaveClass('line-through')
    })

    it('does not apply completed styling when task is not complete', () => {
      render(<TaskCard task={mockTask} onToggleComplete={() => {}} />)
      const title = screen.getByText('Test Task')
      expect(title).not.toHaveClass('line-through')
    })
  })
})
