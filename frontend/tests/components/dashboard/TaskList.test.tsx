import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TaskList } from '@/components/dashboard/TaskList'

const mockTasks = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    completed: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    completed: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    title: 'Task 3',
    description: null,
    completed: false,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
]

describe('TaskList', () => {
  describe('Rendering', () => {
    it('renders all tasks', () => {
      render(
        <TaskList tasks={mockTasks} onToggleComplete={() => {}} />
      )
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
      expect(screen.getByText('Task 3')).toBeInTheDocument()
    })

    it('renders empty state when no tasks', () => {
      render(
        <TaskList
          tasks={[]}
          onToggleComplete={() => {}}
          emptyMessage="No tasks available"
        />
      )
      expect(screen.getByText('No tasks available')).toBeInTheDocument()
    })

    it('uses default empty message', () => {
      render(<TaskList tasks={[]} onToggleComplete={() => {}} />)
      expect(screen.getByText(/no tasks/i)).toBeInTheDocument()
    })

    it('renders tasks in a list', () => {
      const { container } = render(
        <TaskList tasks={mockTasks} onToggleComplete={() => {}} />
      )
      const list = container.querySelector('ul')
      expect(list).toBeInTheDocument()
      const listItems = container.querySelectorAll('li')
      expect(listItems).toHaveLength(3)
    })
  })

  describe('Task Card Integration', () => {
    it('passes onToggleComplete to TaskCard', () => {
      render(
        <TaskList tasks={mockTasks} onToggleComplete={() => {}} />
      )
      // Checkboxes should be rendered by TaskCard
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(3)
    })

    it('passes onEdit to TaskCard', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={() => {}}
          onEdit={() => {}}
        />
      )
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      expect(editButtons).toHaveLength(3)
    })

    it('passes onDelete to TaskCard', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={() => {}}
          onDelete={() => {}}
        />
      )
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      expect(deleteButtons).toHaveLength(3)
    })
  })

  describe('Filtering', () => {
    it('shows all tasks by default', () => {
      render(
        <TaskList tasks={mockTasks} onToggleComplete={() => {}} />
      )
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
      expect(screen.getByText('Task 3')).toBeInTheDocument()
    })

    it('filters to show only pending tasks', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={() => {}}
          filter="pending"
        />
      )
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument()
      expect(screen.getByText('Task 3')).toBeInTheDocument()
    })

    it('filters to show only completed tasks', () => {
      render(
        <TaskList
          tasks={mockTasks}
          onToggleComplete={() => {}}
          filter="completed"
        />
      )
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
      expect(screen.queryByText('Task 3')).not.toBeInTheDocument()
    })

    it('shows empty state when filter matches no tasks', () => {
      render(
        <TaskList
          tasks={[mockTasks[0]]}
          onToggleComplete={() => {}}
          filter="completed"
        />
      )
      expect(screen.getByText(/no tasks/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has semantic list structure', () => {
      const { container } = render(
        <TaskList tasks={mockTasks} onToggleComplete={() => {}} />
      )
      const list = container.querySelector('ul')
      expect(list).toBeInTheDocument()
    })

    it('each task is in a list item', () => {
      const { container } = render(
        <TaskList tasks={mockTasks} onToggleComplete={() => {}} />
      )
      const listItems = container.querySelectorAll('li')
      expect(listItems).toHaveLength(3)
    })
  })
})
