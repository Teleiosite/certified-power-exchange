import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardCheck,
  FileSearch,
  Gauge,
  PackageSearch,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Wrench,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuote } from "@/components/site/quote-context";
import { formatQuantity, inventory, productCategories, products } from "@/lib/lampros-data";
import heroImage from "@/assets/lampros-site-hero.jpg";
import electricalImage from "@/assets/electrical-components.jpg";
import inspectionImage from "@/assets/generator-inspection.jpg";
import { IntakeForm } from "@/components/site/intake-form";

function Intro({ label, title, copy }: { label: string; title: string; copy: string }) {
  return (
    <section className="border-b border-border bg-background py-14 sm:py-20">
      <div className="shell-width max-w-4xl">
        <p className="eyebrow">{label}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">{copy}</p>
      </div>
    </section>
  );
}

function SectionTitle({ label, title, copy }: { label: string; title: string; copy: string }) {
  return <div className="max-w-2xl"><p className="eyebrow">{label}</p><h2 className="mt-3 text-3xl font-semibold leading-tight">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></div>;
}

const serviceRows = [
  { title: "Renewable energy systems", copy: "Solar, storage and power conversion specified around real load requirements and operating conditions.", to: "/audit", link: "Scope an energy audit", icon: Gauge },
  { title: "Electrical components", copy: "Solar and conventional electrical components selected against project specifications.", to: "/catalog", link: "Browse supplies", icon: ShoppingBasket },
  { title: "Power equipment sourcing", copy: "New, inspected and refurbishment candidates considered transparently against your site needs.", to: "/equipment", link: "Review equipment", icon: PackageSearch },
  { title: "Project & loan assessment", copy: "A structured evaluation file for project scope, equipment requirements and supporting documents.", to: "/assessment", link: "Start an assessment", icon: FileSearch },
] as const;

const heroSlides = [
  {
    image: heroImage,
    alt: "Engineer inspecting rooftop solar and electrical equipment",
    eyebrow: "LAMPROS POWER TECH · PRACTICAL POWER, CLEAR SPECS",
    title: "Dependable Energy Products. Practical Power Solutions.",
    copy: "From right-sized renewable systems to carefully sourced electrical supplies and inspected power equipment, we help you make informed project decisions.",
    primary: "Request an Energy Audit",
    primaryTo: "/audit",
    secondary: "Browse Supplies & Equipment",
    secondaryTo: "/catalog",
  },
  {
    image: inspectionImage,
    alt: "Technician reviewing a generator during inspection",
    eyebrow: "POWER EQUIPMENT · INSPECTED WITH CARE",
    title: "A clearer view of every equipment decision.",
    copy: "Review condition findings, functional tests and known limitations before deciding whether a unit fits your project.",
    primary: "Explore Power Equipment",
    primaryTo: "/equipment",
    secondary: "Contact Our Team",
    secondaryTo: "/contact-us",
  },
  {
    image: electricalImage,
    alt: "Electrical components and cabling for energy projects",
    eyebrow: "SUPPLIES · MATCHED TO YOUR PROJECT",
    title: "Find the right components for the work ahead.",
    copy: "Start with your specifications and project context. We’ll help you review practical supply options for your requirements.",
    primary: "Browse Supplies",
    primaryTo: "/catalog",
    secondary: "Request a Quote",
    secondaryTo: "/quote",
  },
] as const;

export function HomePage() {
  const [heroApi, setHeroApi] = useState<CarouselApi>();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (!heroApi) return;
    const updateIndex = () => setHeroIndex(heroApi.selectedScrollSnap());
    updateIndex();
    heroApi.on("select", updateIndex);
    return () => heroApi.off("select", updateIndex);
  }, [heroApi]);

  return (
    <main>
      <Carousel setApi={setHeroApi} opts={{ loop: true }} aria-label="Featured energy solutions" className="overflow-hidden border-b border-border">
        <CarouselContent className="ml-0">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={slide.title} className="relative min-h-[590px] pl-0 sm:min-h-[650px]">
              <img src={slide.image} alt={slide.alt} className="absolute inset-0 size-full object-cover object-center" />
              <div className="absolute inset-0 bg-background/80 sm:bg-background/70" />
              <div className="shell-width relative flex min-h-[590px] items-center py-16 sm:min-h-[650px] sm:py-24">
                <div className="max-w-3xl rise-in">
                  <p className="eyebrow">{slide.eyebrow}</p>
                  {index === 0
                    ? <h1 className="mt-5 text-5xl font-semibold leading-[1.08] sm:text-6xl">{slide.title}</h1>
                    : <h2 className="mt-5 text-5xl font-semibold leading-[1.08] sm:text-6xl">{slide.title}</h2>}
                  <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{slide.copy}</p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button size="lg" asChild><Link to={slide.primaryTo}>{slide.primary} <ArrowRight /></Link></Button>
                    <Button size="lg" variant="outline" asChild><Link to={slide.secondaryTo}>{slide.secondary} <ArrowRight /></Link></Button>
                  </div>
                  {index === 0 && <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 border-t border-border pt-5 text-sm sm:grid-cols-3">
                    {["Project-matched supply", "Clear condition reports", "No online payment"].map((item) => <p key={item} className="flex items-center gap-2 text-foreground"><Check className="size-4 shrink-0 text-primary" />{item}</p>)}
                  </div>}
                  <p className="mt-6 text-xs font-semibold tracking-widest text-muted-foreground" aria-live="polite">{String(heroIndex + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious aria-label="Previous featured slide" className="left-auto right-16 top-auto bottom-5 translate-y-0 border-border bg-background/90" />
        <CarouselNext aria-label="Next featured slide" className="right-5 top-auto bottom-5 translate-y-0 border-border bg-background/90" />
      </Carousel>
      <section className="section-space">
        <div className="shell-width">
          <SectionTitle label="What we do" title="Power decisions grounded in your requirements." copy="A practical starting point for homes, facilities and businesses planning supply, continuity or electrical work." />
          <div className="mt-10 grid gap-x-10 md:grid-cols-2">
            {serviceRows.map(({ title, copy, to, link, icon: Icon }, index) => <article key={title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-border py-7"><span className="grid size-11 place-items-center border border-border text-primary"><Icon className="size-5" /></span><div><p className="eyebrow">0{index + 1}</p><h3 className="mt-1 text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p><Link to={to} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">{link}<ArrowRight className="size-4" /></Link></div></article>)}
          </div>
        </div>
      </section>
      <section className="border-y border-border bg-card py-16">
        <div className="shell-width grid gap-8 md:grid-cols-[1fr_1.05fr] md:items-center">
          <div><p className="eyebrow">Equipment recovery, done transparently</p><h2 className="mt-3 text-3xl font-semibold">A clear path from inspection to resale.</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">Inspection findings, test results and known limitations should be visible before a buyer decides. Not every unit is suitable for refurbishment or resale.</p><Button className="mt-6" variant="outline" asChild><Link to="/equipment">See the inspection process <ArrowRight /></Link></Button></div>
          <img src={inspectionImage} alt="Technician reviewing a generator during inspection" className="photo-frame aspect-[16/10] w-full object-cover" />
        </div>
      </section>
      <section className="section-space">
        <div className="shell-width grid gap-8 md:grid-cols-[1fr_auto] md:items-end"><SectionTitle label="Start with your project" title="Tell us what needs to work." copy="Share your location, approximate load and operating context. We’ll use that information to shape a relevant first review." /><Button asChild size="lg"><Link to="/quote">Build a quote list <ArrowRight /></Link></Button></div>
      </section>
    </main>
  );
}

export function ContactPage() {
  const contactOptions = [
    { title: "Energy projects", copy: "Share your location, operating needs and power context for an initial energy review.", link: "Request an energy audit", to: "/audit", icon: Gauge },
    { title: "Supplies & equipment", copy: "Build a list of products or equipment for a project-specific quote.", link: "Browse supplies", to: "/catalog", icon: ShoppingBasket },
    { title: "Equipment recovery", copy: "Tell us about equipment you may want inspected, sold or traded in.", link: "Start a trade-in review", to: "/trade-in", icon: Wrench },
  ] as const;

  return (
    <main>
      <Intro label="Contact Lampros" title="Let’s talk about what your project needs." copy="Choose the type of support you’re looking for and share the details through the right request form. Our team will review your project context and follow up." />
      <section className="section-space">
        <div className="shell-width">
          <SectionTitle label="How can we help?" title="Start with the right conversation." copy="Each request goes to a focused review so we can respond with useful, project-specific information." />
          <div className="mt-8 grid gap-x-8 md:grid-cols-3">
            {contactOptions.map(({ title, copy, link, to, icon: Icon }) => (
              <article key={title} className="border-t border-border py-6">
                <Icon className="size-6 text-primary" />
                <h2 className="mt-4 text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
                <Link to={to} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">{link}<ArrowRight className="size-4" /></Link>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">For a structured project or financing review, you can also submit a project assessment file.</p>
            <Button asChild variant="outline"><Link to="/assessment">Project assessment <ArrowRight /></Link></Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function AboutPage() {
  const values = ["Reliability", "Quality", "Integrity", "Innovation", "Customer satisfaction"];
  const standards = [
    ["Warranty policies", "Any applicable warranty is stated with its scope, duration and exclusions before agreement."],
    ["Engineer review", "Technical suitability and inspection findings are documented for the specific equipment or project."],
    ["Response process", "Requests are reviewed with project context; timing is confirmed directly rather than promised automatically."],
  ];
  return <main><Intro label="About Lampros" title="Practical energy choices. Accountable equipment sourcing." copy="Lampros Power Tech brings renewable energy, electrical supply and power equipment sourcing together around clear requirements and transparent review." />
    <section className="section-space"><div className="shell-width grid gap-12 md:grid-cols-2"><div><p className="eyebrow">Our mission</p><h2 className="mt-3 text-3xl font-semibold">Make dependable power more practical to plan.</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">We work to connect customers with fit-for-purpose energy products, considered technical support and credible equipment recovery options—without overstating performance or availability.</p></div><div><p className="eyebrow">Our vision</p><h2 className="mt-3 text-3xl font-semibold">Better-informed decisions across the power lifecycle.</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">We aim for a market where product specifications, inspection history and project assumptions are easier to examine before commitments are made.</p></div></div></section>
    <section className="border-y border-border bg-card py-14"><div className="shell-width"><SectionTitle label="Our values" title="How we approach the work" copy="A consistent standard for project conversations, product selection and recovery assessments." /><ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{values.map((value) => <li key={value} className="flex items-center gap-3 border-t border-border py-4 text-sm font-semibold"><Check className="size-4 text-primary" />{value}</li>)}</ul></div></section>
    <section className="section-space"><div className="shell-width"><SectionTitle label="Trust matrix" title="Evidence before assurance." copy="The details that should be confirmed for each project—not blanket promises." /><div className="mt-8 grid gap-0 md:grid-cols-3">{standards.map(([title, copy]) => <article key={title} className="border-t border-border p-5 md:border-r md:last:border-r-0"><ShieldCheck className="size-5 text-primary" /><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}</div></div></section>
  </main>;
}

export function ServicesPage() {
  return <main><Intro label="Energy services" title="One project view across energy, supply and equipment." copy="Start with the operating need. We’ll review the site context, load and delivery requirements before discussing suitable next steps." />
    <section className="section-space"><div className="shell-width grid gap-0 md:grid-cols-2">{serviceRows.map(({ title, copy, to, link, icon: Icon }) => <article key={title} className="border-t border-border p-6 md:border-r md:last:border-r-0"><Icon className="size-6 text-primary" /><h2 className="mt-4 text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p><Button className="mt-5" variant="outline" asChild><Link to={to}>{link}<ArrowRight /></Link></Button></article>)}</div></section>
    <section className="border-y border-border bg-card py-14"><div className="shell-width grid gap-8 md:grid-cols-3"><div><p className="eyebrow">01 · Understand</p><h2 className="mt-2 text-xl font-semibold">Operating context</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Load, outages, usage patterns, site and timeline.</p></div><div><p className="eyebrow">02 · Evaluate</p><h2 className="mt-2 text-xl font-semibold">Practical options</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Equipment fit, specifications and condition evidence.</p></div><div><p className="eyebrow">03 · Confirm</p><h2 className="mt-2 text-xl font-semibold">Written scope</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Costs, logistics, warranty and responsibilities agreed offline.</p></div></div></section>
  </main>;
}

export function CatalogPage() {
  const { addItem, items } = useQuote();
  const [category, setCategory] = useState<(typeof productCategories)[number]>("All equipment");
  const [query, setQuery] = useState("");
  const selectedIds = new Set(items.map((item) => item.id));
  const filtered = useMemo(() => products.filter((product) => (category === "All equipment" || product.category === category) && `${product.name} ${product.description} ${product.spec} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase())), [category, query]);
  return <main><Intro label="Supplies & equipment" title="Specifications first. Supply matched to the work." copy="Search renewable energy products and electrical components. Final brand, quantities, freight and project requirements are confirmed with our team." />
    <section className="section-space"><div className="shell-width">
      <div className="grid gap-5 border-b border-border pb-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"><div><label htmlFor="catalog-search" className="mb-2 block text-sm font-semibold">Search products</label><div className="relative max-w-xl"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="catalog-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search panels, inverters, cable…" className="pl-10" /></div></div><p className="text-sm text-muted-foreground">{filtered.length} items · {items.length} in quote list</p></div>
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter by product category">{productCategories.map((item) => <Button key={item} type="button" size="sm" variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)}>{item}</Button>)}</div>
      {filtered.length ? <div className="mt-8 grid gap-x-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <article key={product.id} className="border-t border-border pb-6">
        <img src={product.image === "electrical" ? electricalImage : product.image === "cable" ? electricalImage : heroImage} alt={product.category === "Electrical cables" ? "Electrical cabling and components" : product.category === "Protection & distribution" ? "Electrical distribution equipment" : "Solar energy equipment"} className="mt-4 aspect-[16/10] w-full object-cover" />
        <div className="mt-4 flex items-start justify-between gap-3"><div><p className="eyebrow">{product.category}</p><h2 className="mt-2 text-lg font-semibold">{product.name}</h2></div><BadgeCheck className="mt-1 size-5 shrink-0 text-primary" /></div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.description}</p><p className="mt-3 border-l-2 border-primary pl-3 text-xs font-medium">{product.spec}</p>
        <Button className="mt-5 w-full" variant={selectedIds.has(product.id) ? "secondary" : "outline"} onClick={() => addItem(product.id)}>{selectedIds.has(product.id) ? <><Check /> Add another</> : <><ShoppingBasket /> Add to quote</>}</Button>
      </article>)}</div> : <p className="mt-10 border-y border-border py-10 text-center text-sm text-muted-foreground">No products match that search. Try a different term or category.</p>}
      <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">No online payment. Final pricing, freight and project specifications are agreed offline.</p><Button asChild><Link to="/quote">Review quote list <ArrowRight /></Link></Button></div>
    </div></section></main>;
}

export function EquipmentPage() {
  const steps = ["Sourcing review", "Inspection & refurbishment", "Functional testing", "Documented resale review"];
  return <main><Intro label="Power equipment" title="Recovered equipment, examined before it is offered." copy="We favour transparent inspection findings over vague condition labels. Suitability depends on the unit, test evidence, project requirements and written terms." />
    <section className="section-space"><div className="shell-width grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-start"><div><SectionTitle label="Recovery process" title="A documented path to resale." copy="A unit may be rejected at any stage. Refurbishment does not erase wear, limitations or the need to match equipment to its intended duty." /><ol className="mt-8 grid gap-0">{steps.map((step, index) => <li key={step} className="flex gap-4 border-t border-border py-4"><span className="grid size-8 shrink-0 place-items-center border border-primary text-xs font-semibold text-primary">0{index + 1}</span><span><strong className="text-sm">{step}</strong><span className="mt-1 block text-xs text-muted-foreground">{index === 0 ? "Source, identity and basic documentation reviewed." : index === 1 ? "Condition recorded; viable repairs identified." : index === 2 ? "Relevant checks and test results retained." : "Report, limitations, availability and terms confirmed."}</span></span></li>)}</ol></div><img src={inspectionImage} alt="Engineer checking an industrial generator" className="photo-frame aspect-[4/3] w-full object-cover" /></div></section>
    <section className="border-y border-border bg-card py-14"><div className="shell-width flex flex-col gap-4 border-l-2 border-primary pl-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="eyebrow">LAMPROS INSPECTED &amp; CERTIFIED</p><h2 className="mt-2 text-2xl font-semibold">A documented standard—not a generic used-equipment label.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">This status applies only when the specific unit’s inspection and test requirements have been completed and records are available. Illustrative profiles below do not represent live stock or issued certificates.</p></div><ShieldCheck className="size-9 shrink-0 text-primary" /></div></section>
    <section className="section-space"><div className="shell-width"><SectionTitle label="Illustrative condition reports" title="What an equipment review should make visible." copy="Sample records demonstrate the information we aim to provide. They are not current listings, engineering approvals or warranty offers." /><div className="mt-8 grid gap-x-8 md:grid-cols-2">{inventory.map((item) => <article key={item.id} className="border-t border-border py-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">Sample assessment profile · {item.capacity}</p><h2 className="mt-2 text-xl font-semibold">{item.name}</h2><p className="mt-1 text-sm text-muted-foreground">{item.brand}</p></div><span className="inline-flex items-center gap-2 border border-primary/40 px-3 py-2 text-xs font-semibold text-primary"><ClipboardCheck className="size-4" />Test status: report example</span></div><dl className="mt-5 grid grid-cols-2 gap-3 border-y border-border py-4 text-sm"><div><dt className="text-xs text-muted-foreground">Year</dt><dd className="mt-1 font-medium">{item.year}</dd></div><div><dt className="text-xs text-muted-foreground">Run hours</dt><dd className="mt-1 font-medium">{item.hours}</dd></div><div><dt className="text-xs text-muted-foreground">Reported condition</dt><dd className="mt-1 font-medium">{item.condition}</dd></div><div><dt className="text-xs text-muted-foreground">Availability</dt><dd className="mt-1 font-medium">{item.availability}</dd></div></dl><p className="mt-4 text-sm leading-6 text-muted-foreground">{item.report}</p></article>)}</div><Button asChild className="mt-8"><Link to="/trade-in">Sell or trade in equipment <Wrench /></Link></Button></div></section>
  </main>;
}

export function QuotePage() {
  const { items, changeQuantity, clear, count } = useQuote();
  return <main><Intro label="Project supply quote" title="Build a list. Confirm the details together." copy="We review requested items, load requirements and delivery context before sharing project pricing. This is a quote request—not a checkout." />
    <section className="section-space"><div className="shell-width">{items.length ? <><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5"><div><p className="eyebrow">Your request</p><h2 className="mt-2 text-2xl font-semibold">{items.length} product{items.length === 1 ? "" : "s"} · {formatQuantity(count)} total units</h2></div><Button type="button" variant="ghost" onClick={clear}>Clear list</Button></div><div className="divide-y divide-border">{items.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-5"><div><h3 className="font-semibold">{item.name}</h3><p className="mt-1 text-xs text-muted-foreground">Project pricing confirmed after review</p></div><div className="flex items-center gap-3"><label htmlFor={`quantity-${item.id}`} className="text-xs text-muted-foreground">Quantity</label><Input id={`quantity-${item.id}`} className="w-24" type="number" min={1} max={100000} value={item.quantity} onChange={(event) => changeQuantity(item.id, Number(event.target.value))} /><Button size="sm" variant="ghost" aria-label={`Remove ${item.name}`} onClick={() => changeQuantity(item.id, 0)}>Remove</Button></div></div>)}</div><div className="mt-8 grid gap-10 border-t border-border pt-8 lg:grid-cols-[minmax(0,1fr)_15rem]"><div><h2 className="text-xl font-semibold">Project and delivery details</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Include your site location, approximate power load, intended use and delivery timeline. The team will confirm specifications, freight and any applicable warranty directly.</p><Button className="mt-5" variant="outline" asChild><Link to="/catalog">Add more supplies <ArrowRight /></Link></Button></div><IntakeForm kind="quote" legal /></div></> : <div className="max-w-xl border-y border-border py-10"><ShoppingBasket className="size-8 text-primary" /><h2 className="mt-4 text-2xl font-semibold">Your quote list is empty.</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Browse the catalogue and add the supplies or equipment you want us to review.</p><Button asChild className="mt-5"><Link to="/catalog">Browse catalogue <ArrowRight /></Link></Button></div>}</div></section></main>;
}

export function AuditPage() {
  return <main><Intro label="Energy audit estimate" title="A useful estimate starts with your operating reality." copy="Share your sector, power costs, outage pattern and estimated load. We’ll use those details to prepare a preliminary assessment scope—not a guaranteed savings forecast." /><section className="section-space"><div className="shell-width"><IntakeForm kind="audit" description="Please share your approximate monthly energy cost and outage frequency alongside the site's power load." legal /></div></section></main>;
}

export function AssessmentPage() {
  return <main><Intro label="Project evaluation portal" title="Submit a structured file for preliminary assessment." copy="Organize your organization details, power requirements, project cost estimate and available documents for a more useful first review." /><section className="section-space"><div className="shell-width"><div className="mb-8 grid gap-5 border-y border-border py-5 sm:grid-cols-3">{[["01", "Organization & contact"], ["02", "Energy & project scope"], ["03", "Supporting documents"]].map(([number, label]) => <p key={number} className="flex items-center gap-3 text-sm font-semibold"><span className="grid size-8 place-items-center border border-primary text-xs text-primary">{number}</span>{label}</p>)}</div><IntakeForm kind="loan" description="Complete the evaluation steps with accurate load, project and contact details. Documents are optional where unavailable and remain in private storage." legal /></div></section></main>;
}

export function TradeInPage() {
  return <main><Intro label="Sell or trade in equipment" title="Start with the condition—not just the nameplate." copy="Tell us what you have, what is known about its history and where it is located. A first review is not an offer or a promise of resale." /><section className="section-space"><div className="shell-width grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]"><div><img src={electricalImage} alt="Electrical equipment in a supply facility" className="photo-frame mb-8 aspect-[16/7] w-full object-cover" /><IntakeForm kind="trade-in" description="Include make, model, capacity, year, operating hours, service history and any faults. You may attach photos or a condition report." legal /></div><aside className="grid content-start gap-5"><div className="border-l-2 border-primary pl-4"><p className="eyebrow">Transparent recovery</p><h2 className="mt-2 text-base font-semibold">What happens next</h2><ol className="mt-3 grid gap-3 text-xs leading-5 text-muted-foreground"><li>1. Information and identity review</li><li>2. Inspection scope if appropriate</li><li>3. Condition and test findings recorded</li><li>4. Any offer discussed separately</li></ol></div><div className="border-t border-border pt-4"><p className="text-sm font-semibold">Please disclose known faults.</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Accurate history helps us assess safe handling and whether further inspection is suitable.</p></div></aside></div></section></main>;
}