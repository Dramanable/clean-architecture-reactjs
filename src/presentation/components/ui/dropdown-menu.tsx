import React from 'react'

// Types pour le dropdown menu
interface DropdownMenuProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: React.ReactNode
  onClick?: () => void
}

interface DropdownMenuContentProps {
  align?: 'start' | 'center' | 'end'
  className?: string
  children: React.ReactNode
  onClose?: () => void
}

interface DropdownMenuItemProps {
  onClick?: () => void
  className?: string
  children: React.ReactNode
}

export function DropdownMenu({ open, onOpenChange, children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(open || false)
  
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])
  
  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }
  
  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            return React.cloneElement(child as React.ReactElement<DropdownMenuTriggerProps>, { 
              onClick: () => handleOpenChange(!isOpen)
            })
          }
          if (child.type === DropdownMenuContent) {
            return isOpen ? React.cloneElement(child as React.ReactElement<DropdownMenuContentProps>, { 
              onClose: () => handleOpenChange(false)
            }) : null
          }
        }
        return child
      })}
    </div>
  )
}

export function DropdownMenuTrigger({ asChild, children, onClick }: DropdownMenuTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>
    return React.cloneElement(childElement, {
      onClick: (e: React.MouseEvent) => {
        childElement.props.onClick?.(e)
        onClick?.()
      }
    })
  }
  
  return (
    <button onClick={onClick} className="inline-flex items-center">
      {children}
    </button>
  )
}

export function DropdownMenuContent({ align = 'start', className = '', children, onClose }: DropdownMenuContentProps & { onClose?: () => void }) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        onClose?.()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])
  
  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0'
  }
  
  return (
    <div
      ref={contentRef}
      className={`absolute top-full mt-1 ${alignmentClasses[align]} z-50 bg-white border border-gray-200 rounded-md shadow-lg py-1 ${className}`}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ onClick, className = '', children }: DropdownMenuItemProps) {
  return (
    <div
      onClick={onClick}
      className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer ${className}`}
    >
      {children}
    </div>
  )
}
