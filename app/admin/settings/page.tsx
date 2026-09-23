import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Settings' }

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground text-sm">Configure site content and payment settings</p>
      </div>

      {/* SMTP / Email */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-heading font-semibold text-lg">Email Settings</h2>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
          <p className="font-medium text-primary mb-1">Supabase Built-in SMTP</p>
          <p className="text-muted-foreground">
            Email delivery is handled by Supabase. Configure your SMTP settings at:{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              Supabase Dashboard → Authentication → Email Settings
            </code>
          </p>
          <ul className="mt-3 text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Set your From Name and From Email</li>
            <li>Configure SMTP host, port, and credentials</li>
            <li>Customize email templates under Email Templates</li>
          </ul>
        </div>
      </div>

      {/* Site Info */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-heading font-semibold text-lg">Site Information</h2>
        <div className="grid gap-4">
          {[
            { label: 'Site Name', value: 'Mlinda Travels' },
            { label: 'Contact Email', value: 'hello@mlindatravels.lk' },
            { label: 'Contact Phone', value: '+94 11 234 5678' },
            { label: 'Country', value: 'Sri Lanka' },
          ].map((field) => (
            <div key={field.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <p className="text-sm font-medium">{field.label}</p>
              <p className="text-sm text-muted-foreground">{field.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stripe */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-heading font-semibold text-lg">Payment Settings</h2>
        <div className="bg-muted/30 rounded-xl p-4 text-sm">
          <p className="font-medium mb-1">Stripe Integration</p>
          <p className="text-muted-foreground">
            Payment processing is handled by Stripe. Configure keys in{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">.env.local</code>.
            Currently in <strong>test mode</strong>.
          </p>
          <div className="mt-3 space-y-1 text-xs font-mono text-muted-foreground">
            <p>STRIPE_SECRET_KEY: sk_test_***</p>
            <p>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_***</p>
            <p>STRIPE_WEBHOOK_SECRET: whsec_***</p>
          </div>
        </div>
      </div>
    </div>
  )
}

