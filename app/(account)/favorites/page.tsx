import { Metadata } from 'next'
import Link from 'next/link'
import { getUserFavorites } from '@/lib/services/favorites.service'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HotelCard } from '@/components/hotels/HotelCard'
import { CarCard } from '@/components/cars/CarCard'
import { ArrowRight, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Your Favorites',
  description: 'View your saved sanctuaries and fleet on Mlinda Travels.',
}

export default async function FavoritesPage() {
  const { hotels, cars } = await getUserFavorites()
  const hasFavorites = hotels.length > 0 || cars.length > 0

  return (
    <div className="container-base py-12 md:py-20 min-h-[60vh]">
      
      {/* Premium Header */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-5 h-5 text-primary fill-primary/20" />
          <span className="text-primary font-mono tracking-widest uppercase text-xs">Curated Collection</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tighter leading-[1.1] mb-6">
          Your Saved <br className="hidden md:block" />
          <span className="italic font-light text-muted-foreground">Experiences.</span>
        </h1>
        <p className="text-lg text-muted-foreground font-light">
          A personalized collection of your favorite sanctuaries and uncompromising mobility.
        </p>
      </div>

      {!hasFavorites ? (
        <div className="border border-border/40 rounded-[2rem] p-12 md:p-24 text-center bg-card flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-4">Your collection is empty</h2>
          <p className="text-muted-foreground font-light max-w-md mx-auto mb-8">
            You haven't saved any sanctuaries or vehicles to your collection yet. Start exploring to curate your perfect journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/hotels" className="inline-flex items-center justify-center bg-foreground text-background hover:bg-primary transition-colors px-6 py-3 rounded-full font-medium text-sm group">
              Explore Sanctuaries <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/cars" className="inline-flex items-center justify-center border border-border hover:bg-muted text-foreground transition-colors px-6 py-3 rounded-full font-medium text-sm">
              View The Fleet
            </Link>
          </div>
        </div>
      ) : (
        <Tabs defaultValue={hotels.length > 0 ? "stays" : "cars"} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-border/40 pb-4">
            <TabsList className="bg-transparent h-auto p-0 gap-6">
              <TabsTrigger 
                value="stays"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-primary p-0 pb-3 font-medium text-lg"
              >
                Saved Sanctuaries ({hotels.length})
              </TabsTrigger>
              <TabsTrigger 
                value="cars"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-primary p-0 pb-3 font-medium text-lg"
              >
                Saved Fleet ({cars.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="stays" className="mt-0 outline-none">
            {hotels.length === 0 ? (
              <p className="text-muted-foreground italic mt-8">No sanctuaries saved yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-4">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cars" className="mt-0 outline-none">
            {cars.length === 0 ? (
              <p className="text-muted-foreground italic mt-8">No vehicles saved yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-4">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
