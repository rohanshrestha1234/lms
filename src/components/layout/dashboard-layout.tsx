'use client'

import { Sidebar } from './sidebar'
import { Header } from './header'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DashboardLayoutProps {
  children: React.ReactNode
  role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'ACCOUNTANT'
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/30">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden border-r bg-background md:block md:w-64 lg:w-72 fixed inset-y-0 z-20">
          <Sidebar role={role} className="h-full" />
        </div>
        
        {/* Main Content Area */}
        <div className="flex w-full flex-col md:ml-64 lg:ml-72">
          <Header role={role} />
          <ScrollArea className="flex-1">
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
