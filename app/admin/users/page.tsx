import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Users — Admin' }

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: usersRaw } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const users = usersRaw as any[] | null

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground text-sm">{users?.length ?? 0} registered accounts</p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Users table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Phone</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Role</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Joined</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium">{user.full_name ?? 'No name'}</p>
                    <p className="text-xs text-muted-foreground font-mono">{user.id.slice(0, 12)}…</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{user.phone ?? '—'}</td>
                  <td className="px-5 py-4">
                    <Badge className={`border-0 text-xs capitalize ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">
                    {format(new Date(user.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-5 py-4">
                    <Button size="sm" variant="outline" className="rounded-lg h-8 text-xs">
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
