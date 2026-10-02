"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Trash2,
  Pencil,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Briefcase,
  CalendarDays,
  PartyPopper,
  Star,
  Eye,
} from "lucide-react";
import { AddApplicationModal, EditApplicationModal } from "@/components/ui/AddApplicationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { JobApplication, JobStatus, JobPriority } from "@/types/job";

type SortKey = "position" | "company" | "stage" | "priority" | "interviewDate" | "location" | "salary" | "notes";
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

const STAGE_ORDER: Record<JobStatus, number> = {
  APPLIED: 0,
  SHORTLISTED: 1,
  INTERVIEWING: 2,
  OFFERED: 3,
  REJECTED: 4,
};
const PRIORITY_ORDER: Record<JobPriority, number> = { Low: 0, Medium: 1, High: 2 };

const SORT_COLUMNS: { key: SortKey; label: string }[] = [
  { key: "position", label: "Position" },
  { key: "company", label: "Company Name" },
  { key: "stage", label: "Stage" },
  { key: "priority", label: "Priority" },
  { key: "salary", label: "Salary" },
  { key: "interviewDate", label: "Interview Date" },
  { key: "location", label: "Location" },
  { key: "notes", label: "Notes" },
];

/** What a row is compared by for a column; null means blank (sorted last). */
function sortValue(job: JobApplication, key: SortKey): string | number | null {
  switch (key) {
    case "stage":
      return STAGE_ORDER[job.stage];
    case "priority":
      return PRIORITY_ORDER[job.priority ?? "Medium"];
    case "interviewDate": {
      const t = job.interviewDate ? new Date(job.interviewDate).getTime() : NaN;
      return Number.isNaN(t) ? null : t;
    }
    case "salary": {
      const n = parseInt((job.salary ?? "").replace(/\D/g, ""), 10);
      return Number.isNaN(n) ? null : n;
    }
    default:
      return job[key]?.trim().toLowerCase() || null;
  }
}

export default function Dashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | JobStatus>("ALL");
  const [sort, setSort] = useState<SortState>(null);
  const [name, setName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [deleting, setDeleting] = useState<JobApplication | null>(null);
  const [viewing, setViewing] = useState<JobApplication | null>(null);

  // Load this user's applications from the database
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/jobs");
        if (res.status === 401) return router.replace("/?auth=login");
        const data = await res.json();
        setJobs(data.jobs);
        setName(data.name ?? "");
      } catch {
        setError("Couldn't load your applications. Refresh to try again.");
      }
      setIsLoaded(true);
    })();
  }, [router]);

  const handleAddJob = async (newJob: JobApplication) => {
    setError("");
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });
    if (!res.ok) return setError("Couldn't save that application. Try again.");
    const { job } = await res.json();
    setJobs((prev) => [job, ...prev]);
  };

  const handleEdit = async (updated: JobApplication) => {
    setError("");
    const res = await fetch(`/api/jobs/${updated.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!res.ok) return setError("Couldn't save your changes. Try again.");
    const { job } = await res.json();
    setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    setError("");
    setDeleting(null);
    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (!res.ok) return setError("Couldn't delete that application. Try again.");
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  // Click a header to sort ascending, again for descending, a third time to clear
  const toggleSort = (key: SortKey) =>
    setSort((cur) =>
      cur?.key !== key ? { key, dir: "asc" } : cur.dir === "asc" ? { key, dir: "desc" } : null
    );

  const filteredJobs = jobs
    .filter((job) => (activeTab === "ALL" ? true : job.stage === activeTab))
    .sort((a, b) => {
      if (!sort) return 0;
      const x = sortValue(a, sort.key);
      const y = sortValue(b, sort.key);
      if (x === null || y === null) return x === y ? 0 : x === null ? 1 : -1; // blanks always last
      const cmp = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
      return sort.dir === "asc" ? cmp : -cmp;
    });

  const countOf = (stage: JobStatus) => jobs.filter((j) => j.stage === stage).length;

  // Interviews dated today or later, soonest first
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const upcoming = jobs
    .filter((j) => j.stage !== "REJECTED" && j.interviewDate)
    .map((j) => ({ job: j, time: new Date(j.interviewDate!).getTime() }))
    .filter(({ time }) => !Number.isNaN(time) && time >= startOfToday)
    .sort((a, b) => a.time - b.time)
    .slice(0, 4);
  const priorityJobs = jobs.filter((j) => j.priority === "High" && j.stage !== "REJECTED").slice(0, 4);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = name.trim().split(/\s+/)[0];

  const summary = [
    { label: "Applications", value: jobs.length, icon: Briefcase, tone: "bg-[#d9f0e1] text-emerald-800" },
    { label: "Interviews", value: countOf("INTERVIEWING"), icon: CalendarDays, tone: "bg-[#fef3c7] text-amber-800" },
    { label: "Offers", value: countOf("OFFERED"), icon: PartyPopper, tone: "bg-[#dbeafe] text-blue-800" },
  ];

  const getPriorityStyle =(priority?: JobPriority) => {
    switch (priority) {
      case "High":
        return "bg-rose-100 text-rose-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      case "Low":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStageStyle = (stage: JobStatus) => {
    switch (stage) {
      case "APPLIED":
        return "bg-[#d9f0e1] text-emerald-800";
      case "SHORTLISTED":
        return "bg-violet-100 text-violet-800";
      case "INTERVIEWING":
        return "bg-[#fef3c7] text-amber-800";
      case "OFFERED":
        return "bg-[#dbeafe] text-blue-800";
      case "REJECTED":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Prevent flash of unstyled content/mismatch during initial render
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#faf7f2] font-mono text-slate-500 text-xs flex items-center justify-center">
        Loading your applications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] font-mono text-slate-800 pb-16">
      {/* Navbar */}
      <header className="border-b border-[#e8d8ce] bg-[#faf7f2]/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-900">Jobbie</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AddApplicationModal onAddJob={handleAddJob} />
            <button
              onClick={handleLogout}
              className="text-xs px-3.5 py-2 rounded-lg border border-[#e2d5cb] text-slate-700 hover:bg-white/60 transition-colors cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        <section>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
            {greeting}
            {firstName ? `, ${firstName}` : ""}!
          </h1>
          <p className="mt-2 text-sm text-slate-600">Here&apos;s what&apos;s happening with your job search.</p>
        </section>
        {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}

        {/* Summary */}
        <section aria-label="Summary" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summary.map(({ label, value, icon: Icon, tone }) => (
            <div
              key={label}
              className="flex items-center gap-4 bg-[#f5ebe6] border border-[#e8d8ce] rounded-xl p-4 sm:p-5 shadow-sm"
            >
              <span className={`inline-flex w-11 h-11 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-3xl font-bold text-slate-900 leading-none">{value}</div>
                <div className="mt-1.5 text-xs text-slate-600">{label}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Application Tracker Card */}
        <div className="bg-[#f5ebe6] border border-[#e8d8ce] rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Application tracker</h2>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-2.5 py-1 rounded-md border transition-colors ${
                activeTab === "ALL"
                  ? "bg-white border-slate-300 font-semibold"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              All applications
            </button>
            <button
              onClick={() => setActiveTab("APPLIED")}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 border ${
                activeTab === "APPLIED"
                  ? "bg-[#d9f0e1] text-emerald-800 border-emerald-300"
                  : "bg-[#e8f3ec] text-emerald-700 border-transparent"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Applied ({jobs.filter((j) => j.stage === "APPLIED").length})
            </button>
            <button
              onClick={() => setActiveTab("SHORTLISTED")}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 border ${
                activeTab === "SHORTLISTED"
                  ? "bg-violet-100 text-violet-800 border-violet-300"
                  : "bg-violet-50 text-violet-700 border-transparent"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              Shortlisted ({countOf("SHORTLISTED")})
            </button>
            <button
              onClick={() => setActiveTab("INTERVIEWING")}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 border ${
                activeTab === "INTERVIEWING"
                  ? "bg-[#fef3c7] text-amber-800 border-amber-300"
                  : "bg-[#fef9c3] text-amber-700 border-transparent"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Interviewing ({jobs.filter((j) => j.stage === "INTERVIEWING").length})
            </button>
            <button
              onClick={() => setActiveTab("OFFERED")}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 border ${
                activeTab === "OFFERED"
                  ? "bg-[#dbeafe] text-blue-800 border-blue-300"
                  : "bg-[#eff6ff] text-blue-700 border-transparent"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Offered ({jobs.filter((j) => j.stage === "OFFERED").length})
            </button>
            <button
              onClick={() => setActiveTab("REJECTED")}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 border ${
                activeTab === "REJECTED"
                  ? "bg-rose-100 text-rose-800 border-rose-300"
                  : "bg-rose-50 text-rose-700 border-transparent"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Rejected ({countOf("REJECTED")})
            </button>
          </div>

          {/* Borderless Table View */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full min-w-[56rem] text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-[#e8d8ce]/60 pb-2">
                  {SORT_COLUMNS.map(({ key, label }) => {
                    const active = sort?.key === key;
                    const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
                    return (
                      <th
                        key={key}
                        scope="col"
                        aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                        className="py-2 px-3 font-normal"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(key)}
                          className={`inline-flex items-center gap-1 cursor-pointer hover:text-slate-800 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-slate-800/30 rounded ${
                            active ? "text-slate-900 font-semibold" : ""
                          }`}
                        >
                          {label}
                          <Icon className={`w-3 h-3 ${active ? "" : "opacity-40"}`} aria-hidden="true" />
                        </button>
                      </th>
                    );
                  })}
                  <th className="py-2 px-3 font-normal">Job Link</th>
                  <th className="py-2 px-1 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-slate-400">
                      No job applications listed yet.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-white/40 transition-colors rounded-lg group"
                    >
                      <td className="py-3 px-3 font-bold text-slate-900">{job.position}</td>
                      <td className="py-3 px-3 text-slate-700">{job.company}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${getStageStyle(
                            job.stage
                          )}`}
                        >
                          {job.stage}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${getPriorityStyle(
                            job.priority
                          )}`}
                        >
                          {job.priority || "Medium"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 whitespace-nowrap">{job.salary || <span className="text-slate-300">—</span>}</td>
                      <td className="py-3 px-3 text-slate-500">{job.interviewDate || "N/A"}</td>
                      <td className="py-3 px-3 text-slate-700">{job.location || <span className="text-slate-300">—</span>}</td>
                      <td className="py-3 px-3 text-slate-600 max-w-[14rem] truncate" title={job.notes || undefined}>
                        {job.notes || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-3 px-3">
                        {job.jobLink ? (
                          <a
                            href={job.jobLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 underline underline-offset-2"
                          >
                            Link <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-1 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            aria-label={`Actions for ${job.position} at ${job.company}`}
                            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white/70 data-popup-open:bg-white/70 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-slate-800/30"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-auto min-w-36 bg-white border border-[#e2d5cb] rounded-xl font-mono text-xs shadow-lg"
                          >
                            <DropdownMenuItem
                              className="rounded-lg px-2.5 py-1.5 text-xs cursor-pointer"
                              onClick={() => setEditing(job)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              className="rounded-lg px-2.5 py-1.5 text-xs cursor-pointer"
                              onClick={() => setDeleting(job)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick information */}
        <section aria-label="Quick information" className="grid md:grid-cols-2 gap-4">
          <div className="bg-[#f5ebe6] border border-[#e8d8ce] rounded-xl p-4 sm:p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <CalendarDays className="w-4 h-4 text-amber-700" aria-hidden="true" />
              Upcoming interviews
            </h2>
            {upcoming.length === 0 ? (
              <p className="mt-4 text-xs text-slate-500">No interviews scheduled.</p>
            ) : (
              <ul className="mt-4 divide-y divide-[#e8d8ce]">
                {upcoming.map(({ job, time }) => (
                  <li key={job.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{job.position}</div>
                      <div className="text-slate-500 truncate">{job.company}</div>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-md bg-[#fef3c7] text-amber-800 font-semibold">
                      {new Date(time).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-[#f5ebe6] border border-[#e8d8ce] rounded-xl p-4 sm:p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Star className="w-4 h-4 text-amber-700" aria-hidden="true" />
              Priority applications
            </h2>
            {priorityJobs.length === 0 ? (
              <p className="mt-4 text-xs text-slate-500">No high priority applications.</p>
            ) : (
              <ul className="mt-4 divide-y divide-[#e8d8ce]">
                {priorityJobs.map((job) => (
                  <li key={job.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{job.position}</div>
                      <div className="text-slate-500 truncate">{job.company}</div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-semibold ${getStageStyle(job.stage)}`}>
                        {job.stage}
                      </span>
                      <button
                        type="button"
                        onClick={() => setViewing(job)}
                        aria-label={`View details for ${job.position} at ${job.company}`}
                        className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white/70 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-slate-800/30"
                      >
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Mascot */}
        <section className="pt-4 text-center">
          <p className="text-sm text-slate-600">&ldquo;Keep going! ♡&rdquo;</p>
        </section>
      </div>

      <EditApplicationModal job={editing} onSave={handleEdit} onClose={() => setEditing(null)} />

      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-[440px] max-h-[90svh] overflow-y-auto bg-[#f5ebe6] border border-[#e8d8ce] rounded-2xl p-4 sm:p-6 font-mono text-slate-800 shadow-xl">
          <DialogHeader className="border-b border-[#e8d8ce] pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              {viewing?.position}
            </DialogTitle>
            <p className="text-xs text-slate-600">{viewing?.company}</p>
          </DialogHeader>
          {viewing && (
            <dl className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-3 text-xs">
              <dt className="text-slate-500">Stage</dt>
              <dd>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${getStageStyle(viewing.stage)}`}>
                  {viewing.stage}
                </span>
              </dd>
              <dt className="text-slate-500">Priority</dt>
              <dd>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getPriorityStyle(viewing.priority)}`}>
                  {viewing.priority || "Medium"}
                </span>
              </dd>
              <dt className="text-slate-500">Interview date</dt>
              <dd className="text-slate-800">{viewing.interviewDate || "N/A"}</dd>
              <dt className="text-slate-500">Salary</dt>
              <dd className="text-slate-800">{viewing.salary || "—"}</dd>
              <dt className="text-slate-500">Location</dt>
              <dd className="text-slate-800">{viewing.location || "—"}</dd>
              <dt className="text-slate-500">Job link</dt>
              <dd className="min-w-0">
                {viewing.jobLink ? (
                  <a
                    href={viewing.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 underline underline-offset-2 break-all"
                  >
                    {viewing.jobLink} <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  "—"
                )}
              </dd>
              <dt className="text-slate-500">Notes</dt>
              <dd className="text-slate-800 whitespace-pre-wrap break-words">{viewing.notes || "—"}</dd>
            </dl>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="sm:max-w-[380px] bg-[#f5ebe6] border border-[#e8d8ce] rounded-2xl p-6 font-mono text-slate-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Delete this application?
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs leading-relaxed text-slate-600">
            {deleting?.position} at {deleting?.company} will be removed from your tracker. This
            can&apos;t be undone.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setDeleting(null)}
              className="w-1/2 bg-white/70 border border-[#e2d5cb] text-slate-700 py-2 rounded-lg text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => deleting && handleDelete(deleting.id)}
              className="w-1/2 bg-rose-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}