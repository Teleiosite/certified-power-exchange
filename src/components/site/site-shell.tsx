import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Menu, Phone, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/lampros-logo.png";
import { Button } from "@/components/ui/button";

const navigation = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Energy services" },
  { to: "/catalog", label: "Supplies" },
  { to: "/equipment", label: "Power equipment" },
];

export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <div className="border-b border-border bg-navy-deep text-soft-white">
        <div className="shell-width flex min-h-9 items-center justify-between gap-3 text-xs">
          <span className="hidden sm:block">Practical energy solutions. Sourced for your project.</span>
          <a className="ml-auto inline-flex items-center gap-2 py-2 font-medium" href="tel:+2348000000000">
            <Phone className="size-3.5 text-primary" /> Talk to our team <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="shell-width flex h-[4.75rem] items-center justify-between gap-6">
          <Link aria-label="Lampros Power Tech home" to="/" onClick={() => setMobileOpen(false)} className="flex w-[154px] shrink-0 items-center">
            <img src={logo} alt="Lampros Power Tech" width={280} height={120} className="w-full" />
          </Link>
          <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
            {navigation.map((item) => (
              <Link key={item.to} to={item.to} className={`text-sm font-medium transition-colors hover:text-primary ${pathname === item.to ? "text-primary" : "text-muted-foreground"}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden shrink-0 items-center gap-4 md:flex">
            <Link to="/assessment" className="text-sm font-medium text-soft-white transition-colors hover:text-primary">Project assessment</Link>
            <Button asChild size="sm" className="h-10 px-4"><Link to="/quote">Request a quote <ArrowRight /></Link></Button>
          </div>
          <Button aria-label={mobileOpen ? "Close navigation" : "Open navigation"} variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {mobileOpen && (
          <nav aria-label="Mobile navigation" className="absolute inset-x-0 top-full grid gap-1 border-b border-border bg-background px-6 py-5 shadow-xl md:hidden">
            {navigation.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="flex min-h-12 items-center border-b border-border text-sm font-medium">{item.label}</Link>
            ))}
            <Link to="/assessment" onClick={() => setMobileOpen(false)} className="flex min-h-12 items-center border-b border-border text-sm font-medium">Project assessment</Link>
            <Button asChild className="mt-3 w-full"><Link to="/quote" onClick={() => setMobileOpen(false)}>Request a quote <ArrowRight /></Link></Button>
          </nav>
        )}
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="shell-width grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <img src={logo} alt="Lampros Power Tech" width={280} height={120} className="mb-4 w-48" />
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">Dependable products and considered engineering for the way businesses really use power.</p>
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary"><ShieldCheck className="size-4" /> Practical. Transparent. Accountable.</span>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold">Explore</h2>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-primary">About Lampros</Link><Link to="/services" className="hover:text-primary">Energy services</Link><Link to="/catalog" className="hover:text-primary">Supplies catalogue</Link><Link to="/equipment" className="hover:text-primary">Certified equipment</Link>
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold">Let’s get to work</h2>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <Link to="/audit" className="hover:text-primary">Request an energy audit</Link><Link to="/assessment" className="hover:text-primary">Project assessment</Link><Link to="/quote" className="hover:text-primary">Request a supply quote</Link><Link to="/trade-in" className="hover:text-primary">Sell or trade in equipment</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5"><div className="shell-width flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Lampros Power Tech</span><span>Honest specifications. Project-matched supply.</span></div></div>
    </footer>
  );
}