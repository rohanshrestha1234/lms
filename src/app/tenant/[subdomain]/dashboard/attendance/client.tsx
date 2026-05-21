'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSections } from '@/app/tenant/[subdomain]/actions/user'
import { getAttendanceForSection } from '@/app/tenant/[subdomain]/actions/attendance'
import { AttendanceGrid } from '@/components/attendance/attendance-grid'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  Layers, 
  Sparkles,
  PieChart
} from 'lucide-react'

export function AttendancePageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [sections, setSections] = useState<any[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const schoolId = 'mock-school-id'
  const [defaultDateStr] = useState(() => new Date().toISOString().split('T')[0])
  const selectedSection = searchParams.get('section') || ''
  const rawDateStr = searchParams.get('date') || defaultDateStr
  const selectedDateStr = rawDateStr.includes('T') ? rawDateStr.split('T')[0] : rawDateStr

  const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return new Date()
    if (dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0]
    }
    const parts = dateStr.split('-')
    if (parts.length !== 3) return new Date(dateStr)
    const [year, month, day] = parts.map(Number)
    return new Date(year, month - 1, day)
  }

  useEffect(() => {
    getSections(schoolId).then(setSections).catch(() => setSections([]))
  }, [])

  useEffect(() => {
    if (selectedSection) {
      setIsLoading(true)
      getAttendanceForSection(selectedSection, selectedDateStr)
        .then((data) => {
          setAttendanceRecords(data)
          setIsLoading(false)
        })
        .catch(() => {
          setAttendanceRecords([])
          setIsLoading(false)
        })
    }
  }, [selectedSection, selectedDateStr])

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`?${params.toString()}`)
  }

  // Calculate live stats
  const totalStudents = attendanceRecords.length
  const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT').length
  const absentCount = attendanceRecords.filter(r => r.status === 'ABSENT').length
  const lateCount = attendanceRecords.filter(r => r.status === 'LATE').length
  const unmarkedCount = attendanceRecords.filter(r => !r.status).length
  const attendanceRate = totalStudents > 0 
    ? Math.round(((presentCount + lateCount) / totalStudents) * 100) 
    : 0

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Student Attendance</h1>
        <p className="text-muted-foreground mt-1">Audit daily classroom presence, log check-in delays, and track section stats.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Controls Deck */}
        <Card className="lg:col-span-1 border-border/50 shadow-md premium-card bg-card/40 backdrop-blur-md overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
          <CardHeader>
            <CardTitle className="text-lg font-bold">Select Section &amp; Date</CardTitle>
            <CardDescription>Filter class section details to begin check-in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary/70" /> Section
              </label>
              <select
                className="flex h-11 w-full items-center justify-between rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-sm ring-offset-background transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                value={selectedSection}
                onChange={(e) => updateSearchParam('section', e.target.value)}
              >
                <option value="" disabled>
                  {sections.length === 0 ? 'No sections available' : 'Select class section...'}
                </option>
                {sections.map(s => (
                  <option key={s.id} value={s.id}>{s.class.name} - {s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary/70" /> Calendar Date
              </label>
              <input
                type="date"
                className="flex h-11 w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                value={selectedDateStr || ''}
                onChange={(e) => updateSearchParam('date', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Live Attendance Statistics Panel */}
        <Card className="lg:col-span-2 border-border/50 shadow-md premium-card bg-card/40 backdrop-blur-md overflow-hidden flex flex-col justify-between">
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <PieChart className="h-5 w-5 text-indigo-500 animate-pulse" /> Section Attendance Metrics
            </CardTitle>
            <CardDescription>Live breakdown for selected records.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center py-4">
            {!selectedSection ? (
              <div className="text-sm text-muted-foreground italic text-center py-8">
                Please select a section to preview analytical metrics.
              </div>
            ) : isLoading ? (
              <div className="text-sm text-muted-foreground italic text-center py-8">
                Loading live statistics...
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Rate Card */}
                <div className="rounded-xl border border-border/30 bg-muted/10 p-3.5 text-center flex flex-col justify-center items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Presence Rate</span>
                  <div className="text-3xl font-black mt-1 text-primary">{attendanceRate}%</div>
                  <span className="text-[9px] text-muted-foreground mt-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" /> Target 90%+
                  </span>
                </div>

                {/* Present Card */}
                <div className="rounded-xl border border-border/30 bg-muted/10 p-3.5 text-center flex flex-col justify-center items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Present</span>
                  <div className="text-3xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{presentCount}</div>
                  <span className="text-[9px] text-muted-foreground mt-1 flex items-center gap-0.5">
                    <CheckCircle className="h-3 w-3 text-emerald-500" /> Students active
                  </span>
                </div>

                {/* Late Card */}
                <div className="rounded-xl border border-border/30 bg-muted/10 p-3.5 text-center flex flex-col justify-center items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Late Arrival</span>
                  <div className="text-3xl font-black mt-1 text-yellow-500">{lateCount}</div>
                  <span className="text-[9px] text-muted-foreground mt-1 flex items-center gap-0.5">
                    <Clock className="h-3 w-3 text-yellow-500" /> Checked-in late
                  </span>
                </div>

                {/* Absent Card */}
                <div className="rounded-xl border border-border/30 bg-muted/10 p-3.5 text-center flex flex-col justify-center items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Absent</span>
                  <div className="text-3xl font-black mt-1 text-rose-500">{absentCount}</div>
                  <span className="text-[9px] text-muted-foreground mt-1 flex items-center gap-0.5">
                    <XCircle className="h-3 w-3 text-rose-500" /> Leaves / Truancy
                  </span>
                </div>
              </div>
            )}
          </CardContent>
          <div className="px-6 py-3 bg-muted/10 border-t border-border/20 text-xs text-muted-foreground flex justify-between font-medium">
            <span>Total Enrolled: {totalStudents} students</span>
            {unmarkedCount > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" /> {unmarkedCount} pending check-ins
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Complete check-in logged
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* Main Grid View */}
      {selectedSection ? (
        <Card className="border-border/50 shadow-md premium-card bg-card/40 backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-xl font-extrabold">Mark Student Roster</CardTitle>
                <CardDescription>
                  Audit student presence list for class Section.
                </CardDescription>
              </div>
              <Badge variant="outline" className="self-start sm:self-auto font-extrabold bg-indigo-50/5 text-indigo-600 dark:text-indigo-400 border-indigo-200/30">
                {format(parseLocalDate(selectedDateStr), 'EEEE, MMMM d, yyyy')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <AttendanceGrid
              key={`${selectedSection}-${selectedDateStr}`}
              records={attendanceRecords}
              setRecords={setAttendanceRecords}
              sectionId={selectedSection}
              dateStr={selectedDateStr}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col h-56 items-center justify-center rounded-2xl border border-dashed border-border bg-card/25 backdrop-blur-xs text-muted-foreground text-center p-6">
          <Users className="h-10 w-10 mb-3 opacity-20 text-primary" />
          <p className="font-semibold text-sm">Roster check-in is pending.</p>
          <p className="text-xs mt-1 text-muted-foreground/80 max-w-sm">Please pick a class section and date from the controls above to populate student details.</p>
        </div>
      )}
    </div>
  )
}
