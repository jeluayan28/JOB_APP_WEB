"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ExternalLink, Trash2, Pencil, MoreVertical } from "lucide-react";
import { AddApplicationModal, EditApplicationModal } from "@/components/ui/AddApplicationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { JobApplication, JobStatus, JobPriority } from "@/types/job";

export default function Dashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | JobStatus>("ALL");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [deleting, setDeleting] = useState<JobApplication | null>(null);

  // Load this user's applications from the database
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/jobs");
        if (res.status === 401) return router.replace("/?auth=login");
        const data = await res.json();
        setJobs(data.jobs);
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

  const filteredJobs = jobs.filter((job) =>
    activeTab === "ALL" ? true : job.stage === activeTab
  );

  const getPriorityStyle = (priority?: JobPriority) => {
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
      {/* 1. Top Image Header Banner */}
      <div className="w-full bg-[#d3bc9d] border-b border-[#c2aa8b] overflow-hidden flex justify-center">
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72">
          <Image
            src="/img.png"
            alt="Dashboard Banner"
            fill
            quality={100}
            unoptimized
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-6">
        {/* Dashboard Title & Pop-Up Modal */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Job Application Dashboard
          </h1>
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
        {error && <p className="text-xs text-rose-600">{error}</p>}

        {/* Application Tracker Card */}
        <div className="bg-[#f5ebe6] border border-[#e8d8ce] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Application tracker</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Search className="w-4 h-4 cursor-pointer hover:text-slate-600" />
            </div>
          </div>

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
          </div>

          {/* Borderless Table View */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-[#e8d8ce]/60 pb-2">
                  <th className="py-2 px-3 font-normal">Position</th>
                  <th className="py-2 px-3 font-normal">Company Name</th>
                  <th className="py-2 px-3 font-normal">Stage</th>
                  <th className="py-2 px-3 font-normal">Priority</th>
                  <th className="py-2 px-3 font-normal">Interview Date</th>
                  <th className="py-2 px-3 font-normal">Location</th>
                  <th className="py-2 px-3 font-normal">Salary</th>
                  <th className="py-2 px-3 font-normal">Notes</th>
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
                      <td className="py-3 px-3 text-slate-500">{job.interviewDate || "N/A"}</td>
                      <td className="py-3 px-3 text-slate-700">{job.location || <span className="text-slate-300">—</span>}</td>
                      <td className="py-3 px-3 text-slate-700 whitespace-nowrap">{job.salary || <span className="text-slate-300">—</span>}</td>
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
      </div>

      <EditApplicationModal job={editing} onSave={handleEdit} onClose={() => setEditing(null)} />

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