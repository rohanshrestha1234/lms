import * as z from 'zod'

export const homeworkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  subjectId: z.string().uuid('Subject is required'),
  teacherId: z.string().uuid('Teacher ID is required'),
})

export const examSchema = z.object({
  name: z.string().min(1, 'Exam name is required').max(100),
  date: z.string().min(1, 'Exam date is required'),
  maxMarks: z.coerce.number().min(1, 'Max marks must be greater than 0'),
  passMarks: z.coerce.number().min(0, 'Pass marks cannot be negative'),
  subjectId: z.string().uuid('Subject is required'),
})

export type HomeworkFormValues = z.infer<typeof homeworkSchema>
export type ExamFormValues = z.infer<typeof examSchema>
