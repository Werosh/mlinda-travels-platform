'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileHeaderProps {
  title?: string
  showBack?: boolean
  transparent?: boolean
  rightAction?: React.ReactNode
}

export function MobileHeader({ title, showBack = false, transparent = false, rightAction }: MobileHeaderProps) {
  const router = useRouter()

  return (
    <header
      className={cn(
        'md:hidden fixed top-0 left-0 right-0 z-50 pt-safe transition-colors duration-300',
        transparent ? 'bg-transparent text-white' : 'bg-white/95 backdrop-blur-md border-b border-border text-foreground'
      )}
    >
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center w-12">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className={cn("rounded-full", transparent && "hover:bg-white/20")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        <div className="flex-1 text-center truncate px-4">
          <span className="font-heading font-semibold text-lg">{title}</span>
        </div>

        <div className="flex items-center justify-end w-12">
          {rightAction || (
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-full", transparent && "hover:bg-white/20")}
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
