'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { noticeSchema, NoticeFormValues } from '@/lib/validations/communication'

export async function getNotices(schoolId: string) {
  try {
    return await db.notice.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get notices', error)
    return []
  }
}

export async function createNotice(schoolId: string, data: NoticeFormValues) {
  try {
    const validated = noticeSchema.parse(data)
    
    const targetAudienceArray = validated.targetAudience && validated.targetAudience.length > 0 
      ? validated.targetAudience.map(role => role as any) 
      : []
    
    const newNotice = await db.notice.create({
      data: {
        title: validated.title,
        content: validated.content,
        isPublished: validated.isPublished,
        targetAudience: targetAudienceArray,
        schoolId,
      }
    })
    
    revalidatePath('/tenant/[subdomain]/dashboard/notices', 'page')
    return { success: true, data: newNotice }
  } catch (error) {
    console.error('Failed to create notice', error)
    return { success: false, error: 'Failed to create notice' }
  }
}
