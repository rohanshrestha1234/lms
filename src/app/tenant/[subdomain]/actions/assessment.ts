'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { homeworkSchema, HomeworkFormValues, examSchema, ExamFormValues } from '@/lib/validations/assessment'

export async function getHomeworks(schoolId: string) {
  try {
    return await db.homework.findMany({
      where: { subject: { class: { schoolId } } },
      include: {
        subject: { include: { class: true } },
        teacher: { include: { user: true } },
        _count: { select: { submissions: true } }
      },
      orderBy: { dueDate: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get homeworks', error)
    return []
  }
}

export async function createHomework(schoolId: string, data: HomeworkFormValues) {
  try {
    const validated = homeworkSchema.parse(data)
    
    const newHomework = await db.homework.create({
      data: {
        title: validated.title,
        description: validated.description,
        dueDate: new Date(validated.dueDate),
        subjectId: validated.subjectId,
        teacherId: validated.teacherId,
        attachments: [], // To be implemented with Supabase Storage
      }
    })
    
    revalidatePath('/tenant/[subdomain]/dashboard/homework', 'page')
    return { success: true, data: newHomework }
  } catch (error) {
    console.error('Failed to create homework', error)
    return { success: false, error: 'Failed to create homework' }
  }
}

export async function getExams(schoolId: string) {
  try {
    return await db.exam.findMany({
      where: { subject: { class: { schoolId } } },
      include: {
        subject: { include: { class: true } },
        _count: { select: { results: true } }
      },
      orderBy: { date: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get exams', error)
    return []
  }
}

export async function createExam(schoolId: string, data: ExamFormValues) {
  try {
    const validated = examSchema.parse(data)
    
    const newExam = await db.exam.create({
      data: {
        name: validated.name,
        date: new Date(validated.date),
        maxMarks: validated.maxMarks,
        passMarks: validated.passMarks,
        subjectId: validated.subjectId,
      }
    })
    
    revalidatePath('/tenant/[subdomain]/dashboard/exams', 'page')
    return { success: true, data: newExam }
  } catch (error) {
    console.error('Failed to create exam', error)
    return { success: false, error: 'Failed to create exam' }
  }
}

export async function getSubjectsBySchool(schoolId: string) {
  try {
    return await db.subject.findMany({
      where: { class: { schoolId } },
      include: { class: true },
      orderBy: { class: { name: 'asc' } }
    })
  } catch (error) {
    console.error('Failed to get subjects', error)
    return []
  }
}
