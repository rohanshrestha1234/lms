'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { teacherSchema, TeacherFormValues } from '@/lib/validations/user'
import { createTeacher } from '@/app/tenant/[subdomain]/actions/user'

import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PlusCircle, Loader2 } from 'lucide-react'

export function TeacherFormDialog({ schoolId }: { schoolId: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: '', email: '', phone: '', employeeId: '', qualification: '',
    },
  })

  async function onSubmit(data: TeacherFormValues) {
    const result = await createTeacher(schoolId, data)
    if (result.success) {
      setOpen(false)
      form.reset()
      router.refresh()
    } else {
      console.error(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Teacher</Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register New Teacher</DialogTitle>
          <DialogDescription>Enter the details to register a new teacher.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="jane@example.com" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <FormField control={form.control} name="employeeId" render={({ field }) => (
              <FormItem><FormLabel>Employee ID</FormLabel><FormControl><Input placeholder="EMP-2023-01" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>

            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="98XXXXXXXX" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <FormField control={form.control} name="qualification" render={({ field }) => (
              <FormItem><FormLabel>Qualification</FormLabel><FormControl><Input placeholder="M.Sc. Mathematics" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Teacher
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
