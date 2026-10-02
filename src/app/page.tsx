import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  ExternalLink,
  Flag,
  Layers,
  Link2,
  ListChecks,
  StickyNote,
} from "lucide-react";
import { getSessionUserId } from "@/lib/session";
import { AuthButtons, SignupCta } from "@/components/auth/AuthButtons";
import { LogoReveal } from "@/components/LogoReveal";
import { RocketBackground } from "@/components/RocketBackground";

// Stage colours borrowed from the dashboard
const STAGES = [
  { label: "Applied", pill: "bg-[#d9f0e1] text-emerald-800", dot: "bg-emerald-500" },
  { label: "Interviewing", pill: "bg-[#fef3c7] text-amber-800", dot: "bg-amber-500" },
  { label: "Offered", pill: "bg-[#dbeafe] text-blue-800", dot: "bg-blue-500" },
  { label: "Rejected", pill: "bg-rose-100 text-rose-800", dot: "bg-rose-500" },
];

const STEPS = [
  { n: "01", title: "Apply", body: "Add each job you send out, with the company, role and link." },
  { n: "02", title: "Track", body: "Move it through Applied, Interviewing, Offered or Rejected." },
  { n: "03", title: "Move forward", body: "See what needs attention next and stay on top of follow-ups." },
];

const FEATURES = [
  { icon: ListChecks, title: "Application tracking", body: "Every role you applied to, in one list you can scan in seconds." },
  { icon: CalendarDays, title: "Interview dates", body: "Note when each interview is so you never walk in unprepared." },
  { icon: Layers, title: "Application stages", body: "Applied, Interviewing, Offered or Rejected, and filter by any of them." },
  { icon: Link2, title: "Job links", body: "Keep the posting one click away instead of buried in an old email." },
  { icon: Flag, title: "Priority", body: "Mark the roles you want most so they never slip down the list." },
  { icon: StickyNote, title: "Notes", body: "Jot down contacts, salary talk and anything worth remembering." },
];

// Sample rows for the product preview
const PRIORITY_STYLE: Record<string, string> = {
  High: "bg-rose-100 text-rose-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-600",
};
const PREVIEW_ROWS = [
  { position: "Frontend Developer", company: "Northwind Studio", stage: STAGES[1], priority: "High", date: "Oct 8", location: "Makati, Hybrid", salary: "₱55,000", notes: "Second interview with the team lead", link: true },
  { position: "Product Designer", company: "Lumen Health", stage: STAGES[0], priority: "Medium", date: "N/A", location: "Remote", salary: "₱48,000", notes: "Sent portfolio", link: true },
  { position: "Data Analyst", company: "Kapitan Logistics", stage: STAGES[2], priority: "High", date: "Oct 3", location: "Cebu City", salary: "₱60,000", notes: "Offer expires Oct 15", link: true },
  { position: "QA Engineer", company: "Brightpath Co.", stage: STAGES[3], priority: "Low", date: "N/A", location: "Taguig", salary: "₱42,000", notes: "Rejected after final round", link: true },
];
const PREVIEW_SUMMARY = [
  { label: "Applications", value: 8, tone: "bg-[#d9f0e1] text-emerald-800" },
  { label: "Interviews", value: 2, tone: "bg-[#fef3c7] text-amber-800" },
  { label: "Offers", value: 1, tone: "bg-[#dbeafe] text-blue-800" },
];

// PSA Labor Force Survey, unemployment rate (%) by month, 2026
const PH_RATES = [
  { month: "Feb", rate: 5.1 },
  { month: "Mar", rate: 5.0 },
  { month: "Apr", rate: 4.7 },
  { month: "May", rate: 4.8 },
  { month: "Jun", rate: 4.9 },
  { month: "Jul", rate: 6.0 },
];
const PH_CHART_MAX = 6.5;

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight text-balance"
    >
      {children}
    </h2>
  );
}

export default async function Home({ searchParams }: PageProps<"/">) {
  if (await getSessionUserId()) redirect("/dashboard");
  const { auth } = await searchParams;
  const initialMode = auth === "login" || auth === "signup" ? auth : null;

  return (
    <div className="relative min-h-screen bg-[#faf7f2] font-mono text-slate-800">
      <RocketBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        <header className="flex items-center justify-between gap-3 py-5">
          <Link href="/" className={`text-xl font-bold tracking-tight text-slate-900 ${focusRing}`}>
            Jobbie
          </Link>
          <AuthButtons initialMode={initialMode} />
        </header>

        <main>
          {/* Hero */}
          <section className="min-h-[calc(100svh-5rem)] pb-16 grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05] text-balance">
                Every application, <span className="text-[#e8791a]">one clear list.</span>
              </h1>
              <p className="mt-6 text-sm sm:text-base leading-relaxed text-slate-600 max-w-[48ch]">
                Jobbie keeps your job search organized. Track applications, interviews, offers,
                and job links in one place.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <SignupCta>Start Tracking</SignupCta>
                <a
                  href="#how-it-works"
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors ${focusRing}`}
                >
                  See how it works
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
              <ul aria-label="Application stages" className="mt-10 flex flex-wrap gap-2 text-[11px] font-semibold">
                {STAGES.map((st) => (
                  <li key={st.label} className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 ${st.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </li>
                ))}
              </ul>
            </div>
            <LogoReveal />
          </section>

          {/* How it works */}
          <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-6 py-16 lg:py-24">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#e8791a]">How it works</p>
              <div className="mt-3">
                <SectionTitle id="how-title">Three steps, no spreadsheet.</SectionTitle>
              </div>
            </div>
            <ol className="mt-12 grid md:grid-cols-3 gap-5">
              {STEPS.map((s) => (
                <li key={s.n} className="bg-[#f5ebe6] border border-[#e8d8ce] rounded-2xl p-6 shadow-sm">
                  <span className="text-3xl font-bold text-[#ff9433]">{s.n}</span>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{s.body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Product preview */}
          <section aria-labelledby="preview-title" className="py-16 lg:py-24">
            <div className="text-center">
              <SectionTitle id="preview-title">Everything you need, at a glance.</SectionTitle>
            </div>
            <div
              role="img"
              aria-label="Preview of the Jobbie dashboard with summary counts and an application tracker table listing four sample applications by position, company, stage, priority and interview date."
              className="mt-12 bg-white border border-[#e8d8ce] rounded-2xl shadow-xl overflow-hidden"
            >
              <div aria-hidden="true">
                <div className="flex items-center gap-1.5 px-4 py-3 bg-[#f5ebe6] border-b border-[#e8d8ce]">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                  <span className="ml-3 text-[11px] text-slate-500">Jobbie / Dashboard</span>
                </div>
                <div className="p-4 sm:p-6 bg-[#faf7f2] space-y-4">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {PREVIEW_SUMMARY.map((s) => (
                      <div
                        key={s.label}
                        className={`rounded-xl px-3 py-3 sm:px-4 sm:py-4 ${s.tone}`}
                      >
                        <div className="text-2xl sm:text-3xl font-bold leading-none">{s.value}</div>
                        <div className="mt-1.5 text-[10px] sm:text-xs font-semibold">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#f5ebe6] border border-[#e8d8ce] rounded-xl p-3 sm:p-4 text-left">
                    <div className="text-base font-bold text-slate-900">Application tracker</div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                      <span className="px-2.5 py-1 rounded-md border bg-white border-slate-300 font-semibold">
                        All applications
                      </span>
                      {STAGES.map((st) => (
                        <span key={st.label} className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${st.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full min-w-[56rem] text-left text-xs border-collapse">
                        <thead>
                          <tr className="text-slate-400 border-b border-[#e8d8ce]/60">
                            <th className="py-2 px-3 font-normal">Position</th>
                            <th className="py-2 px-3 font-normal">Company Name</th>
                            <th className="py-2 px-3 font-normal">Stage</th>
                            <th className="py-2 px-3 font-normal">Priority</th>
                            <th className="py-2 px-3 font-normal">Interview Date</th>
                            <th className="py-2 px-3 font-normal">Location</th>
                            <th className="py-2 px-3 font-normal">Salary</th>
                            <th className="py-2 px-3 font-normal">Notes</th>
                            <th className="py-2 px-3 font-normal">Job Link</th>
                          </tr>
                        </thead>
                        <tbody>
                          {PREVIEW_ROWS.map((r) => (
                            <tr key={r.company}>
                              <td className="py-3 px-3 font-bold text-slate-900">{r.position}</td>
                              <td className="py-3 px-3 text-slate-700">{r.company}</td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${r.stage.pill}`}>
                                  {r.stage.label.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${PRIORITY_STYLE[r.priority]}`}>
                                  {r.priority}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-500">{r.date}</td>
                              <td className="py-3 px-3 text-slate-700">{r.location}</td>
                              <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                                {r.salary || <span className="text-slate-300">—</span>}
                              </td>
                              <td className="py-3 px-3 text-slate-600 max-w-[14rem] truncate">
                                {r.notes || <span className="text-slate-300">—</span>}
                              </td>
                              <td className="py-3 px-3">
                                {r.link ? (
                                  <span className="inline-flex items-center gap-1 text-slate-600 underline underline-offset-2">
                                    Link <ExternalLink className="w-3 h-3" />
                                  </span>
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section aria-labelledby="features-title" className="py-16 lg:py-24">
            <div className="text-center">
              <SectionTitle id="features-title">Built for the way job hunting works.</SectionTitle>
            </div>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="bg-white/70 border border-[#e8d8ce] rounded-2xl p-6 hover:bg-white hover:shadow-md transition-all"
                >
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-[#ffe9d1] text-[#c2610f]">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why it matters: unemployment in the Philippines */}
          <section aria-labelledby="why-title" className="py-16 lg:py-24 grid lg:grid-cols-[1fr_minmax(0,26rem)] gap-10 lg:gap-16 items-center">
            <div>
              <h2
                id="why-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight max-w-[22ch] text-balance"
              >
                Millions of Filipinos are looking for work right now.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-slate-700 max-w-[56ch]">
                In July 2026 the unemployment rate in the Philippines reached{" "}
                <strong className="text-slate-900">6.0%</strong>, about{" "}
                <strong className="text-slate-900">3.14 million people</strong> without a job. A
                year earlier it was 5.3%. It is the highest rate in more than four years, and much
                of the rise came from fresh graduates starting their job search.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 max-w-[56ch]">
                When you are sending out this many applications, it is easy to lose track of who you
                contacted and when to follow up. That is why Jobbie exists: one place for unemployed
                jobseekers to keep every application, its stage, the interview date and the job
                link, so you can spend your energy on the search instead of remembering it.
              </p>
            </div>

            <figure className="bg-[#f5ebe6] border border-[#e8d8ce] rounded-xl p-5 shadow-sm">
              <figcaption className="text-xs font-bold text-slate-900">
                Unemployment rate in the Philippines, 2026
              </figcaption>
              <div
                role="img"
                aria-label={`Unemployment rate by month: ${PH_RATES.map((r) => `${r.month} ${r.rate.toFixed(1)} percent`).join(", ")}.`}
                className="mt-5 flex items-end gap-2 sm:gap-3 h-44 border-b border-[#d9c7b9]"
              >
                {PH_RATES.map((r) => {
                  const latest = r.month === "Jul";
                  return (
                    <div
                      key={r.month}
                      aria-hidden="true"
                      className="flex-1 h-full flex flex-col justify-end items-center gap-1"
                    >
                      <span className={`text-[11px] ${latest ? "font-bold text-slate-900" : "text-slate-500"}`}>
                        {r.rate.toFixed(1)}%
                      </span>
                      <div
                        className={`w-full rounded-t-md ${latest ? "bg-[#ff9433]" : "bg-[#d3bc9d]"}`}
                        style={{ height: `${(r.rate / PH_CHART_MAX) * 82}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div aria-hidden="true" className="mt-2 flex gap-2 sm:gap-3">
                {PH_RATES.map((r) => (
                  <span key={r.month} className="flex-1 text-center text-[11px] text-slate-500">
                    {r.month}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
                Source:{" "}
                <a
                  href="https://psa.gov.ph/statistics/labor-force-survey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline underline-offset-2 hover:text-slate-800 ${focusRing}`}
                >
                  Philippine Statistics Authority, Labor Force Survey
                </a>
                .
              </p>
            </figure>
          </section>

          {/* Closing illustration + final CTA */}
          <section
            aria-labelledby="cta-title"
            className="my-16 lg:my-24 rounded-3xl bg-[#f5ebe6] border border-[#e8d8ce] px-6 py-14 sm:py-20 text-center shadow-sm"
          >
            <Image
              src="/logo.png"
              alt=""
              width={160}
              height={160}
              className="mx-auto w-28 h-28 sm:w-36 sm:h-36 object-contain"
            />
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-[#e8791a]">
              Your job search, without the mess.
            </p>
            <h2
              id="cta-title"
              className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance"
            >
              Ready for your next opportunity?
            </h2>
            <div className="mt-8">
              <SignupCta>Get Started</SignupCta>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#e8d8ce] py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <span className="font-bold text-slate-700">Jobbie</span>
          <span>Your job search companion.</span>
        </footer>
      </div>
    </div>
  );
}
