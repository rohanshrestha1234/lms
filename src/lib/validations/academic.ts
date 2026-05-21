import * as z from 'zod'

export const classSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(50),
  academicYearId: z.string().uuid('Invalid academic year ID'),
})

export const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required').max(10),
  classId: z.string().uuid('Invalid class ID'),
})

export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required').max(100),
  code: z.string().max(20).optional(),
  classId: z.string().uuid('Invalid class ID'),
  teacherId: z.string().uuid('Invalid teacher ID').optional().nullable(),
})

export type ClassFormValues = z.infer<typeof classSchema>
export type SectionFormValues = z.infer<typeof sectionSchema>
export type SubjectFormValues = z.infer<typeof subjectSchema>
