import { Suspense } from 'react'
import { AttendancePageClient } from './client'

type Params = Promise<{ subdomain: string }>

export default async function AttendancePage({ params }: { params: Params }) {
  const { subdomain } = await params
  return (
    <Suspense fallback={
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading attendance...
      </div>
    }>
      <AttendancePageClient />
    </Suspense>
  )
}
