import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/db'
import { Users, GraduationCap, FileText, IndianRupee, BookOpen, Bell, Sparkles, School } from 'lucide-react'

type Params = Promise<{ subdomain: string }>

export default async function DashboardOverview({ params }: { params: Params }) {
  const { subdomain } = await params
  const schoolId = 'mock-school-id'

  const [studentCount, teacherCount, pendingInvoices, noticeCount, recentNotices, schoolDetails] =
    await Promise.all([
      db.student.count({ where: { schoolId } }).catch(() => 0),
      db.teacher.count({ where: { schoolId } }).catch(() => 0),
      db.feeInvoice.count({ where: { student: { schoolId }, status: 'PENDING' } }).catch(() => 0),
      db.notice.count({ where: { schoolId, isPublished: true } }).catch(() => 0),
      db.notice.findMany({
        where: { schoolId, isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 4,
      }).catch(() => []),
      db.school.findUnique({ where: { id: schoolId } }).catch(() => null),
    ])

  const schoolName = schoolDetails?.name || 'Apex International Academy'
  const schoolAddress = schoolDetails?.address || 'Kathmandu, Nepal'

  const modules = [
    { name: 'Academics', href: '/dashboard/academics', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10 hover:bg-blue-500/15 border-blue-500/20' },
    { name: 'Users', href: '/dashboard/users', icon: Users, color: 'text-green-500', bg: 'bg-green-500/10 hover:bg-green-500/15 border-green-500/20' },
    { name: 'Fees', href: '/dashboard/fees', icon: IndianRupee, color: 'text-amber-500', bg: 'bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/20' },
    { name: 'Notices', href: '/dashboard/notices', icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10 hover:bg-purple-500/15 border-purple-500/20' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Premium Nepalese School Banner */}
      <div className="relative overflow-hidden rounded-2xl nepal-gradient-card p-6 md:p-8 text-white shadow-lg premium-glow">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 -mb-20 h-48 w-48 rounded-full bg-purple-500/20 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              School ERP Portal Active
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm">
              {schoolName}
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-xl font-light">
              Welcome back to your comprehensive Learning Management & ERP system. Dedicated to excellence at <span className="font-semibold text-white">{schoolAddress}</span>.
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20 shadow-inner">
            <School className="h-12 w-12 text-white" />
          </div>
        </div>
      </div>

      {/* Stat Cards with Glow and Hover Lifting */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-blue-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Students</CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-1.5">
              <GraduationCap className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">{studentCount}</div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" /> Currently enrolled & active
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-green-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Teaching Staff</CardTitle>
            <div className="rounded-lg bg-green-500/10 p-1.5">
              <Users className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">{teacherCount}</div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" /> Verified faculty members
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-amber-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Pending Dues</CardTitle>
            <div className="rounded-lg bg-amber-500/10 p-1.5">
              <IndianRupee className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">{pendingInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" /> Unpaid fee invoices
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-purple-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Active Notices</CardTitle>
            <div className="rounded-lg bg-purple-500/10 p-1.5">
              <FileText className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">{noticeCount}</div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-500" /> On school notice board
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Notices with Glassmorphism Header */}
        <Card className="lg:col-span-4 border-border/50 shadow-sm premium-card bg-card overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Announcements</CardTitle>
                <p className="text-xs text-muted-foreground">Stay updated with the latest news</p>
              </div>
              <Bell className="h-5 w-5 text-purple-500/70" />
            </div>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-border/40">
            {recentNotices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">No announcements published yet.</p>
            ) : (
              recentNotices.map((notice) => (
                <div key={notice.id} className="p-5 hover:bg-muted/10 transition-colors duration-250 group">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {notice.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full whitespace-nowrap">
                      {new Date(notice.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {notice.content}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Links with Hover Micro-animations */}
        <Card className="lg:col-span-3 border-border/50 shadow-sm premium-card bg-card">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <CardTitle className="text-lg font-bold">Quick Navigation</CardTitle>
            <p className="text-xs text-muted-foreground">Instant access to core modules</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {modules.map((mod) => (
                <a
                  key={mod.name}
                  href={mod.href}
                  className={`flex flex-col items-center justify-center gap-3 p-5 rounded-xl border ${mod.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-md group`}
                >
                  <div className="rounded-full bg-white dark:bg-black/20 p-2.5 shadow-sm group-hover:scale-110 transition-transform">
                    <mod.icon className={`h-6 w-6 ${mod.color}`} />
                  </div>
                  <span className="text-sm font-semibold tracking-tight text-foreground">{mod.name}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

