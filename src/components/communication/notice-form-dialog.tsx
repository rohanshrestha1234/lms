'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { noticeSchema, NoticeFormValues } from '@/lib/validations/communication'
import { createNotice } from '@/app/tenant/[subdomain]/actions/communication'

import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PlusCircle, Loader2 } from 'lucide-react'

export function NoticeFormDialog({ schoolId }: { schoolId: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  
  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeSchema) as any,
    defaultValues: { title: '', content: '', isPublished: true, targetAudience: [] },
  })

  async function onSubmit(data: NoticeFormValues) {
    const result = await createNotice(schoolId, data)
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
          <Button><PlusCircle className="mr-2 h-4 w-4" /> New Notice</Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Publish Notice</DialogTitle>
          <DialogDescription>Create an announcement for the school notice board.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Holiday Announcement" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem><FormLabel>Content</FormLabel>
                <FormControl>
                  <textarea 
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="Details of the announcement..." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            
            <div className="flex justify-end pt-4 border-t mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Publish Notice
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
