import { getExams, getSubjectsBySchool } from '@/app/tenant/[subdomain]/actions/assessment'
import { ExamFormDialog } from '@/components/assessments/exam-form-dialog'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { 
  FileText, 
  BookOpen, 
  Calendar, 
  Award, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  ClipboardList,
  Sparkles
} from 'lucide-react'

type Params = Promise<{ subdomain: string }>

export default async function ExamsPage({ params }: { params: Params }) {
  const { subdomain } = await params
  const schoolId = 'mock-school-id'

  const [exams, subjects] = await Promise.all([
    getExams(schoolId),
    getSubjectsBySchool(schoolId),
  ])

  // Calculate dynamic stats
  const totalExams = exams.length
  const subjectsCount = subjects.length
  const completedAssessments = exams.filter(e => e._count.results > 0).length
  const pendingGrading = exams.filter(e => e._count.results === 0).length

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Examinations &amp; Testing</h1>
          <p className="text-muted-foreground mt-1">Schedule and monitor exams, manage syllabus evaluations, and track class grades.</p>
        </div>
        <div className="shrink-0">
          <ExamFormDialog schoolId={schoolId} subjects={subjects} />
        </div>
      </div>

      {/* Stats Summary Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-blue-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Exams</CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-1.5">
              <ClipboardList className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">{totalExams}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Scheduled Test Modules</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-purple-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Subjects Mapped</CardTitle>
            <div className="rounded-lg bg-purple-500/10 p-1.5">
              <BookOpen className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">{subjectsCount}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Affiliated Courses</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-emerald-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Grades Entered</CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">{completedAssessments}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Evaluated Assessments</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-amber-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Pending Evaluation</CardTitle>
            <div className="rounded-lg bg-amber-500/10 p-1.5">
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight text-amber-600 dark:text-amber-500">{pendingGrading}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Awaiting Grade Input</p>
          </CardContent>
        </Card>
      </div>

      {/* Exams Cards Deck Grid */}
      <div>
        <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Active Examination Directory
        </h2>

        {exams.length === 0 ? (
          <Card className="border border-dashed h-48 flex flex-col items-center justify-center text-muted-foreground">
            <ClipboardList className="h-10 w-10 opacity-20 mb-3" />
            <p className="font-semibold text-sm">No exam sessions scheduled yet.</p>
            <p className="text-xs mt-1 text-muted-foreground/80">Click the button above to create a new exam structure.</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => {
              const isEvaluated = exam._count.results > 0
              return (
                <Card 
                  key={exam.id} 
                  className={`premium-card overflow-hidden border-border/50 shadow-md bg-card/40 backdrop-blur-md flex flex-col justify-between relative`}
                >
                  <div>
                    {/* Glowing Left Indicator Strip */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      isEvaluated 
                        ? 'bg-gradient-to-b from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-600' 
                        : 'bg-gradient-to-b from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600'
                    }`} />

                    <CardHeader className="pb-3 pl-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Assessment Test
                          </span>
                          <CardTitle className="text-xl font-black tracking-tight mt-1 text-foreground/95">
                            {exam.name}
                          </CardTitle>
                        </div>
                        <Badge 
                          variant={isEvaluated ? 'default' : 'secondary'} 
                          className={`text-[9px] font-extrabold uppercase py-0.5 px-2 rounded-md ${
                            isEvaluated 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {isEvaluated ? 'Complete' : 'Scheduled'}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pl-6">
                      {/* Course details rows */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5 text-sm text-foreground/80 font-medium">
                          <BookOpen className="h-4 w-4 text-primary/70" />
                          <span>Course: <span className="font-semibold text-foreground">{exam.subject.name}</span></span>
                        </div>

                        <div className="flex items-center gap-2.5 text-sm text-foreground/80 font-medium">
                          <Layers className="h-4 w-4 text-primary/70" />
                          <span>Class Grade: <Badge variant="outline" className="font-bold py-0.5 px-2 text-xs border-border/60 bg-muted/30">{exam.subject.class.name}</Badge></span>
                        </div>

                        <div className="flex items-center gap-2.5 text-sm text-foreground/80 font-medium">
                          <Calendar className="h-4 w-4 text-primary/70" />
                          <span>Exam Date: <span className="font-semibold text-foreground">{format(new Date(exam.date), 'MMMM d, yyyy')}</span></span>
                        </div>

                        <div className="flex items-center gap-2.5 text-sm text-foreground/80 font-medium">
                          <Award className="h-4 w-4 text-primary/70" />
                          <span>Score Scale: <span className="font-semibold text-foreground">{exam.maxMarks} Marks</span> <span className="text-xs text-muted-foreground">(Pass: {exam.passMarks})</span></span>
                        </div>
                      </div>

                      {/* Grading Visual Progress Bar */}
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between items-center text-xs font-bold text-muted-foreground/80">
                          <span className="uppercase tracking-wider">Evaluation Status</span>
                          <span className={isEvaluated ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                            {exam._count.results} students logged
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden relative border border-border/10 shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isEvaluated 
                                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 glow-pulse' 
                                : 'bg-muted'
                            }`}
                            style={{ width: isEvaluated ? '100%' : '0%' }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  {/* Visual Bottom action panel */}
                  <div className="px-6 py-3 bg-muted/10 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground hover:bg-muted/20 hover:text-foreground transition-colors cursor-pointer group pl-6">
                    <span className="font-semibold flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" /> View Grade Book
                    </span>
                    <Badge variant="outline" className="text-[10px] font-bold bg-background shadow-xs border-border/40">
                      View
                    </Badge>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
