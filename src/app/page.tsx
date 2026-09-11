"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { AddJobModal } from "@/components/ui/AddJobModal";
import { JobApplication, JobStatus } from "@/types/job";
import { INITIAL_JOBS } from "@/data/initialJobs";

export default function Dashboard() {
  const [jobs, setJobs] = useState<JobApplication[]>(INITIAL_JOBS);
  const [activeTab, setActiveTab] = useState<"ALL" | JobStatus>("ALL");

  const handleAddJob = (newJob: JobApplication) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const filteredJobs = jobs.filter((job) =>
    activeTab === "ALL" ? true : job.status === activeTab,
  );

  return (
    <div className="min-h-screen bg-[#faf7f2] font-mono text-slate-800 pb-16">
      {/* 1. Top Image Header Banner (Crisp & High Quality) */}
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
        {/* Dashboard Title & Action Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Job Application Dashboard
          </h1>
          <AddJobModal onAddJob={handleAddJob} />
        </div>

        
        {/* Main Grid: Left Sidebar & Right Application Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDEBAR (Progress Bars + Lists) */}
          <div className="md:col-span-4 space-y-6">
            {/* Progress Bars Widget */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-28 bg-[#e8d5c8] h-4 rounded overflow-hidden">
                  <div className="bg-[#e0986c] h-full w-[82%]" />
                </div>
                <span className="text-slate-500">Year 82%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-28 bg-[#e8d5c8] h-4 rounded overflow-hidden">
                  <div className="bg-[#e0986c] h-full w-[45%]" />
                </div>
                <span className="text-slate-500">Month 45%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-28 bg-[#e8d5c8] h-4 rounded overflow-hidden">
                  <div className="bg-[#e0986c] h-full w-[18%]" />
                </div>
                <span className="text-slate-500">Week 18%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-28 bg-[#e8d5c8] h-4 rounded overflow-hidden">
                  <div className="bg-[#e0986c] h-full w-[25%]" />
                </div>
                <span className="text-slate-500">Day 25%</span>
              </div>
            </div>

            {/* To Do List Accordion */}
            <details
              open
              className="bg-[#f1e5df] rounded-md p-3 text-sm border border-[#e5d4cb]"
            >
              <summary className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 select-none">
                <span>►</span> To Do List:
              </summary>
              <ul className="mt-2 text-xs space-y-1.5 pl-5 list-disc text-slate-600">
                <li>Update Resume for Tech Roles</li>
                <li>Follow up with TechCorp HR</li>
                <li>Prepare for System Design Interview</li>
              </ul>
            </details>

            {/* Job Boards Accordion */}
            <details
              open
              className="bg-[#f1e5df] rounded-md p-3 text-sm border border-[#e5d4cb]"
            >
              <summary className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 select-none">
                <span>►</span> Job boards:
              </summary>
              <ul className="mt-2 text-xs space-y-1.5 pl-5 list-disc text-slate-600">
                <li>LinkedIn Jobs</li>
                <li>Glassdoor</li>
                <li>Wellfound (AngelList)</li>
              </ul>
            </details>
          </div>

          {/* RIGHT SIDE: Application Tracker Kanban / Cards */}
          <div className="md:col-span-8 bg-[#f5ebe6] border border-[#e8d8ce] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">
                Application tracker
              </h2>
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
                Applied ({jobs.filter((j) => j.status === "APPLIED").length})
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
                Interviewing (
                {jobs.filter((j) => j.status === "INTERVIEWING").length})
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
                Offered ({jobs.filter((j) => j.status === "OFFERED").length})
              </button>
            </div>

            {/* Application Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {filteredJobs.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-xs text-slate-400">
                  No applications in this view.
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg p-4 border border-[#e2d5cb] shadow-sm hover:shadow transition-shadow space-y-1 text-xs"
                  >
                    <div className="font-bold text-slate-900 text-sm">
                      {job.position}
                    </div>
                    <div className="text-slate-600">{job.company}</div>
                    <div className="text-slate-400">
                      {job.location || "Remote"}
                    </div>
                    {job.salary && (
                      <div className="text-slate-500 pt-1 font-medium">
                        {job.salary}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
