import * as z from 'zod'

export const feeCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  description: z.string().optional(),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
})

export const feeInvoiceSchema = z.object({
  studentId: z.string().uuid('Student is required'),
  feeCategoryId: z.string().uuid('Fee category is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
})

export const paymentSchema = z.object({
  feeInvoiceId: z.string().uuid('Invoice is required'),
  amountPaid: z.coerce.number().min(1, 'Amount paid must be greater than 0'),
  paymentMethod: z.enum(['CASH', 'eSewa', 'Khalti', 'BANK_TRANSFER']),
  transactionId: z.string().optional(),
})

export type FeeCategoryFormValues = z.infer<typeof feeCategorySchema>
export type FeeInvoiceFormValues = z.infer<typeof feeInvoiceSchema>
export type PaymentFormValues = z.infer<typeof paymentSchema>
