import { Metadata } from 'next'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Contact Us | Mlinda Travels',
  description: 'Get in touch with our team for any inquiries about your Sri Lankan journey.',
}

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20 bg-background">
      <div className="container-base">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl text-foreground font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-muted-foreground text-lg">
            Whether you have a question about our services, need help with a booking, or just want to say hello, we're here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Details & Map */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="font-heading text-2xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Our Office</h3>
                    <p className="text-muted-foreground mt-1">
                      123 Galle Road,<br />
                      Colombo 03,<br />
                      Sri Lanka
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <p className="text-muted-foreground mt-1">
                      +94 11 234 5678<br />
                      +94 77 123 4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground mt-1">
                      hello@mlindatravels.lk<br />
                      support@mlindatravels.lk
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-muted rounded-2xl h-[300px] border border-border flex items-center justify-center overflow-hidden relative">
               {/* Visual map placeholder, in a real app this would be a Google Map or Mapbox */}
               <div className="absolute inset-0 bg-[#e5e3df] opacity-50" />
               <div className="text-center relative z-10">
                 <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                 <span className="text-muted-foreground font-medium">Interactive Map Placeholder</span>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-border shadow-sm">
            <h2 className="font-heading text-2xl font-semibold mb-6">Send us a Message</h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
                <select
                  id="subject"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none"
                >
                  <option value="">Select a topic...</option>
                  <option value="booking">Booking Inquiry</option>
                  <option value="support">Customer Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-y"
                  placeholder="How can we help you?"
                />
              </div>

              <Button type="button" className="w-full h-12 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
