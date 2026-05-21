'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  FileText,
  Settings,
  CreditCard,
  MessageSquare
} from 'lucide-react'

// This would typically come from an auth context or API
type Role = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'ACCOUNTANT'

interface SidebarProps {
  role: Role
  className?: string
}

export function Sidebar({ role, className }: SidebarProps) {
  const pathname = usePathname()

  // Define links based on role
  // This is a simplified version, in reality, you'd have more granular checks
  const getLinks = () => {
    const base = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
    ]

    if (role === 'SUPER_ADMIN') {
      return [
        ...base,
        { name: 'Schools', href: '/dashboard/schools', icon: GraduationCap },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    }

    if (role === 'SCHOOL_ADMIN') {
      return [
        ...base,
        { name: 'Users', href: '/dashboard/users', icon: Users },
        { name: 'Academics', href: '/dashboard/academics', icon: BookOpen },
        { name: 'Attendance', href: '/dashboard/attendance', icon: CalendarDays },
        { name: 'Fees', href: '/dashboard/fees', icon: CreditCard },
        { name: 'Notices', href: '/dashboard/notices', icon: MessageSquare },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    }
    
    if (role === 'TEACHER') {
      return [
        ...base,
        { name: 'My Classes', href: '/dashboard/classes', icon: BookOpen },
        { name: 'Attendance', href: '/dashboard/attendance', icon: CalendarDays },
        { name: 'Homework', href: '/dashboard/homework', icon: FileText },
        { name: 'Exams', href: '/dashboard/exams', icon: FileText },
      ]
    }

    if (role === 'STUDENT' || role === 'PARENT') {
      return [
        ...base,
        { name: 'Academics', href: '/dashboard/academics', icon: BookOpen },
        { name: 'Attendance', href: '/dashboard/attendance', icon: CalendarDays },
        { name: 'Homework', href: '/dashboard/homework', icon: FileText },
        { name: 'Fees', href: '/dashboard/fees', icon: CreditCard },
      ]
    }

    return base
  }

  const links = getLinks()

  return (
    <div className={cn("pb-6 min-h-screen border-r bg-card/40 backdrop-blur-md flex flex-col justify-between", className)}>
      <div className="space-y-6">
        {/* Premium Nepalese School Branding */}
        <div className="flex h-16 items-center px-6 border-b border-border/40 gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl nepal-gradient-card shadow-md premium-glow text-white font-extrabold text-base relative overflow-hidden">
            <span className="relative z-10">A</span>
            <div className="absolute inset-0 bg-white/10 blur-xs" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400">
              APEX ACADEMY
            </span>
            <span className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">
              School ERP Portal
            </span>
          </div>
        </div>

        <div className="px-4 py-2">
          <h2 className="mb-3 px-3 text-[11px] font-bold tracking-widest text-muted-foreground/70 uppercase">
            Navigation
          </h2>
          <div className="space-y-1.5">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href}>
                  <span
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-[0_4px_12px_-2px_rgba(139,92,246,0.35)] premium-card-active" 
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md bg-white" />
                    )}
                    <link.icon className={cn(
                      "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-primary-foreground animate-pulse" : "text-muted-foreground/80 group-hover:text-primary"
                    )} />
                    {link.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Dynamic Academic Year Tag in Sidebar Footer */}
      <div className="px-6 py-4 border-t border-border/40 bg-muted/10">
        <div className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-semibold text-muted-foreground">Session B.S. 2081-2082</span>
        </div>
      </div>
    </div>
  )
}
