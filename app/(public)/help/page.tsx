import { Metadata } from 'next'
import { Search } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: 'Help & FAQ | Mlinda Travels',
  description: 'Frequently asked questions and support for Mlinda Travels.',
}

const faqs = [
  {
    category: 'Booking & Reservations',
    questions: [
      {
        q: 'How do I make a reservation?',
        a: 'You can book hotels and cars directly through our website. Simply search for your desired destination, select your dates, and follow the seamless checkout process.'
      },
      {
        q: 'Can I modify or cancel my booking?',
        a: 'Yes, most bookings can be modified or cancelled up to 48 hours before the scheduled date. Please log in to your account and go to "My Bookings" to manage your reservations.'
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. We use Stripe for payment processing, which provides bank-level encryption. We do not store your credit card details on our servers.'
      }
    ]
  },
  {
    category: 'Hotels',
    questions: [
      {
        q: 'Are taxes and fees included in the price?',
        a: 'Yes, all prices displayed on our platform are inclusive of local taxes and service charges, unless explicitly stated otherwise during checkout.'
      },
      {
        q: 'What is the standard check-in and check-out time?',
        a: 'Standard check-in is typically at 2:00 PM, and check-out is at 12:00 PM (Noon). However, this may vary slightly depending on the specific property.'
      }
    ]
  },
  {
    category: 'Car Rentals',
    questions: [
      {
        q: 'What do I need to rent a car?',
        a: 'You will need a valid International Driving Permit (IDP) with a Sri Lankan endorsement, a valid passport, and a credit card in your name for the security deposit.'
      },
      {
        q: 'Does the rental include insurance?',
        a: 'Yes, all our car rentals include comprehensive insurance cover. However, a refundable security deposit is required upon vehicle handover.'
      },
      {
        q: 'Can the car be delivered to my hotel or the airport?',
        a: 'Yes, we offer vehicle delivery and collection services across major cities and at the Bandaranaike International Airport (CMB). Additional charges may apply based on the location.'
      }
    ]
  }
]

export default function HelpPage() {
  return (
    <div className="pt-28 pb-20 bg-background min-h-screen">
      <div className="container-base max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl text-foreground font-bold mb-6">
            How can we help?
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full h-14 pl-12 pr-4 rounded-2xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm text-base transition-colors"
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-12">
          {faqs.map((category) => (
            <div key={category.category}>
              <h2 className="font-heading text-2xl font-semibold mb-6 text-foreground">
                {category.category}
              </h2>
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-2">
                <Accordion multiple className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${category.category}-${index}`}
                      className="border-b last:border-b-0 border-border px-4"
                    >
                      <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-primary-light/40 rounded-2xl p-8 text-center border border-primary/10">
          <h3 className="font-heading text-xl font-semibold mb-2">Still need help?</h3>
          <p className="text-muted-foreground mb-6">Our support team is available 24/7 to assist you.</p>
          <a href="/contact" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 font-medium text-white transition-colors hover:bg-primary-dark">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
