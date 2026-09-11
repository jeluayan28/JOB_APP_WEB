"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, ExternalLink, Trash2 } from "lucide-react";
import { AddApplicationModal } from "@/components/ui/AddApplicationModal";
import { JobApplication, JobStatus, JobPriority } from "@/types/job";
import { INITIAL_JOBS } from "@/data/initialJobs";

export default function Dashboard() {
  const [jobs, setJobs] = useState<JobApplication[]>(INITIAL_JOBS);
  const [activeTab, setActiveTab] = useState<"ALL" | JobStatus>("ALL");

  const handleAddJob = (newJob: JobApplication) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const handleDelete = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
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

  return (
    <div className="min-h-screen bg-[#faf7f2] font-mono text-slate-800 pb-16">
      {/* 1. Header Banner */}
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
      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-6">
        {/* Title and Pop-Up Modal Trigger */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Job Application Dashboard
          </h1>
          <AddApplicationModal onAddJob={handleAddJob} />
        </div>

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
                  <th className="py-2 px-3 font-normal">Job Link</th>
                  <th className="py-2 px-1 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
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
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 transition-opacity p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}