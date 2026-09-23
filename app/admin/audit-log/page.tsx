import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { Shield } from 'lucide-react'

export const metadata: Metadata = { title: 'Audit Log — Admin' }

export default async function AdminAuditLogPage() {
  const supabase = await createClient()
  const { data: logs } = await (supabase
    .from('admin_audit_log')
    .select('*, profiles (full_name)')
    .order('created_at', { ascending: false })
    .limit(100) as unknown as Promise<{ data: any[] | null }>)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground text-sm">Security trail of all admin actions</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {logs?.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            No audit log entries yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Audit log table">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Admin</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Action</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Target</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs?.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20">
                    <td className="px-5 py-3 font-medium text-sm">
                      {(log as any).profiles?.full_name ?? 'Admin'}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-1 rounded-lg bg-primary/8 text-primary text-xs font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">
                      {log.target_table && (
                        <span className="font-medium">{log.target_table}</span>
                      )}
                      {log.target_id && (
                        <span className="ml-1 font-mono text-muted-foreground/60">
                          {log.target_id.slice(0, 8)}…
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">
                      {format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
