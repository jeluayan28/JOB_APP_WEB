"use client";

import { useState, useEffect } from "react";
import { JobApplication, JobStatus } from "@/types/job";
import { INITIAL_JOBS } from "@/data/initialJobs";
import { AddJobModal } from "@/components/ui/AddJobModal";
import { JobTable } from "@/components/ui/JobTable";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ApplicationTracker() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage or initialize defaults
  useEffect(() => {
    const saved = localStorage.getItem("tracker_jobs");
    if (saved) {
      try {
        setJobs(JSON.parse(saved));
      } catch (e) {
        setJobs(INITIAL_JOBS);
      }
    } else {
      setJobs(INITIAL_JOBS);
    }
    setIsLoaded(true);
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("tracker_jobs", JSON.stringify(jobs));
    }
  }, [jobs, isLoaded]);

  const handleAddJob = (newJob: JobApplication) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: JobStatus) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status } : job))
    );
  };

  const handleDeleteJob = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  // Filtered dataset calculation
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.position.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Dynamic dashboard metrics
  const totalCount = jobs.length;
  const interviewingCount = jobs.filter((j) => j.status === "INTERVIEWING").length;
  const offerCount = jobs.filter((j) => j.status === "OFFERED").length;

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <main className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Job Application Tracker
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Organize, filter, and track your active pipeline.
            </p>
          </div>
          <AddJobModal onAddJob={handleAddJob} />
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold text-slate-900">{totalCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                In Progress / Interviewing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold text-amber-600">{interviewingCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-emerald-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Offers Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold text-emerald-600">{offerCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            className="sm:max-w-xs bg-white"
            placeholder="Filter by company or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="sm:max-w-[180px] bg-white">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
              <SelectItem value="OFFERED">Offered</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interactive Applications Table */}
        <JobTable
          jobs={filteredJobs}
          onUpdateStatus={handleUpdateStatus}
          onDeleteJob={handleDeleteJob}
        />
      </main>
    </div>
  );
}