import { getClasses, getAcademicYears } from '@/app/tenant/[subdomain]/actions/academic'
import { ClassFormDialog } from '@/components/academics/class-form-dialog'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Grid, 
  Sigma, 
  Atom, 
  Languages, 
  GraduationCap, 
  School, 
  Layers,
  ChevronRight
} from 'lucide-react'

type Params = Promise<{ subdomain: string }>

export default async function AcademicsPage({ params }: { params: Params }) {
  const { subdomain } = await params
  const schoolId = 'mock-school-id'

  const [classes, academicYears] = await Promise.all([
    getClasses(schoolId),
    getAcademicYears(schoolId),
  ])

  // Compute stats dynamically from the queries
  const totalClasses = classes.length
  const totalSections = classes.reduce((acc, cls) => acc + cls.sections.length, 0)
  const totalSubjects = classes.reduce((acc, cls) => acc + cls.subjects.length, 0)
  const activeAcademicYear = academicYears.find(y => y.isActive)?.name || '2081-2082'

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Academics Structure</h1>
          <p className="text-muted-foreground mt-1">Manage, audit, and organize the class divisions, section streams, and course subjects.</p>
        </div>
        <div className="shrink-0">
          <ClassFormDialog schoolId={schoolId} academicYears={academicYears} />
        </div>
      </div>

      {/* Top Academic Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-blue-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Academic Year</CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-1.5">
              <School className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">B.S. {activeAcademicYear}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Current Active Session</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-purple-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Classes</CardTitle>
            <div className="rounded-lg bg-purple-500/10 p-1.5">
              <Layers className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">{totalClasses}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Active Class Grades</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-emerald-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Section Streams</CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-1.5">
              <Grid className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">{totalSections}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Active Stream Sections</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-amber-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Configured Courses</CardTitle>
            <div className="rounded-lg bg-amber-500/10 p-1.5">
              <BookOpen className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">{totalSubjects}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Academic Subject Modules</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid of Class Decks */}
      <div>
        <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" /> Active Class Syllabus &amp; Layout
        </h2>

        {classes.length === 0 ? (
          <Card className="border border-dashed h-48 flex flex-col items-center justify-center text-muted-foreground">
            <School className="h-10 w-10 opacity-20 mb-3" />
            <p className="font-semibold text-sm">No Class structures defined yet.</p>
            <p className="text-xs mt-1 text-muted-foreground/80">Click the button above to register your first class grade.</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Card key={cls.id} className="premium-card overflow-hidden border-border/50 shadow-md bg-card/40 backdrop-blur-md flex flex-col justify-between">
                <div>
                  {/* Top Gradient Accent strip */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-primary via-purple-500 to-indigo-500" />
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground/80 uppercase">
                          Academic Session B.S. {cls.academicYear.name}
                        </span>
                        <CardTitle className="text-2xl font-black tracking-tight mt-1 nepal-gradient-text">
                          {cls.name}
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="neon-badge bg-primary/5 text-primary border-primary/20 text-[10px] py-0.5 px-2 font-black uppercase">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Sections Block */}
                    <div className="space-y-2.5">
                      <h4 className="text-[11px] font-bold text-muted-foreground/75 uppercase tracking-widest flex items-center gap-1.5">
                        <Grid className="h-3.5 w-3.5 text-primary/70 animate-pulse" /> Section divisions
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {cls.sections.length === 0 ? (
                          <span className="text-xs text-muted-foreground italic">No sections created</span>
                        ) : (
                          cls.sections.map((sec: any) => (
                            <Badge key={sec.id} variant="secondary" className="bg-accent/40 text-foreground hover:bg-accent border border-border/40 font-semibold px-2.5 py-0.5 rounded-lg text-xs">
                              {sec.name}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Subjects Block */}
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-bold text-muted-foreground/75 uppercase tracking-widest flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-primary/70" /> Subject Syllabus &amp; Instructors
                      </h4>
                      <div className="grid gap-2">
                        {cls.subjects.length === 0 ? (
                          <span className="text-xs text-muted-foreground italic">No subjects configured</span>
                        ) : (
                          cls.subjects.map((sub: any) => {
                            // Map custom subject icons
                            let SubjectIcon = BookOpen
                            const nameLower = sub.name.toLowerCase()
                            if (nameLower.includes('math')) SubjectIcon = Sigma
                            else if (nameLower.includes('sci')) SubjectIcon = Atom
                            else if (nameLower.includes('eng') || nameLower.includes('lang')) SubjectIcon = Languages
                            
                            return (
                              <div key={sub.id} className="flex items-center justify-between p-2.5 rounded-xl border border-border/20 bg-muted/10 hover:bg-muted/20 transition-all duration-300 group">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                                    <SubjectIcon className="h-4 w-4" />
                                  </div>
                                  <span className="text-sm font-semibold tracking-tight text-foreground/90">{sub.name}</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground bg-background/80 dark:bg-background/40 px-2 py-0.5 rounded-md border border-border/40 flex items-center gap-1.5 font-bold shadow-xs">
                                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  {sub.teacher?.user.name || 'Unassigned'}
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
                
                {/* Visual card bottom action */}
                <div className="px-6 py-3 bg-muted/10 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground hover:bg-muted/20 hover:text-foreground transition-colors cursor-pointer group">
                  <span className="font-semibold">Manage Structure Details</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
