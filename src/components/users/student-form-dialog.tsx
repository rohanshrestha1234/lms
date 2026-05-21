'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { studentSchema, StudentFormValues } from '@/lib/validations/user'
import { createStudent } from '@/app/tenant/[subdomain]/actions/user'

import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircle, Loader2 } from 'lucide-react'

interface StudentFormDialogProps {
  schoolId: string
  sections: { id: string; name: string; class: { name: string } }[]
}

export function StudentFormDialog({ schoolId, sections }: StudentFormDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '', email: '', phone: '', admissionNumber: '', rollNumber: '',
      gender: 'MALE', dob: '', sectionId: '',
    },
  })

  async function onSubmit(data: StudentFormValues) {
    const result = await createStudent(schoolId, data)
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
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Student</Button>
        }
      />
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Student</DialogTitle>
          <DialogDescription>Enter the details to register a new student.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 pt-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1"><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1"><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <FormField control={form.control} name="admissionNumber" render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1"><FormLabel>Admission Number</FormLabel><FormControl><Input placeholder="ADM-2023-001" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>

            <FormField control={form.control} name="gender" render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1"><FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}/>
            
            <FormField control={form.control} name="sectionId" render={({ field }) => (
              <FormItem className="col-span-2"><FormLabel>Class & Section</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Assign to section" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {sections.length === 0 ? (
                      <SelectItem value="none" disabled>No sections available</SelectItem>
                    ) : (
                       sections.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.class.name} - {s.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}/>
            
            <div className="col-span-2 flex justify-end pt-4 border-t mt-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Student
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
