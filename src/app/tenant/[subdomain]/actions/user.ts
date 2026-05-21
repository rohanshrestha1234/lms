'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { studentSchema, StudentFormValues, teacherSchema, TeacherFormValues } from '@/lib/validations/user'

export async function getStudents(schoolId: string) {
  try {
    return await db.student.findMany({
      where: { schoolId },
      include: {
        user: true,
        section: {
          include: { class: true }
        }
      },
      orderBy: { user: { name: 'asc' } }
    })
  } catch (error) {
    console.error('Failed to get students', error)
    return []
  }
}

export async function getTeachers(schoolId: string) {
  try {
    return await db.teacher.findMany({
      where: { schoolId },
      include: {
        user: true,
        subjects: true
      },
      orderBy: { user: { name: 'asc' } }
    })
  } catch (error) {
    console.error('Failed to get teachers', error)
    return []
  }
}

export async function getSections(schoolId: string) {
  try {
    return await db.section.findMany({
      where: { class: { schoolId } },
      include: { class: true },
      orderBy: { class: { name: 'asc' } }
    })
  } catch (error) {
    console.error('Failed to get sections', error)
    return []
  }
}

export async function createStudent(schoolId: string, data: StudentFormValues) {
  try {
    const validatedData = studentSchema.parse(data)
    
    // In reality, you'd create a Supabase Auth user first and use its ID
    const mockUserId = crypto.randomUUID()
    
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          id: mockUserId,
          email: validatedData.email,
          name: validatedData.name,
          phone: validatedData.phone,
          role: 'STUDENT',
          schoolId,
        }
      })
      
      const student = await tx.student.create({
        data: {
          userId: user.id,
          schoolId,
          admissionNumber: validatedData.admissionNumber,
          rollNumber: validatedData.rollNumber ? parseInt(validatedData.rollNumber) : null,
          gender: validatedData.gender,
          dob: validatedData.dob ? new Date(validatedData.dob) : null,
          sectionId: validatedData.sectionId || null,
        }
      })
      
      return student
    })
    
    revalidatePath('/tenant/[subdomain]/dashboard/users', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to create student', error)
    return { success: false, error: 'Failed to create student' }
  }
}

export async function createTeacher(schoolId: string, data: TeacherFormValues) {
  try {
    const validatedData = teacherSchema.parse(data)
    
    const mockUserId = crypto.randomUUID()
    
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          id: mockUserId,
          email: validatedData.email,
          name: validatedData.name,
          phone: validatedData.phone,
          role: 'TEACHER',
          schoolId,
        }
      })
      
      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          schoolId,
          employeeId: validatedData.employeeId,
          qualification: validatedData.qualification,
        }
      })
      
      return teacher
    })
    
    revalidatePath('/tenant/[subdomain]/dashboard/users', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to create teacher', error)
    return { success: false, error: 'Failed to create teacher' }
  }
}
