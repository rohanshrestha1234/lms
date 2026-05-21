'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { feeCategorySchema, FeeCategoryFormValues, feeInvoiceSchema, FeeInvoiceFormValues } from '@/lib/validations/fee'

export async function getFeeCategories(schoolId: string) {
  try {
    return await db.feeCategory.findMany({
      where: { schoolId },
      include: {
        _count: { select: { invoices: true } }
      },
      orderBy: { name: 'asc' }
    })
  } catch (error) {
    console.error('Failed to get fee categories', error)
    return []
  }
}

export async function createFeeCategory(schoolId: string, data: FeeCategoryFormValues) {
  try {
    const validated = feeCategorySchema.parse(data)
    
    const category = await db.feeCategory.create({
      data: {
        ...validated,
        schoolId,
      }
    })
    
    revalidatePath('/tenant/[subdomain]/dashboard/fees', 'page')
    return { success: true, data: category }
  } catch (error) {
    console.error('Failed to create fee category', error)
    return { success: false, error: 'Failed to create fee category' }
  }
}

export async function getInvoices(schoolId: string) {
  try {
    return await db.feeInvoice.findMany({
      where: { student: { schoolId } },
      include: {
        student: { include: { user: true } },
        feeCategory: true,
        payments: true,
      },
      orderBy: { dueDate: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get invoices', error)
    return []
  }
}

export async function createInvoice(schoolId: string, data: FeeInvoiceFormValues) {
  try {
    const validated = feeInvoiceSchema.parse(data)
    
    const invoice = await db.feeInvoice.create({
      data: {
        studentId: validated.studentId,
        feeCategoryId: validated.feeCategoryId,
        dueDate: new Date(validated.dueDate),
        amount: validated.amount,
        status: 'PENDING',
      }
    })
    
    revalidatePath('/tenant/[subdomain]/dashboard/fees', 'page')
    return { success: true, data: invoice }
  } catch (error) {
    console.error('Failed to create invoice', error)
    return { success: false, error: 'Failed to create invoice' }
  }
}
