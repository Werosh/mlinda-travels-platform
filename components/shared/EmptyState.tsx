import { cn } from '@/lib/utils'
import { PackageOpen, Search, Star, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  icon?: 'search' | 'package' | 'star' | 'car'
  title: string
  description?: string
  action?: {
    label: string
    href: string
  }
  className?: string
}

const icons = {
  search: Search,
  package: PackageOpen,
  star: Star,
  car: Car,
}

export function EmptyState({
  icon = 'package',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon = icons[icon]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm max-w-md leading-relaxed">{description}</p>
      )}
      {action && (
        <Button asChild className="mt-6 rounded-xl bg-primary hover:bg-primary-dark">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}
