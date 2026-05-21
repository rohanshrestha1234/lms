import { getNotices } from '@/app/tenant/[subdomain]/actions/communication'
import { NoticeFormDialog } from '@/components/communication/notice-form-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { 
  Bell, 
  Globe, 
  GraduationCap, 
  Home, 
  Laptop, 
  ShieldAlert, 
  CreditCard,
  Pin,
  Clock,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react'

type Params = Promise<{ subdomain: string }>

export default async function NoticesPage({ params }: { params: Params }) {
  const { subdomain } = await params
  const schoolId = 'mock-school-id'

  const notices = await getNotices(schoolId)

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">School Notice Board</h1>
          <p className="text-muted-foreground mt-1">Broadcast newsletters, academic notices, holidays, and targeted faculty announcements.</p>
        </div>
        <div className="shrink-0">
          <NoticeFormDialog schoolId={schoolId} />
        </div>
      </div>

      {/* Notices Masonry Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notices.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-64 border rounded-2xl border-dashed bg-muted/10 text-muted-foreground p-6 text-center">
            <Bell className="h-10 w-10 mb-4 opacity-25 text-primary animate-bounce" />
            <p className="font-semibold text-sm">No notices published yet.</p>
            <p className="text-xs mt-1 text-muted-foreground/80">Click &quot;New Notice&quot; above to compose your first bulletin broadcast.</p>
          </div>
        ) : (
          notices.map((notice) => {
            const hasAudience = notice.targetAudience.length > 0
            
            return (
              <Card 
                key={notice.id} 
                className={`flex flex-col overflow-hidden hover:shadow-md transition-all duration-300 premium-card bg-card/40 backdrop-blur-md border-border/50 ${
                  !notice.isPublished ? 'border-dashed border-muted-foreground/30 opacity-80' : ''
                }`}
              >
                {/* Visual Accent bar at the top */}
                <div className={`h-1.5 w-full ${
                  !notice.isPublished 
                    ? 'bg-muted' 
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500'
                }`} />

                <CardHeader className="bg-muted/15 border-b border-border/20 pb-4 relative">
                  {/* Pin element if published to add classroom feel */}
                  {notice.isPublished && (
                    <Pin className="absolute right-4 top-4 h-4 w-4 text-rose-500/70 rotate-45 transform" />
                  )}
                  
                  <div className="flex justify-between items-start gap-4 pr-6">
                    <CardTitle className="text-lg font-extrabold leading-tight tracking-tight text-foreground/95">
                      {notice.title}
                    </CardTitle>
                    {!notice.isPublished && (
                      <Badge variant="secondary" className="text-[9px] font-black uppercase bg-muted text-muted-foreground rounded-md border border-border/60">
                        Draft
                      </Badge>
                    )}
                  </div>
                  
                  <CardDescription className="text-[10px] mt-2 font-semibold text-muted-foreground/80 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Posted {formatDistanceToNow(new Date(notice.createdAt), { addSuffix: true })}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-5 flex-grow pb-6">
                  <p className="text-sm whitespace-pre-wrap text-foreground/80 line-clamp-5 leading-relaxed font-medium">
                    {notice.content}
                  </p>
                </CardContent>

                <CardFooter className="border-t border-border/20 pt-4 pb-4 text-[10px] text-muted-foreground/90 bg-muted/10 flex justify-between items-center px-6">
                  {/* Target Audience pills with custom iconography */}
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    {!hasAudience ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Globe className="h-3.5 w-3.5" /> All Users
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {notice.targetAudience.map((role: any) => {
                          let RoleIcon = Globe
                          if (role === 'TEACHER') RoleIcon = Laptop
                          else if (role === 'STUDENT') RoleIcon = GraduationCap
                          else if (role === 'PARENT') RoleIcon = Home
                          else if (role === 'SCHOOL_ADMIN') RoleIcon = ShieldCheck
                          else if (role === 'ACCOUNTANT') RoleIcon = CreditCard
                          
                          return (
                            <Badge 
                              key={role} 
                              variant="outline" 
                              className="text-[9px] font-black tracking-widest px-2 py-0.5 border-border/40 bg-background/50 flex items-center gap-1 text-primary/80"
                            >
                              <RoleIcon className="h-3 w-3" /> {role}
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <span className="text-primary hover:underline cursor-pointer font-bold text-xs flex items-center gap-0.5 group">
                    Details
                    <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </CardFooter>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
