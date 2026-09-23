import type { Metadata } from 'next'
import { getFeaturedHotels } from '@/lib/services/hotels.service'
import { getFeaturedCars } from '@/lib/services/cars.service'
import { DesktopHome } from '@/components/home/DesktopHome'
import { MobileHome } from '@/components/home/MobileHome'

export const metadata: Metadata = {
  title: 'Mlinda Travels - Premium Hotels & Car Rentals in Sri Lanka',
  description:
    'Book world-class hotels and car rentals across Sri Lanka. Real-time availability, seamless checkout, and exceptional service. Your journey begins here.',
}

const destinations = [
  {
    city: 'Colombo',
    subtitle: 'The Vibrant Capital',
    image: 'https://hblimg.mmtcdn.com/content/hubble/img/tvdestinationimages/mmt/activities/m_Colombo_tv_destination_img_1_l_553_1000.jpg',
  },
  {
    city: 'Galle',
    subtitle: 'Colonial Charm & Beaches',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB0JQP-tUGSgltOJqmyUNyQE-k--oaJHYA80T-3q7Z9w&s=10',
  },
  {
    city: 'Nuwara Eliya',
    subtitle: 'Tea Country Highlands',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1bE1OmvgrzvvxA479IN0jdA1u3e2pvE3bHOWq5MyykquzCX_7vszyWZ8&s=10',
  },
  {
    city: 'Yala',
    subtitle: 'Wildlife & Wilderness',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7htlP_yN-BT5_WK009nW7kf7v0sbCxcoTBUd0zosmeWYPE9pZ-KbS-S0&s=10',
  },
  {
    city: 'Kandy',
    subtitle: 'Cultural Heart',
    image: 'https://cdn.getyourguide.com/image/format=auto%2Cfit=crop%2Cgravity=auto%2Cquality=60%2Cwidth=400%2Cheight=265%2Cdpr=2/tour_img/814969a60a962449758241b506e010f2c69c83002c9b00726687587d90e0af5c.jpeg',
  },
  {
    city: 'Negombo',
    subtitle: 'Coastal Gateway',
    image: 'https://content.r9cdn.net/rimg/dimg/16/71/1bacba85-city-46478-169110981a8.jpg?width=1366&height=768&crop=true',
  },
]

export default async function HomePage() {
  const [featuredHotels, featuredCars] = await Promise.all([
    getFeaturedHotels(6),
    getFeaturedCars(6),
  ])

  return (
    <>
      <DesktopHome
        destinations={destinations}
        featuredHotels={featuredHotels}
        featuredCars={featuredCars}
      />
      <MobileHome
        destinations={destinations}
        featuredHotels={featuredHotels}
        featuredCars={featuredCars}
      />
    </>
  )
}
