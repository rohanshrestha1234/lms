'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveBulkAttendance, AttendanceStatus } from '@/app/tenant/[subdomain]/actions/attendance'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, Save, CheckCircle2, XCircle, Clock, Zap } from 'lucide-react'

type StudentRecord = {
  studentId: string
  name: string
  rollNumber: number | null
  admissionNumber: string
  status: AttendanceStatus | null
}

export function AttendanceGrid({ 
  records, 
  setRecords,
  sectionId, 
  dateStr 
}: { 
  records: StudentRecord[], 
  setRecords: (records: StudentRecord[]) => void,
  sectionId: string, 
  dateStr: string 
}) {
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const markAll = (status: AttendanceStatus) => {
    setRecords(records.map(r => ({ ...r, status })))
  }

  const markStudent = (studentId: string, status: AttendanceStatus) => {
    setRecords(records.map(r => r.studentId === studentId ? { ...r, status } : r))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const dataToSave = records.map(r => ({
      studentId: r.studentId,
      status: r.status,
      date: dateStr
    }))
    
    const res = await saveBulkAttendance(dataToSave)
    setIsSaving(false)
    if (res.success) {
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Mark & Action Controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20 p-4 rounded-xl border border-border/30 backdrop-blur-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500 animate-pulse" /> Bulk Actions:
          </span>
          <div className="inline-flex rounded-lg border border-border/50 bg-background/50 p-1 shadow-inner gap-1">
            <button 
              type="button"
              className="text-xs font-bold px-3 py-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              onClick={() => markAll('PRESENT')}
            >
              Mark All Present
            </button>
            <div className="w-px bg-border/50 self-stretch my-1" />
            <button 
              type="button"
              className="text-xs font-bold px-3 py-1 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
              onClick={() => markAll('ABSENT')}
            >
              Mark All Absent
            </button>
          </div>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="shadow-md bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-700 text-white font-bold rounded-xl px-5 h-10 transition-all duration-300"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Commit Attendance
        </Button>
      </div>

      {/* Roster Table */}
      <div className="rounded-xl border border-border/30 overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-20 font-bold text-xs uppercase tracking-wider text-muted-foreground">Roll No</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Student Name</TableHead>
              <TableHead className="text-center w-[320px] font-bold text-xs uppercase tracking-wider text-muted-foreground">Presence Check</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/20">
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground text-sm italic">
                  No student registrations found in this section database.
                </TableCell>
              </TableRow>
            ) : (
              records.map((r) => (
                <TableRow key={r.studentId} className="hover:bg-muted/5 transition-colors">
                  <TableCell className="font-mono text-sm font-semibold text-muted-foreground/80 pl-6">
                    {r.rollNumber ? String(r.rollNumber).padStart(2, '0') : '--'}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-foreground/90 tracking-tight">{r.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">Adm: {r.admissionNumber}</div>
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-center gap-1.5">
                      {/* Present Button */}
                      <button
                        type="button"
                        onClick={() => markStudent(r.studentId, 'PRESENT')}
                        className={`inline-flex items-center justify-center gap-1.5 h-8.5 px-3.5 rounded-lg text-xs font-bold transition-all duration-300 border ${
                          r.status === 'PRESENT'
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10'
                            : 'border-border/60 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${r.status === 'PRESENT' ? 'animate-pulse' : ''}`} />
                        <span>Present</span>
                      </button>

                      {/* Late Button */}
                      <button
                        type="button"
                        onClick={() => markStudent(r.studentId, 'LATE')}
                        className={`inline-flex items-center justify-center gap-1.5 h-8.5 px-3.5 rounded-lg text-xs font-bold transition-all duration-300 border ${
                          r.status === 'LATE'
                            ? 'bg-yellow-500 text-white border-yellow-500 shadow-md shadow-yellow-500/10'
                            : 'border-border/60 hover:border-yellow-500/40 hover:bg-yellow-500/5 text-muted-foreground hover:text-yellow-500'
                        }`}
                      >
                        <Clock className={`w-3.5 h-3.5 ${r.status === 'LATE' ? 'animate-pulse' : ''}`} />
                        <span>Late</span>
                      </button>

                      {/* Absent Button */}
                      <button
                        type="button"
                        onClick={() => markStudent(r.studentId, 'ABSENT')}
                        className={`inline-flex items-center justify-center gap-1.5 h-8.5 px-3.5 rounded-lg text-xs font-bold transition-all duration-300 border ${
                          r.status === 'ABSENT'
                            ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/10'
                            : 'border-border/60 hover:border-rose-500/40 hover:bg-rose-500/5 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400'
                        }`}
                      >
                        <XCircle className={`w-3.5 h-3.5 ${r.status === 'ABSENT' ? 'animate-pulse' : ''}`} />
                        <span>Absent</span>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
