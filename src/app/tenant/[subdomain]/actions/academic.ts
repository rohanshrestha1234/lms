'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { classSchema, ClassFormValues } from '@/lib/validations/academic'

// Note: In production, schoolId would come securely from the user's session or subdomain context.
export async function getClasses(schoolId: string) {
  try {
    return await db.class.findMany({
      where: { schoolId },
      include: {
        academicYear: true,
        sections: {
          orderBy: { name: 'asc' }
        },
        subjects: {
          include: {
            teacher: {
              include: {
                user: true
              }
            }
          },
          orderBy: { name: 'asc' }
        },
        _count: {
          select: { sections: true, subjects: true }
        }
      },
      orderBy: { name: 'asc' }
    })
  } catch (error) {
    console.error('Failed to get classes', error)
    return []
  }
}

export async function getAcademicYears(schoolId: string) {
  try {
    return await db.academicYear.findMany({
      where: { schoolId },
      orderBy: { startDate: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get academic years', error)
    return []
  }
}

export async function createClass(schoolId: string, data: ClassFormValues) {
  try {
    const validatedData = classSchema.parse(data)
    
    const newClass = await db.class.create({
      data: {
        name: validatedData.name,
        academicYearId: validatedData.academicYearId,
        schoolId,
      },
    })
    
    revalidatePath('/tenant/[subdomain]/dashboard/academics', 'page')
    return { success: true, data: newClass }
  } catch (error) {
    console.error('Failed to create class', error)
    return { success: false, error: 'Failed to create class' }
  }
}
