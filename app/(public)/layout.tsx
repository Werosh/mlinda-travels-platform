import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="hidden md:block">
        <Header />
      </div>
      {/* 
        On mobile, we add pb-20 so content isn't hidden behind the bottom tab bar.
        On desktop, we have normal behavior. 
      */}
      <main className="min-h-screen pb-20 md:pb-0">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav />
    </>
  )
}
