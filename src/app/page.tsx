import { School, Sparkles, ArrowRight, Layers, ShieldAlert, GraduationCap, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-radial from-slate-950 via-zinc-900 to-black text-foreground overflow-hidden font-sans p-6">
      {/* Nepalese Theme Accents */}
      <div className="absolute right-0 top-0 -mr-32 -mt-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute left-0 bottom-0 -ml-32 -mb-32 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      
      {/* Glassmorphic Shell */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 md:p-12 shadow-2xl space-y-8 animate-in fade-in-50 zoom-in-95 duration-750">
        
        {/* Crest */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-400 tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" /> Multi-Tenant Gateway
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Apex ERP <span className="nepal-gradient-text">Portal Gateway</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-md font-medium">
            Welcome to Apex Academy's cloud LMS &amp; ERP administration deck. Access subdomains, billing, and classroom rosters.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="space-y-4">
          <a
            href="http://demo.localhost:3000/dashboard"
            className="group block p-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/10 hover:bg-indigo-950/20 hover:border-indigo-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <School className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
                    Apex Academy (Demo Portal)
                  </h3>
                  <ArrowRight className="h-4 w-4 text-indigo-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Launch the active tenant site at <span className="font-mono text-indigo-300">demo.localhost:3000/dashboard</span>. Access Academic stats, Attendance tracking, Fee Ledgers, and bulletins.
                </p>
              </div>
            </div>
          </a>

          <div className="p-4 rounded-xl border border-yellow-500/10 bg-yellow-500/5 text-xs text-yellow-400 flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">
              <strong>Multi-Tenancy Info:</strong> This application routes accounts dynamically using host subdomains. Visiting this generic link (<span className="underline">localhost:3000</span>) shows the portal gateway. Click the button above to route to the <strong className="text-white">demo</strong> tenant workspace.
            </p>
          </div>
        </div>

        {/* Footer info showing Nepal Context */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] text-muted-foreground gap-3">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-500" />
            <span>Database Seed Active: Class 8 - 10</span>
          </div>
          <div className="flex items-center gap-1 font-mono">
            <Layers className="h-3 w-3 text-indigo-400" />
            <span>Active Session B.S. 2081-2082</span>
          </div>
        </div>

      </div>
    </div>
  )
}
