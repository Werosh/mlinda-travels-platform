import { Metadata } from 'next'
import { SearchWidget } from '@/components/search/SearchWidget'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Search',
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Top Bar */}
      <div className="h-14 flex items-center px-4 border-b border-border bg-white sticky top-0 z-50">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted active:bg-muted text-foreground">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-heading font-bold text-lg mx-auto pr-8">Where to?</h1>
      </div>

      <div className="p-4">
        {/* We use the inline variant of SearchWidget for the search page */}
        <SearchWidget variant="inline" className="border-none shadow-none bg-transparent p-0 md:p-0" />
      </div>
    </div>
  )
}
