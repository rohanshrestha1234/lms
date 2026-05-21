import { getStudents, getTeachers, getSections } from '@/app/tenant/[subdomain]/actions/user'
import { StudentFormDialog } from '@/components/users/student-form-dialog'
import { TeacherFormDialog } from '@/components/users/teacher-form-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  Laptop, 
  ShieldCheck, 
  Activity, 
  Phone, 
  Award,
  ChevronRight,
  Sparkles,
  PieChart
} from 'lucide-react'

type Params = Promise<{ subdomain: string }>

export default async function UsersPage({ params }: { params: Params }) {
  const { subdomain } = await params
  const schoolId = 'mock-school-id'

  const [students, teachers, sections] = await Promise.all([
    getStudents(schoolId),
    getTeachers(schoolId),
    getSections(schoolId),
  ])

  // Dynamic Roster Statistics
  const totalStudents = students.length
  const totalTeachers = teachers.length
  const ratio = totalTeachers > 0 ? (totalStudents / totalTeachers).toFixed(1) : totalStudents
  const totalActive = totalStudents + totalTeachers

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">User Roster Directory</h1>
          <p className="text-muted-foreground mt-1">Audit school faculty, register student profile dossiers, and map staff positions.</p>
        </div>
      </div>

      {/* Roster Overview Stats Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-blue-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Active Roster</CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-1.5">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">{totalActive}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Registered Accounts</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-purple-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Enrolled Students</CardTitle>
            <div className="rounded-lg bg-purple-500/10 p-1.5">
              <GraduationCap className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight text-primary">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Active Class Roll</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-emerald-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Faculty Staff</CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-1.5">
              <Laptop className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">{totalTeachers}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Appointed Teachers</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-amber-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Student-Teacher Ratio</CardTitle>
            <div className="rounded-lg bg-amber-500/10 p-1.5">
              <Activity className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400">{ratio} : 1</div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" /> Balanced instruction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Segment */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[420px] bg-muted/40 p-1 rounded-xl border border-border/20 backdrop-blur-xs shadow-inner">
          <TabsTrigger value="students" className="rounded-lg font-bold text-xs py-2">Students</TabsTrigger>
          <TabsTrigger value="teachers" className="rounded-lg font-bold text-xs py-2">Teachers</TabsTrigger>
          <TabsTrigger value="parents" className="rounded-lg font-bold text-xs py-2">Parents</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-6 animate-in fade-in-30 duration-300">
          <Card className="border-border/50 shadow-md bg-card/40 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/10 flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl font-extrabold">Student Roster</CardTitle>
                <CardDescription>Directory dossiers for all active students.</CardDescription>
              </div>
              <div className="shrink-0">
                <StudentFormDialog schoolId={schoolId} sections={sections} />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-xl border border-border/30 overflow-hidden shadow-xs">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground pl-6">Adm No</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Student Name</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Class Section</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Gender</TableHead>
                      <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground pr-6">Profile</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border/20">
                    {students.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-sm italic">No students found.</TableCell>
                      </TableRow>
                    ) : (
                      students.map((student) => {
                        const firstChar = student.user.name.charAt(0).toUpperCase()
                        return (
                          <TableRow key={student.id} className="hover:bg-muted/5 transition-colors">
                            <TableCell className="font-mono text-sm font-bold text-muted-foreground/80 pl-6">
                              {student.admissionNumber}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {/* Visual avatar block */}
                                <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-extrabold text-primary text-sm shadow-inner relative overflow-hidden">
                                  {firstChar}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-foreground/90 tracking-tight">{student.user.name}</span>
                                  <span className="text-[10px] text-muted-foreground font-semibold">{student.user.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {student.section ? (
                                <Badge variant="outline" className="font-bold py-0.5 px-2 text-[10px] bg-indigo-50/5 text-indigo-600 dark:text-indigo-400 border-indigo-200/30">
                                  {student.section.class.name} - {student.section.name}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="font-bold py-0.5 px-2 text-[10px] border-amber-300/30 text-amber-600 bg-amber-500/5">
                                  Unassigned
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="font-semibold text-xs text-foreground/80 uppercase tracking-wide">{student.gender || '-'}</TableCell>
                            <TableCell className="text-right pr-6">
                              <button type="button" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 ml-auto group">
                                Dossier <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="mt-6 animate-in fade-in-30 duration-300">
          <Card className="border-border/50 shadow-md bg-card/40 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/10 flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl font-extrabold">Faculty Directory</CardTitle>
                <CardDescription>Directory profiles for academic instructors.</CardDescription>
              </div>
              <div className="shrink-0">
                <TeacherFormDialog schoolId={schoolId} />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-xl border border-border/30 overflow-hidden shadow-xs">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground pl-6">Emp ID</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Instructor</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Phone Contact</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Credentials</TableHead>
                      <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground pr-6">Profile</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border/20">
                    {teachers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-sm italic">No teachers found.</TableCell>
                      </TableRow>
                    ) : (
                      teachers.map((teacher) => {
                        const firstChar = teacher.user.name.charAt(0).toUpperCase()
                        return (
                          <TableRow key={teacher.id} className="hover:bg-muted/5 transition-colors">
                            <TableCell className="font-mono text-sm font-bold text-muted-foreground/80 pl-6">
                              {teacher.employeeId}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {/* Visual avatar block */}
                                <div className="h-9 w-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-extrabold text-emerald-600 dark:text-emerald-400 text-sm shadow-inner relative overflow-hidden">
                                  {firstChar}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-foreground/90 tracking-tight">{teacher.user.name}</span>
                                  <span className="text-[10px] text-muted-foreground font-semibold">{teacher.user.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-xs text-foreground/80 font-semibold">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{teacher.user.phone || '--'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-xs text-foreground/80 font-bold">
                                <Award className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{teacher.qualification || '--'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <button type="button" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 ml-auto group">
                                Profile <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parents Tab */}
        <TabsContent value="parents" className="mt-6 animate-in fade-in-30 duration-300">
          <Card className="border-border/50 shadow-md bg-card/40 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/10">
              <CardTitle className="text-xl font-extrabold">Parents Directory</CardTitle>
              <CardDescription>Parents are automatically created when linked to student profiles.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-primary flex items-center justify-center mb-3">
                <Users className="h-6 w-6 animate-pulse" />
              </div>
              <p className="font-bold text-sm text-foreground/90">Parent Profiles Mapped Automatically</p>
              <p className="text-xs mt-1 text-muted-foreground/80 max-w-sm">Parents access portal will be fully active in Phase 7 implementation.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
