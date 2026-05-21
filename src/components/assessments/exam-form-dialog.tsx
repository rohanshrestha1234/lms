'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { examSchema, ExamFormValues } from '@/lib/validations/assessment'
import { createExam } from '@/app/tenant/[subdomain]/actions/assessment'

import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircle, Loader2 } from 'lucide-react'

interface ExamFormDialogProps {
  schoolId: string
  subjects: { id: string; name: string; class: { name: string } }[]
}

export function ExamFormDialog({ schoolId, subjects }: ExamFormDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  
  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema) as any,
    defaultValues: {
      name: '', date: '', maxMarks: 100, passMarks: 40, subjectId: '',
    },
  })

  async function onSubmit(data: ExamFormValues) {
    const result = await createExam(schoolId, data)
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
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Create Exam</Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Exam</DialogTitle>
          <DialogDescription>Set up a new examination for a specific subject.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Exam Name</FormLabel><FormControl><Input placeholder="e.g. Mid Term Exam" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <FormField control={form.control} name="subjectId" render={({ field }) => (
              <FormItem><FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {subjects.length === 0 ? (
                      <SelectItem value="none" disabled>No subjects available</SelectItem>
                    ) : (
                      subjects.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.class.name} - {s.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}/>

            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="maxMarks" render={({ field }) => (
                <FormItem><FormLabel>Max Marks</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="passMarks" render={({ field }) => (
                <FormItem><FormLabel>Pass Marks</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </div>
            
            <div className="flex justify-end pt-4 border-t mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Exam
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
