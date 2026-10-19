import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, ChevronLeft, ChevronRight, FileText, LockKeyhole, ShieldCheck, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuote } from "@/components/site/quote-context";
import { formatQuantity } from "@/lib/lampros-data";
import { hasValidFileSignature, intakeFileSchema, isAllowedFile, type IntakeFile } from "@/lib/intake-schema";
import { supabase } from "@/integrations/supabase/client";
import { submitLamprosInquiry } from "@/lib/intake.functions";

type InquiryKind = "quote" | "audit" | "loan" | "trade-in";
type Sector = "Residential" | "Commercial" | "Industrial";

const sharedInput = "field-control";
const helpCopy: Record<InquiryKind, { title: string; button: string; done: string }> = {
  quote: { title: "A quote shaped around the project", button: "Send quote request", done: "Your quote request is in. Our team will review your item list and project details." },
  audit: { title: "Start your energy review", button: "Request audit estimate", done: "Your estimate details have been received. We’ll prepare an assessment scope." },
  loan: { title: "Build your assessment file", button: "Submit for assessment", done: "Your assessment file has been received for preliminary review." },
  "trade-in": { title: "Tell us about your equipment", button: "Request inspection review", done: "Your equipment information has been received for a sourcing review." },
};

function Field({ id, label, children, required, hint }: { id: string; label: string; children: React.ReactNode; required?: boolean; hint?: string }) {
  return <div className="grid gap-2"><Label htmlFor={id}>{label}{required && <span className="ml-1 text-primary">*</span>}</Label>{children}{hint && <p className="text-xs text-muted-foreground">{hint}</p>}</div>;
}

function ContactFields({ prefix, values, setValue }: { prefix: string; values: { name: string; organization: string; email: string; phone: string; location: string; energyLoadKw: string }; setValue: (key: "name" | "organization" | "email" | "phone" | "location" | "energyLoadKw", value: string) => void }) {
  const field = (key: keyof typeof values, label: string, type: string, placeholder: string, required = true) => (
    <Field id={`${prefix}-${key}`} label={label} required={required}>
      <Input className={sharedInput} id={`${prefix}-${key}`} name={key} type={type} required={required} maxLength={key === "organization" ? 120 : 160} placeholder={placeholder} value={values[key]} onChange={(event) => setValue(key, event.target.value)} />
    </Field>
  );
  return <div className="grid gap-5 sm:grid-cols-2">{field("name", "Full name", "text", "Your name")}{field("organization", "Organization", "text", "Company or institution", false)}{field("email", "Work email", "email", "you@company.com")}{field("phone", "Phone number", "tel", "+234 …")}{field("location", "Project location", "text", "City, state and country")}{field("energyLoadKw", "Estimated power load", "number", "e.g. 75", true)}</div>;
}

function cleanDocuments(files: IntakeFile[]) {
  return files.map((file) => intakeFileSchema.parse(file));
}

export function IntakeForm({ kind, description, legal }: { kind: InquiryKind; description?: string; legal?: boolean }) {
  const saveInquiry = useServerFn(submitLamprosInquiry);
  const quote = useQuote();
  const [values, setValues] = useState({ name: "", organization: "", email: "", phone: "", location: "", energyLoadKw: "", monthlyPowerCost: "", monthlyPowerCurrency: "NGN" as "NGN" | "USD" | "GBP" | "EUR", outageFrequency: "", sector: "" as Sector | "", details: "" });
  const [fileItems, setFileItems] = useState<{ file: File; category?: IntakeFile["category"] }[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [requestConfirmed, setRequestConfirmed] = useState(false);
  const [documentsConfirmed, setDocumentsConfirmed] = useState(false);
  const [loanFiles, setLoanFiles] = useState<Record<string, File[]>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const setValue = (key: keyof typeof values, value: string) => setValues((previous) => ({ ...previous, [key]: value }));
  const addFiles = async (incoming: FileList | null, category?: IntakeFile["category"]) => {
    if (!incoming?.length) return;
    const good: { file: File; category?: IntakeFile["category"] }[] = [];
    for (const file of Array.from(incoming)) {
      if (!await hasValidFileSignature(file)) {
        setError(`${file.name}: use a valid PDF, JPG, PNG, or WebP file under 10 MB.`);
        continue;
      }
      if (fileItems.length + good.length >= 8) {
        setError("A maximum of eight documents can be attached.");
        break;
      }
      good.push({ file, category });
    }
    if (good.length) setFileItems((previous) => [...previous, ...good]);
  };

  const changeLoanFiles = async (category: string, event: ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? []);
    const accepted: File[] = [];
    for (const file of incoming) {
      if (await hasValidFileSignature(file)) accepted.push(file);
      else setError(`${file.name}: use a valid PDF, JPG, PNG, or WebP file under 10 MB.`);
    }
    const nextCount = Object.values(loanFiles).reduce((total, list) => total + list.length, 0) + accepted.length;
    if (nextCount > 8) { setError("A maximum of eight documents can be attached."); return; }
    setLoanFiles((previous) => ({ ...previous, [category]: [...(previous[category] ?? []), ...accepted] }));
  };

  async function uploadFiles(): Promise<IntakeFile[]> {
    const files = kind === "loan"
      ? Object.entries(loanFiles).flatMap(([category, list]) => list.map((file) => ({ file, category: category as IntakeFile["category"] })))
      : fileItems;
    const uploaded: IntakeFile[] = [];
    for (const entry of files) {
      const suffix = entry.file.type === "application/pdf" ? "pdf" : entry.file.type === "image/jpeg" ? "jpg" : entry.file.type === "image/png" ? "png" : "webp";
      const storagePath = `${crypto.randomUUID()}.${suffix}`;
      const { error: uploadError } = await supabase.storage.from("lampros-assessment-files").upload(storagePath, entry.file, {
        contentType: entry.file.type,
        cacheControl: "0",
        upsert: false,
      });
      if (uploadError) throw new Error(`We couldn't attach ${entry.file.name}. Please try that file again.`);
      uploaded.push({ name: entry.file.name, storagePath, type: entry.file.type as IntakeFile["type"], size: entry.file.size, ...(entry.category ? { category: entry.category } : {}) });
    }
    return cleanDocuments(uploaded);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (kind === "quote" && !quote.items.length) { setError("Add at least one product before requesting a quote."); return; }
    if (kind === "audit" && (!values.monthlyPowerCost || !values.outageFrequency || !values.sector)) { setError("Please complete all energy use fields."); return; }
    if (values.name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !/^\+?[0-9().\s-]{7,32}$/.test(values.phone) || values.location.trim().length < 2 || !Number.isFinite(Number(values.energyLoadKw)) || Number(values.energyLoadKw) <= 0) {
      setError("Enter a valid name, email, phone number, project location and positive estimated power load.");
      return;
    }
    if (kind === "loan" && !documentsConfirmed) { setError("Confirm that you are authorized to share these documents before submitting."); return; }
    setSubmitting(true);
    try {
      const files = await uploadFiles();
      await saveInquiry({ data: {
        inquiryType: kind,
        name: values.name,
        organization: values.organization,
        email: values.email,
        phone: values.phone,
        location: values.location,
        energyLoadKw: Number(values.energyLoadKw),
        monthlyPowerCost: values.monthlyPowerCost ? Number(values.monthlyPowerCost) : undefined,
        outageFrequency: values.outageFrequency || undefined,
        sector: values.sector || undefined,
        details: kind === "audit" ? `Monthly power cost currency: ${values.monthlyPowerCurrency}\n\n${values.details}` : values.details,
        items: quote.items.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity })),
        files,
      } });
      setSubmitted(true);
      if (kind === "quote") quote.clear();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  const removeLoanFile = (category: string, index: number) => setLoanFiles((previous) => ({ ...previous, [category]: (previous[category] ?? []).filter((_, fileIndex) => fileIndex !== index) }));
  const isWizard = kind === "loan";
  const fileCategories = ["equipment specifications", "energy requirements", "project cost estimates", "financing paperwork"] as const;

  if (submitted) return (
    <div className="photo-frame border-primary/30 p-8 sm:p-10" role="status">
      <span className="mb-5 grid size-12 place-items-center rounded-full bg-primary/15 text-primary"><Check className="size-6" /></span>
      <p className="eyebrow">{kind === "audit" ? "Estimation received" : kind === "loan" ? "Preliminary file received" : "Request received"}</p>
      <h2 className="mt-2 text-2xl font-semibold">{kind === "audit" ? "Estimation received — preparing your assessment scope." : kind === "loan" ? "Your assessment is ready for review." : "Thank you. We’ve got it."}</h2>
      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{helpCopy[kind].done}</p>
      {kind === "loan" && <p className="mt-4 inline-flex items-center gap-2 text-xs text-primary"><LockKeyhole className="size-4" /> Your documents are stored privately.</p>}
    </div>
  );

  const formContent = (
    <form onSubmit={handleSubmit} className="grid gap-8" noValidate>
      {isWizard && <div className="grid grid-cols-3 border-b border-border pb-5">{["Organization", "Project", "Documents"].map((title, index) => <div key={title} className={`flex items-center gap-2 text-xs font-semibold sm:text-sm ${step >= index + 1 ? "text-primary" : "text-muted-foreground"}`}><span className="grid size-7 place-items-center rounded-full border border-current">{step > index + 1 ? <Check className="size-4" /> : index + 1}</span>{title}</div>)}</div>}
      {(!isWizard || step === 1) && <section className="grid gap-5"><div><h2 className="text-lg font-semibold">{isWizard ? "Organization and primary contact" : "Contact and project information"}</h2><p className="mt-1 text-sm text-muted-foreground">Please provide accurate details so our engineering team can assess your request.</p></div><ContactFields prefix={kind} values={values} setValue={setValue} /></section>}

      {(!isWizard && kind === "quote") && <section className="grid gap-4 border-t border-border pt-6"><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Requested supplies</h2><span className="text-sm text-muted-foreground">{quote.count} units</span></div>{quote.items.length ? quote.items.map((item) => <div key={item.id} className="flex items-center justify-between border-b border-border py-3 text-sm"><span>{item.name}</span><span className="text-muted-foreground">Qty {formatQuantity(item.quantity)}</span></div>) : <p className="text-sm text-primary">Your quote list is empty. Browse the catalogue and add the products you need.</p>}<p className="text-xs leading-5 text-muted-foreground">Final quantities, freight and project specifications are confirmed directly with our team—no online payment is taken.</p></section>}

      {kind === "audit" && <section className="grid gap-5 border-t border-border pt-6"><div><h2 className="text-lg font-semibold">Energy use and operating conditions</h2><p className="mt-1 text-sm text-muted-foreground">These figures help us scope a practical, site-aware review.</p></div><div className="grid gap-5 sm:grid-cols-2"><Field id="audit-sector" label="Sector" required><select className={sharedInput} id="audit-sector" value={values.sector} onChange={(event) => setValue("sector", event.target.value)} required><option value="">Select a sector</option><option>Residential</option><option>Commercial</option><option>Industrial</option></select></Field><Field id="audit-cost" label="Estimated monthly power cost" required><Input className={sharedInput} id="audit-cost" type="number" min="1" max="10000000000" placeholder="e.g. 450000" value={values.monthlyPowerCost} onChange={(event) => setValue("monthlyPowerCost", event.target.value)} required /></Field><Field id="audit-outages" label="Primary power outage frequency" required><select className={sharedInput} id="audit-outages" value={values.outageFrequency} onChange={(event) => setValue("outageFrequency", event.target.value)} required><option value="">Select frequency</option><option>Rarely</option><option>Several times a month</option><option>Several times a week</option><option>Daily or near-daily</option></select></Field><Field id="audit-currency" label="Currency for power-cost estimate" required><select className={sharedInput} id="audit-currency" value={values.monthlyPowerCurrency} onChange={(event) => setValue("monthlyPowerCurrency", event.target.value as typeof values.monthlyPowerCurrency)}><option>NGN</option><option>USD</option><option>GBP</option><option>EUR</option></select></Field></div><Field id="audit-notes" label="Operating notes" hint="For example: generator hours, shift patterns, major machinery, or any critical circuits."><Textarea className={`${sharedInput} min-h-28`} id="audit-notes" maxLength={4000} value={values.details} onChange={(event) => setValue("details", event.target.value)} placeholder="A little about how your facility uses power…" /></Field><p className="text-xs text-muted-foreground">An estimate helps scope a review. It is not a savings guarantee, loan offer or final engineering proposal.</p></section>}

      {isWizard && step === 2 && <section className="grid gap-5"><div><h2 className="text-lg font-semibold">Energy requirements and project scope</h2><p className="mt-1 text-sm text-muted-foreground">Describe intended use and the project’s current technical stage.</p></div><div className="grid gap-5 sm:grid-cols-2"><Field id="loan-sector" label="Sector"><select className={sharedInput} id="loan-sector" value={values.sector} onChange={(event) => setValue("sector", event.target.value)}><option value="">Select</option><option>Residential</option><option>Commercial</option><option>Industrial</option></select></Field><Field id="loan-monthly" label="Estimated monthly power cost"><Input className={sharedInput} id="loan-monthly" type="number" min="0" max="10000000000" value={values.monthlyPowerCost} onChange={(event) => setValue("monthlyPowerCost", event.target.value)} placeholder="Amount and currency" /></Field></div><Field id="loan-details" label="Energy requirements and project cost estimate" required><Textarea className={`${sharedInput} min-h-36`} id="loan-details" required minLength={10} maxLength={4000} value={values.details} onChange={(event) => setValue("details", event.target.value)} placeholder="Required system capacity, essential loads, intended equipment, available project budget and requested assessment…" /></Field><p className="text-xs text-muted-foreground">Provide the amount and currency for any budget figures. Project financing is subject to institutional assessment.</p></section>}

      {kind === "trade-in" && <section className="grid gap-5 border-t border-border pt-6"><div><h2 className="text-lg font-semibold">Equipment details</h2><p className="mt-1 text-sm text-muted-foreground">Clear specifications support a transparent first review.</p></div><Field id="trade-details" label="Equipment description, condition and known faults" required><Textarea className={`${sharedInput} min-h-36`} id="trade-details" required minLength={10} maxLength={4000} value={values.details} onChange={(event) => setValue("details", event.target.value)} placeholder="Type, make, model, kVA rating, year, hours, service history and known issues…" /></Field><div><Label htmlFor="trade-files">Attach recent equipment photographs or a condition report</Label><input ref={fileRef} id="trade-files" className="sr-only" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" multiple onChange={(event) => addFiles(event.target.files)} /><Button type="button" variant="outline" className="mt-3 w-full sm:w-auto" onClick={() => fileRef.current?.click()}><UploadCloud /> Attach equipment documents</Button>{fileItems.length > 0 && <p className="mt-2 text-xs text-muted-foreground">{fileItems.map(({ file }) => file.name).join(", ")}</p>}<p className="mt-2 text-xs text-muted-foreground">PDF, JPG, PNG or WebP · up to 10 MB each · stored privately</p></div></section>}

      {isWizard && step === 3 && <section className="grid gap-5"><div><h2 className="text-lg font-semibold">Documents for institutional review</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Attach the project documents available to you. Missing items can be discussed during the preliminary review.</p></div><div className="grid gap-4">{fileCategories.map((category) => <div key={category} className="border border-border p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold capitalize">{category}</p><p className="mt-1 text-xs text-muted-foreground">PDF or image · up to 10 MB</p></div><label className="inline-flex min-h-10 cursor-pointer items-center gap-2 border border-input px-3 text-xs font-semibold hover:bg-accent"><UploadCloud className="size-4" /> Browse files<input className="sr-only" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" multiple onChange={(event) => changeLoanFiles(category, event)} /></label></div>{(loanFiles[category] ?? []).length > 0 && <ul className="mt-3 grid gap-2">{loanFiles[category]?.map((file, index) => <li key={`${file.name}-${file.size}-${index}`} className="flex items-center gap-2 text-xs text-muted-foreground"><FileText className="size-4 shrink-0 text-primary" /><span className="min-w-0 flex-1 truncate">{file.name}</span><span>{(file.size / 1024 / 1024).toFixed(1)} MB</span><Button variant="ghost" size="icon" className="size-8" type="button" aria-label={`Remove ${file.name}`} onClick={() => removeLoanFile(category, index)}><X className="size-4" /></Button></li>)}</ul>}</div>)}</div><div className="border border-border p-4"><p className="flex items-center gap-2 text-sm font-semibold"><LockKeyhole className="size-4 text-primary" /> Protected document handling</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Files are submitted over an encrypted connection and stored in a private project file area. Do not upload bank login credentials, card details, or unrelated identity documents.</p></div><label className="flex items-start gap-3 text-sm leading-6"><input required type="checkbox" className="mt-1 size-4 accent-primary" />I confirm I’m authorized to share these documents for preliminary assessment. I understand this intake is not a credit decision, loan commitment, engineering certification or binding offer. Any scope, financing, warranty or commercial terms require separate written confirmation from the relevant parties.</label></section>}

      {!isWizard && kind !== "audit" && kind !== "trade-in" && <Field id="quote-notes" label="Project specifications or delivery notes" hint="List preferred specifications, quantities, timeline or delivery requirements."><Textarea className={`${sharedInput} min-h-24`} id="quote-notes" maxLength={4000} value={values.details} onChange={(event) => setValue("details", event.target.value)} placeholder="What should our sourcing team know?" /></Field>}

      {isWizard && step === 1 && <label className="flex items-start gap-3 text-sm leading-6"><input required checked={requestConfirmed} onChange={(event) => setRequestConfirmed(event.target.checked)} type="checkbox" className="mt-1 size-4 accent-primary" />I confirm that my organization has authorized this preliminary project assessment request and the information provided is accurate.</label>}
      {legal && kind !== "loan" && <p className="border-l-2 border-primary pl-4 text-xs leading-5 text-muted-foreground">Submitting details requests a preliminary scope only. It does not promise a specific outcome, equipment availability, savings, warranty, project financing or approval. A separate written agreement governs any work.</p>}

      {error && <p role="alert" className="border border-primary/40 bg-primary/5 px-4 py-3 text-sm text-primary">{error}</p>}
      {isWizard ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          {step > 1 ? <Button type="button" variant="outline" onClick={() => { setError(""); setStep((current) => current - 1); }}><ChevronLeft /> Previous</Button> : <span className="text-xs text-muted-foreground"><span className="text-primary">*</span> Required</span>}
          {step < 3 ? <Button type="button" onClick={() => { if (step === 1 && (!requestConfirmed || values.name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !/^\+?[0-9().\s-]{7,32}$/.test(values.phone) || values.location.trim().length < 2 || !Number.isFinite(Number(values.energyLoadKw)) || Number(values.energyLoadKw) <= 0)) { setError("Complete the required contact and load details and confirm your organization’s authorization."); return; } if (step === 2 && values.details.trim().length < 10) { setError("Add a project description of at least 10 characters before continuing."); return; } setError(""); setStep((current) => current + 1); }} >Continue <ChevronRight /></Button> : <Button type="submit" disabled={submitting}>{submitting ? "Submitting securely…" : helpCopy[kind].button} <ShieldCheck /></Button>}
        </div>
      ) : (
        <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"><span className="text-xs text-muted-foreground"><span className="text-primary">*</span> Required · Your details are used to review this request.</span><Button type="submit" disabled={submitting} className="w-full sm:w-auto">{submitting ? "Sending securely…" : helpCopy[kind].button}<ChevronRight /></Button></div>
      )}
      {kind === "loan" && <p className="inline-flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-4 shrink-0 text-primary" />Accepted: PDF, JPG, PNG or WebP. Each file must be under 10 MB; up to eight documents per assessment.</p>}
    </form>
  );

  return <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-10">
    <div className="photo-frame p-5 sm:p-8">{description && <p className="mb-6 text-sm leading-6 text-muted-foreground">{description}</p>}{formContent}</div>
    <aside className="grid content-start gap-5">
      <div className="border-l-2 border-primary pl-4"><p className="eyebrow">{kind === "loan" ? "Evaluation portal" : kind === "audit" ? "Audit scope" : "Direct review"}</p><h2 className="mt-2 text-base font-semibold">{helpCopy[kind].title}</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">{kind === "loan" ? "A structured intake supports a clearer review of the equipment, load, project cost and available documentation." : kind === "audit" ? "Power use, outage patterns and operating context make the estimate more useful." : kind === "quote" ? "Our sourcing team reviews the equipment list, project context and delivery requirements before sharing a quote." : "Transparent equipment history supports a more useful first conversation."}</p></div>
      <div className="border-t border-border pt-5"><p className="flex items-center gap-2 text-xs font-semibold"><ShieldCheck className="size-4 text-primary" /> Information protection</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Required fields are validated before submission. Loan documents remain private to the business.</p></div>
    </aside>
  </div>;
}