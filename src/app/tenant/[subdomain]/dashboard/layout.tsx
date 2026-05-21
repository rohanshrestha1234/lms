import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default async function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const supabase = await createClient()
  
  // TEMPORARILY DISABLED FOR LOCAL VIEWING
  // const { data: { user }, error } = await supabase.auth.getUser()

  // if (error || !user) {
  //   redirect('/login')
  // }

  // TODO: Fetch user role from database using Prisma once auth hookup is complete
  // For now, we default to 'SCHOOL_ADMIN' for UI testing
  const role = 'SCHOOL_ADMIN' // Replace with actual DB fetch

  return (
    <DashboardLayout role={role as any}>
      {children}
    </DashboardLayout>
  )
}
