'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY'

export async function getAttendanceForSection(sectionId: string, dateStr: string) {
  try {
    const date = new Date(dateStr)
    
    // Get all students in section
    const students = await db.student.findMany({
      where: { sectionId },
      include: { user: true },
      orderBy: { rollNumber: 'asc' }
    })
    
    // Get existing attendance for this date
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const attendanceRecords = await db.attendance.findMany({
      where: {
        student: { sectionId },
        date: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    })
    
    // Merge
    return students.map(student => {
      const record = attendanceRecords.find(a => a.studentId === student.id)
      return {
        studentId: student.id,
        name: student.user.name,
        rollNumber: student.rollNumber,
        admissionNumber: student.admissionNumber,
        status: record ? record.status : null,
      }
    })
    
  } catch (error) {
    console.error('Failed to get attendance', error)
    return []
  }
}

export async function saveBulkAttendance(
  records: { studentId: string; status: AttendanceStatus | null; date: string }[]
) {
  if (!records.length) return { success: true }
  
  try {
    const date = new Date(records[0].date)
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)
    
    const studentIds = records.map(r => r.studentId)
    
    await db.$transaction(async (tx) => {
      // 1. Delete existing records for these students on this date to avoid duplicates
      await tx.attendance.deleteMany({
        where: {
          studentId: { in: studentIds },
          date: { gte: startOfDay, lt: endOfDay },
          subjectId: null, // daily attendance
        }
      })
      
      // 2. Insert new records
      const validRecords = records.filter(r => r.status !== null)
      if (validRecords.length > 0) {
        await tx.attendance.createMany({
          data: validRecords.map(r => ({
            studentId: r.studentId,
            status: r.status as AttendanceStatus,
            date: startOfDay,
          }))
        })
      }
    })
    
    revalidatePath('/tenant/[subdomain]/dashboard/attendance', 'page')
    return { success: true }
  } catch (error) {
    console.error('Failed to save attendance', error)
    return { success: false, error: 'Failed to save attendance' }
  }
}
