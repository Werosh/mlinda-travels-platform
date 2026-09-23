import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Mlinda Travels',
  description: 'Terms and conditions for using Mlinda Travels services.',
}

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20 bg-background min-h-screen">
      <div className="container-base max-w-3xl">
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-border shadow-sm">
          <h1 className="font-heading text-3xl md:text-4xl text-foreground font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-sm mb-10 pb-6 border-b border-border">
            Last updated: September 23, 2026
          </p>

          <div className="space-y-8 prose prose-slate max-w-none text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Mlinda Travels website and services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Booking Policies</h2>
              <p>
                All hotel and vehicle bookings are subject to availability. Upon completion of payment, you will receive an instant confirmation. Mlinda Travels reserves the right to cancel any booking in the event of suspected fraud or pricing errors.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Cancellations & Refunds</h2>
              <p>
                Cancellation policies vary by hotel and vehicle provider. Please review the specific cancellation policy displayed during the checkout process. Standard refunds are processed within 5-10 business days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. User Responsibilities</h2>
              <p>
                You agree to provide accurate and complete information during the registration and booking processes. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Contact</h2>
              <p>
                If you have any questions regarding these Terms of Service, please contact us at legal@mlindatravels.lk.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
