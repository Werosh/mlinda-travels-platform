import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Mlinda Travels',
  description: 'How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-20 bg-background min-h-screen">
      <div className="container-base max-w-3xl">
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-border shadow-sm">
          <h1 className="font-heading text-3xl md:text-4xl text-foreground font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm mb-10 pb-6 border-b border-border">
            Last updated: September 23, 2026
          </p>

          <div className="space-y-8 prose prose-slate max-w-none text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, and payment information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
              <p>
                We use the information we collect about you to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Provide, maintain, and improve our services.</li>
                <li>Process transactions and send related information, including confirmations and receipts.</li>
                <li>Send you technical notices, updates, security alerts, and support and administrative messages.</li>
                <li>Respond to your comments, questions, and requests.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Sharing of Information</h2>
              <p>
                We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf (e.g., hotels and car rental partners to fulfill your booking).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Security</h2>
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@mlindatravels.lk.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
