"use client";

import { useState } from "react";
import { JobApplication, JobStatus, JobPriority } from "@/types/job";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddApplicationModalProps {
  onAddJob: (job: JobApplication) => void;
}

export function AddApplicationModal({ onAddJob }: AddApplicationModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    position: "",
    company: "",
    stage: "APPLIED" as JobStatus,
    priority: "Medium" as JobPriority,
    interviewDate: "",
    jobLink: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.position || !formData.company) return;

    const newJob: JobApplication = {
      id: crypto.randomUUID(),
      position: formData.position,
      company: formData.company,
      stage: formData.stage,
      priority: formData.priority,
      interviewDate: formData.interviewDate || "N/A",
      jobLink: formData.jobLink,
    };

    onAddJob(newJob);
    setFormData({
      position: "",
      company: "",
      stage: "APPLIED",
      priority: "Medium",
      interviewDate: "",
      jobLink: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger className="flex items-center gap-1.5 bg-slate-900 text-white px-3.5 py-2 rounded-lg text-xs font-mono hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
    <Plus className="w-3.5 h-3.5" />
    Add Application
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] bg-[#f5ebe6] border border-[#e8d8ce] rounded-2xl p-6 font-mono text-slate-800 shadow-xl">
        <DialogHeader className="border-b border-[#e8d8ce] pb-3">
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Track New Application
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          {/* Position Title */}
          <div className="space-y-1">
            <label
              htmlFor="position"
              className="text-xs font-semibold text-slate-700"
            >
              Position Title *
            </label>
            <input
              id="position"
              required
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="e.g. Frontend Engineer"
              className="w-full bg-white/90 border border-[#e2d5cb] rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-all"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-1">
            <label
              htmlFor="company"
              className="text-xs font-semibold text-slate-700"
            >
              Company Name *
            </label>
            <input
              id="company"
              required
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="e.g. Google"
              className="w-full bg-white/90 border border-[#e2d5cb] rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-all"
            />
          </div>

          {/* Stage & Priority Dropdowns */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Stage
              </label>
              <Select
                value={formData.stage}
                onValueChange={(val) =>
                  setFormData({ ...formData, stage: val as JobStatus })
                }
              >
                <SelectTrigger className="w-full bg-white/90 border-[#e2d5cb] rounded-lg h-9 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  sideOffset={4}
                  className="bg-white border-[#e2d5cb] rounded-xl font-mono text-xs shadow-lg z-[100]"
                >
                  <SelectItem
                    value="APPLIED"
                    className="rounded-lg cursor-pointer"
                  >
                    Applied
                  </SelectItem>
                  <SelectItem
                    value="INTERVIEWING"
                    className="rounded-lg cursor-pointer"
                  >
                    Interviewing
                  </SelectItem>
                  <SelectItem
                    value="OFFERED"
                    className="rounded-lg cursor-pointer"
                  >
                    Offered
                  </SelectItem>
                  <SelectItem
                    value="REJECTED"
                    className="rounded-lg cursor-pointer"
                  >
                    Rejected
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Priority
              </label>
              <Select
                value={formData.priority}
                onValueChange={(val) =>
                  setFormData({ ...formData, priority: val as JobPriority })
                }
              >
                <SelectTrigger className="w-full bg-white/90 border-[#e2d5cb] rounded-lg h-9 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  sideOffset={4}
                  className="bg-white border-[#e2d5cb] rounded-xl font-mono text-xs shadow-lg z-[100]"
                >
                  <SelectItem value="Low" className="rounded-lg cursor-pointer">
                    Low
                  </SelectItem>
                  <SelectItem
                    value="Medium"
                    className="rounded-lg cursor-pointer"
                  >
                    Medium
                  </SelectItem>
                  <SelectItem
                    value="High"
                    className="rounded-lg cursor-pointer"
                  >
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Interview Date */}
          <div className="space-y-1">
            <label
              htmlFor="interviewDate"
              className="text-xs font-semibold text-slate-700"
            >
              Interview Date
            </label>
            <input
              id="interviewDate"
              type="date"
              value={formData.interviewDate}
              onChange={(e) =>
                setFormData({ ...formData, interviewDate: e.target.value })
              }
              className="w-full bg-white/90 border border-[#e2d5cb] rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-all"
            />
          </div>

          {/* Job Link */}
          <div className="space-y-1">
            <label
              htmlFor="jobLink"
              className="text-xs font-semibold text-slate-700"
            >
              Job Listing Link
            </label>
            <input
              id="jobLink"
              type="url"
              placeholder="https://..."
              value={formData.jobLink}
              onChange={(e) =>
                setFormData({ ...formData, jobLink: e.target.value })
              }
              className="w-full bg-white/90 border border-[#e2d5cb] rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-1/2 bg-white/70 border border-[#e2d5cb] text-slate-700 py-2 rounded-lg text-xs font-semibold hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 bg-slate-900 text-white py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              Save Application
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
