import { Metadata } from 'next'
import Image from 'next/image'
import { Shield, Target, Heart, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Mlinda Travels',
  description: 'Learn about our mission to provide the ultimate luxury travel experience in Sri Lanka.',
}

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1544985223-99b3fb0ee65d?w=1600"
          alt="Sri Lanka landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center container-base">
          <p className="text-white/80 font-medium tracking-widest uppercase mb-4">Our Story</p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6">
            Redefining Travel in<br />Sri Lanka
          </h1>
        </div>
      </section>

      {/* ── Mission ────────────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-base">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground">
              A Passion for Perfection
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Mlinda Travels was born from a simple desire: to showcase the breathtaking beauty of Sri Lanka without compromising on luxury, reliability, or service. We believe that your journey should be just as extraordinary as the destination itself.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              For over a decade, we have been curating exceptional stays at the island's most prestigious hotels and providing a flawless fleet of vehicles to explore every corner in absolute comfort.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ─────────────────────────────────────────────── */}
      <section className="section-padding bg-primary-light/30">
        <div className="container-base">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything we do is guided by a commitment to excellence and a deep love for our island home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Trust & Safety',
                desc: 'Your security is our top priority. We vet every hotel and rigorously maintain every vehicle.',
              },
              {
                icon: Heart,
                title: 'Authenticity',
                desc: 'We promote genuine Sri Lankan hospitality and curate experiences that reflect the true spirit of the island.',
              },
              {
                icon: Target,
                title: 'Precision',
                desc: 'From instant bookings to seamless handovers, we obsess over the details so you don’t have to.',
              },
              {
                icon: Award,
                title: 'Excellence',
                desc: 'We partner exclusively with premium properties and maintain a fleet of world-class vehicles.',
              },
            ].map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-2xl border border-border shadow-sm text-center card-hover">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team (Placeholder) ─────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-base text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-16">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              { name: 'Sarah Fernando', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
              { name: 'David Perera', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400' },
              { name: 'Amali Silva', role: 'Guest Experience Director', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400' },
            ].map((member) => (
              <div key={member.name} className="flex flex-col items-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-primary/10">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-heading text-lg font-semibold">{member.name}</h3>
                <p className="text-primary text-sm font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
