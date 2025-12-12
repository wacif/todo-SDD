import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-transparent hover:shadow-[0_0_30px_rgba(79,70,229,0.4)]',
        secondary:
          'bg-muted text-foreground hover:bg-muted/80 border border-border',
        outline:
          'bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30',
        ghost:
          'bg-transparent text-gray-300 hover:text-white hover:bg-white/10',
        danger:
          'bg-error text-white hover:bg-error/90 active:bg-error shadow-sm',
      },
      size: {
        sm: 'h-9 px-3 py-1.5 text-sm',
        md: 'h-10 px-5 py-2.5 text-base',
        lg: 'h-12 px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, disabled, children, ...props }, ref) => {
    // Don't use asChild when loading (Slot requires single child)
    const Comp = (isLoading || !asChild) ? 'button' : Slot
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 
            className="h-4 w-4 animate-spin" 
            data-testid="button-spinner"
            aria-hidden="true"
          />
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
