import * as z from 'zod'

export const studentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  admissionNumber: z.string().min(1, 'Admission number is required'),
  rollNumber: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dob: z.string().optional(),
  sectionId: z.string().uuid('Section is required').optional().nullable(),
})

export const teacherSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  employeeId: z.string().min(1, 'Employee ID is required'),
  qualification: z.string().optional(),
})

export type StudentFormValues = z.infer<typeof studentSchema>
export type TeacherFormValues = z.infer<typeof teacherSchema>
