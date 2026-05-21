'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { feeCategorySchema, FeeCategoryFormValues } from '@/lib/validations/fee'
import { createFeeCategory } from '@/app/tenant/[subdomain]/actions/fee'

import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PlusCircle, Loader2 } from 'lucide-react'

export function FeeCategoryFormDialog({ schoolId }: { schoolId: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  
  const form = useForm<FeeCategoryFormValues>({
    resolver: zodResolver(feeCategorySchema) as any,
    defaultValues: { name: '', description: '', amount: 0 },
  })

  async function onSubmit(data: FeeCategoryFormValues) {
    const result = await createFeeCategory(schoolId, data)
    if (result.success) {
      setOpen(false)
      form.reset()
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Category</Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Fee Category</DialogTitle>
          <DialogDescription>Create a new type of fee (e.g., Tuition, Transport).</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Category Name</FormLabel><FormControl><Input placeholder="Tuition Fee" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="Monthly tuition" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="amount" render={({ field }) => (
              <FormItem><FormLabel>Default Amount (Rs.)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="flex justify-end pt-4 border-t mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Category
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
