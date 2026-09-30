import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import { AuthButtons } from "@/components/auth/AuthButtons";
import { LogoReveal } from "@/components/LogoReveal";
import { RocketBackground } from "@/components/RocketBackground";

// Stage colours borrowed from the dashboard
const STAGES = [
  {
    label: "Applied",
    pill: "bg-[#d9f0e1] text-emerald-800",
    dot: "bg-emerald-500",
  },
  {
    label: "Interviewing",
    pill: "bg-[#fef3c7] text-amber-800",
    dot: "bg-amber-500",
  },
  { label: "Offered", pill: "bg-[#dbeafe] text-blue-800", dot: "bg-blue-500" },
  { label: "Rejected", pill: "bg-rose-100 text-rose-800", dot: "bg-rose-500" },
];

const FEATURES = [
  {
    title: "See where each application stands",
    body: "Sort every role into Applied, Interviewing, Offered or Rejected, then filter the list by stage in one click.",
  },
  {
    title: "Know what to do next",
    body: "Set a priority, note the interview date and keep the job link on the same row, so nothing gets lost in an old email.",
  },
  {
    title: "Your list stays private",
    body: "Sign up with your email and a strong password. Your applications are saved to your account and only you can open them.",
  },
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

export default async function Home({ searchParams }: PageProps<"/">) {
  if (await getSessionUserId()) redirect("/dashboard");
  const { auth } = await searchParams;
  const initialMode = auth === "login" || auth === "signup" ? auth : null;

  return (
    <div className="relative min-h-screen bg-[#faf7f2] font-mono text-slate-800">
      <RocketBackground />
      {/* Same banner the dashboard opens with */}

      <div className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between py-5">
          <Link
            href="/"
            className={`text-xl font-bold tracking-tight text-slate-900 ${focusRing}`}
          >
            Jobbie
          </Link>
          <AuthButtons initialMode={initialMode} />
        </header>

        <main>
          <section className="min-h-[calc(100svh-5rem)] pt-14 lg:pt-0 pb-14 grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-14 items-center">
            {/* 4.5rem = width of the "Jobbie" wordmark (6 mono chars at text-xl), so the text starts where it ends */}
            <div className="sm:pl-[4.5rem]">
              <h1 className="sm:ml-10 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1] max-w-[18ch] text-balance">
                Every application, one clear list.
              </h1>
              <p className="mt-5 sm:ml-10 text-sm leading-relaxed text-slate-600 max-w-[52ch]">
                Jobbie keeps your job search in one place. Add each role, track
                its stage, and keep interview dates and job links right where
                you can see them.
              </p>
              <ul
                aria-label="Application stages"
                className="mt-6 sm:ml-10 flex flex-wrap gap-2 text-[11px] font-semibold"
              >
                {STAGES.map((st) => (
                  <li
                    key={st.label}
                    className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 ${st.pill}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </li>
                ))}
              </ul>
              <a
                href="#about"
                className="mt-8 sm:ml-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                About Jobbie
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
            <LogoReveal />
          </section>

          {/* Same side margins as the hero: left = headline start (4.5rem + 2.5rem), right = logo's edge */}
          <section id="about" className="scroll-mt-6 pt-12 lg:pt-16 pb-24 sm:pl-28 lg:pr-16">
            <div className="flex items-center gap-5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                ABOUT
              </h2>
              <hr className="flex-1 border-0 h-0.5 rounded-full bg-[#d9c7b9]" />
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-8">
              {FEATURES.map((f) => (
                <div key={f.title}>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Why it matters: unemployment in the Philippines */}
            <div className="mt-20 grid lg:grid-cols-[1fr_minmax(0,26rem)] gap-10 lg:gap-16 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight max-w-[22ch] text-balance">
                  Millions of Filipinos are looking for work right now.
                </h3>
                <p className="mt-6 text-sm leading-relaxed text-slate-700 max-w-[56ch]">
                  In July 2026 the unemployment rate in the Philippines reached{" "}
                  <strong className="text-slate-900">6.0%</strong>, about{" "}
                  <strong className="text-slate-900">3.14 million people</strong> without a
                  job. A year earlier it was 5.3%. It is the highest rate in more than four
                  years, and much of the rise came from fresh graduates starting their job
                  search.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 max-w-[56ch]">
                  When you are sending out this many applications, it is easy to lose track
                  of who you contacted and when to follow up. That is why Jobbie exists: one
                  place for unemployed jobseekers to keep every application, its stage,
                  the interview date and the job link, so you can spend your energy on the
                  search instead of remembering it.
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
            </div>
          </section>
        </main>

        <footer className="border-t border-[#e8d8ce] py-6 text-center text-[11px] text-slate-500">
          Jobbie, your job search companion.
        </footer>
      </div>
    </div>
  );
}
