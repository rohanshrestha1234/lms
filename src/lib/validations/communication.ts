import * as z from 'zod'

export const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  isPublished: z.boolean().default(true),
  targetAudience: z.array(z.enum(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT'])).optional(),
})

export type NoticeFormValues = z.infer<typeof noticeSchema>
