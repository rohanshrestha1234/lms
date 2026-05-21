import { getFeeCategories, getInvoices } from '@/app/tenant/[subdomain]/actions/fee'
import { FeeCategoryFormDialog } from '@/components/fees/fee-category-form-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { 
  IndianRupee, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle,
  PiggyBank, 
  DollarSign, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react'

type Params = Promise<{ subdomain: string }>

export default async function FeesPage({ params }: { params: Params }) {
  const { subdomain } = await params
  const schoolId = 'mock-school-id'

  const [categories, invoices] = await Promise.all([
    getFeeCategories(schoolId),
    getInvoices(schoolId),
  ])

  // Dynamic Financial Calculations from database rows
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCollected = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + inv.amount, 0)
  const totalOutstanding = invoices.filter(inv => inv.status === 'PENDING' || inv.status === 'OVERDUE' || inv.status === 'PARTIAL').reduce((sum, inv) => sum + inv.amount, 0)
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Financial &amp; Fee Management</h1>
          <p className="text-muted-foreground mt-1">Configure student tuition rates, generate invoices, audit billing collections, and log payments.</p>
        </div>
      </div>

      {/* High-Fidelity Financial Summary Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-blue-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Invoiced</CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-1.5">
              <IndianRupee className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight text-foreground/90">Rs {totalBilled.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Cumulative student receivables</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-emerald-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Amount Collected</CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-1.5">
              <PiggyBank className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">Rs {totalCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" /> Complete settlements
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-rose-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Outstanding Dues</CardTitle>
            <div className="rounded-lg bg-rose-500/10 p-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-500 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight text-rose-600 dark:text-rose-400 font-mono">Rs {totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Outstanding student dues</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-border/50 shadow-sm bg-gradient-to-br from-card to-purple-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Collection Rate</CardTitle>
            <div className="rounded-lg bg-purple-500/10 p-1.5">
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight text-purple-600 dark:text-purple-400">{collectionRate}%</div>
            {/* Simple linear progress indicator */}
            <div className="h-1.5 w-full rounded-full bg-muted/50 mt-2 overflow-hidden border border-border/10">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 glow-pulse"
                style={{ width: `${collectionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[420px] bg-muted/40 p-1 rounded-xl border border-border/20 backdrop-blur-xs shadow-inner">
          <TabsTrigger value="invoices" className="rounded-lg font-bold text-xs py-2">Invoices &amp; Ledger</TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg font-bold text-xs py-2">Tuition Categories</TabsTrigger>
        </TabsList>

        {/* Tab 1: Recent Invoices */}
        <TabsContent value="invoices" className="mt-6 animate-in fade-in-30 duration-300">
          <Card className="border-border/50 shadow-md bg-card/40 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/10">
              <CardTitle className="text-xl font-extrabold">Recent Billing Ledger</CardTitle>
              <CardDescription>Recent invoices generated for student tuition fees.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-xl border border-border/30 overflow-hidden shadow-xs">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground pl-6">Student Roster</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Billing Category</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Due Date</TableHead>
                      <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Amount (Rs)</TableHead>
                      <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground pr-6">Status Badge</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border/20">
                    {invoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-sm italic">
                          No student billing invoices mapped yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      invoices.map((inv) => {
                        const status = inv.status
                        let statusBadge = (
                          <Badge variant="outline" className="text-[10px] font-bold border-amber-300/30 text-amber-600 bg-amber-500/5">
                            PENDING
                          </Badge>
                        )
                        if (status === 'PAID') {
                          statusBadge = (
                            <Badge variant="default" className="text-[10px] font-bold bg-emerald-500 hover:bg-emerald-600 border border-emerald-500/20 text-white flex items-center gap-1 self-end inline-flex">
                              <CheckCircle className="h-3 w-3" /> PAID
                            </Badge>
                          )
                        } else if (status === 'PARTIAL') {
                          statusBadge = (
                            <Badge variant="outline" className="text-[10px] font-bold border-blue-300/30 text-blue-600 bg-blue-500/5">
                              PARTIAL
                            </Badge>
                          )
                        } else if (status === 'OVERDUE') {
                          statusBadge = (
                            <Badge variant="destructive" className="text-[10px] font-bold bg-rose-500 border border-rose-600/20 text-white flex items-center gap-1 self-end inline-flex glow-pulse animate-bounce">
                              <AlertTriangle className="h-3 w-3" /> OVERDUE
                            </Badge>
                          )
                        }

                        return (
                          <TableRow key={inv.id} className="hover:bg-muted/5 transition-colors">
                            <TableCell className="font-medium pl-6">
                              <div className="font-bold text-foreground/90 tracking-tight">{inv.student.user.name}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5 font-semibold uppercase tracking-wider">
                                Roll: {inv.student.rollNumber || '-'} | Adm: {inv.student.admissionNumber}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-foreground/80">{inv.feeCategory.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-xs text-foreground/80 font-medium">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{format(new Date(inv.dueDate), 'MMM d, yyyy')}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono font-bold text-foreground/90 text-sm">
                              {inv.amount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              {statusBadge}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Tuition Categories */}
        <TabsContent value="categories" className="mt-6 animate-in fade-in-30 duration-300">
          <Card className="border-border/50 shadow-md bg-card/40 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/10 flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl font-extrabold">Fee Configurations</CardTitle>
                <CardDescription>Configure billing fee rates applicable to students.</CardDescription>
              </div>
              <div className="shrink-0">
                <FeeCategoryFormDialog schoolId={schoolId} />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-xl border border-border/30 overflow-hidden shadow-xs">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground pl-6">Billing Head</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Head Description</TableHead>
                      <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Default Rate (Rs)</TableHead>
                      <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground pr-6">Invoices Raised</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border/20">
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground text-sm italic">
                          No fee heads defined yet. Click button above to register.
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((cat) => (
                        <TableRow key={cat.id} className="hover:bg-muted/5 transition-colors">
                          <TableCell className="font-black text-foreground/90 pl-6">{cat.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground font-medium">{cat.description || '-'}</TableCell>
                          <TableCell className="text-right font-mono font-bold text-sm text-foreground/80">
                            {cat.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right pr-6 font-bold text-indigo-600 dark:text-indigo-400">
                            {cat._count.invoices} invoices
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
