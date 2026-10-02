"use client";

import { useState } from "react";
import { JobApplication, JobStatus, JobPriority } from "@/types/job";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

type FormValues = {
  position: string;
  company: string;
  stage: JobStatus;
  priority: JobPriority;
  interviewDate: string;
  jobLink: string;
  location: string;
  salary: string;
  notes: string;
};

const EMPTY: FormValues = {
  position: "",
  company: "",
  stage: "APPLIED",
  priority: "Medium",
  interviewDate: "",
  jobLink: "",
  location: "",
  salary: "",
  notes: "",
};

// "N/A" is how an empty interview date is stored, but a date input can't hold it
const toValues = (job: JobApplication): FormValues => ({
  position: job.position,
  company: job.company,
  stage: job.stage,
  priority: job.priority ?? "Medium",
  interviewDate: job.interviewDate && job.interviewDate !== "N/A" ? job.interviewDate : "",
  jobLink: job.jobLink ?? "",
  location: job.location ?? "",
  salary: (job.salary ?? "").replace(/\D/g, ""), // older free-text salaries become digits only
  notes: job.notes ?? "",
});

const toJob = (id: string, v: FormValues): JobApplication => ({
  id,
  position: v.position,
  company: v.company,
  stage: v.stage,
  priority: v.priority,
  interviewDate: v.interviewDate || "N/A",
  jobLink: v.jobLink,
  location: v.location,
  salary: v.salary,
  notes: v.notes,
});

const fieldClass =
  "w-full bg-white/90 border border-[#e2d5cb] rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-all";
const labelClass = "text-xs font-semibold text-slate-700";
const selectTriggerClass =
  "w-full bg-white/90 border-[#e2d5cb] rounded-lg h-9 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800";
const selectContentClass =
  "bg-white border-[#e2d5cb] rounded-xl font-mono text-xs shadow-lg z-[100]";
const dialogClass =
  "sm:max-w-[440px] max-h-[90vh] overflow-y-auto bg-[#f5ebe6] border border-[#e8d8ce] rounded-2xl p-4 sm:p-6 font-mono text-slate-800 shadow-xl";

const DATE_FORMAT = "yyyy-MM-dd";

/** shadcn date picker: a Popover holding a Calendar. Value is a "yyyy-MM-dd" string, "" when empty. */
function DatePicker({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const parsed = value ? parse(value, DATE_FORMAT, new Date()) : undefined;
  const selected = parsed && isValid(parsed) ? parsed : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        className={`${fieldClass} flex items-center justify-between text-left cursor-pointer ${
          selected ? "" : "text-slate-400"
        }`}
      >
        {selected ? format(selected, "PPP") : "Pick a date"}
        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0 bg-white border-[#e2d5cb] font-mono">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            onChange(date ? format(date, DATE_FORMAT) : "");
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function JobForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: FormValues;
  submitLabel: string;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(initial);
  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.position || !formData.company) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-3">
      {/* Position Title */}
      <div className="space-y-1">
        <label htmlFor="position" className={labelClass}>
          Position Title <span className="text-rose-600">*</span>
        </label>
        <input
          id="position"
          required
          value={formData.position}
          onChange={(e) => set("position", e.target.value)}
          placeholder="e.g. Frontend Engineer"
          className={fieldClass}
        />
      </div>

      {/* Company Name */}
      <div className="space-y-1">
        <label htmlFor="company" className={labelClass}>
          Company Name <span className="text-rose-600">*</span>
        </label>
        <input
          id="company"
          required
          value={formData.company}
          onChange={(e) => set("company", e.target.value)}
          placeholder="e.g. Google"
          className={fieldClass}
        />
      </div>

      {/* Stage & Priority Dropdowns */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className={labelClass}>Stage</label>
          <Select
            value={formData.stage}
            onValueChange={(val) => set("stage", val as JobStatus)}
          >
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              sideOffset={4}
              className={selectContentClass}
            >
              <SelectItem value="APPLIED" className="rounded-lg cursor-pointer">
                Applied
              </SelectItem>
              <SelectItem value="SHORTLISTED" className="rounded-lg cursor-pointer">
                Shortlisted
              </SelectItem>
              <SelectItem value="INTERVIEWING" className="rounded-lg cursor-pointer">
                Interviewing
              </SelectItem>
              <SelectItem value="OFFERED" className="rounded-lg cursor-pointer">
                Offered
              </SelectItem>
              <SelectItem value="REJECTED" className="rounded-lg cursor-pointer">
                Rejected
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Priority</label>
          <Select
            value={formData.priority}
            onValueChange={(val) => set("priority", val as JobPriority)}
          >
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              sideOffset={4}
              className={selectContentClass}
            >
              <SelectItem value="Low" className="rounded-lg cursor-pointer">
                Low
              </SelectItem>
              <SelectItem value="Medium" className="rounded-lg cursor-pointer">
                Medium
              </SelectItem>
              <SelectItem value="High" className="rounded-lg cursor-pointer">
                High
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Interview Date */}
      <div className="space-y-1">
        <label htmlFor="interviewDate" className={labelClass}>
          Interview Date
        </label>
        <DatePicker
          id="interviewDate"
          value={formData.interviewDate}
          onChange={(v) => set("interviewDate", v)}
        />
      </div>

      {/* Job Link */}
      <div className="space-y-1">
        <label htmlFor="jobLink" className={labelClass}>
          Job Listing Link
        </label>
        <input
          id="jobLink"
          type="url"
          placeholder="https://..."
          value={formData.jobLink}
          onChange={(e) => set("jobLink", e.target.value)}
          className={fieldClass}
        />
      </div>

      {/* Location & Salary */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="location" className={labelClass}>
            Location
          </label>
          <input
            id="location"
            value={formData.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Remote / Makati"
            className={fieldClass}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="salary" className={labelClass}>
            Salary
          </label>
          <input
            id="salary"
            inputMode="numeric"
            maxLength={12}
            value={formData.salary}
            onChange={(e) => set("salary", e.target.value.replace(/\D/g, ""))}
            placeholder="e.g. 30000"
            className={fieldClass}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label htmlFor="notes" className={labelClass}>
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Recruiter contact, interview tips..."
          className={fieldClass}
        />
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-1/2 bg-white/70 border border-[#e2d5cb] text-slate-700 py-2 rounded-lg text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-1/2 bg-slate-900 text-white py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

interface AddApplicationModalProps {
  onAddJob: (job: JobApplication) => void;
}

export function AddApplicationModal({ onAddJob }: AddApplicationModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen} disablePointerDismissal>
      <DialogTrigger className="flex items-center gap-1.5 bg-slate-900 text-white px-3.5 py-2 rounded-lg text-xs font-mono hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
        <Plus className="w-3.5 h-3.5" />
        Add Application
      </DialogTrigger>
      <DialogContent className={dialogClass}>
        <DialogHeader className="border-b border-[#e8d8ce] pb-3">
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Track New Application
          </DialogTitle>
        </DialogHeader>
        <JobForm
          initial={EMPTY}
          submitLabel="Save Application"
          onCancel={() => setOpen(false)}
          onSubmit={(values) => {
            onAddJob(toJob(crypto.randomUUID(), values));
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EditApplicationModalProps {
  job: JobApplication | null; // the row being edited; null keeps the pop-up closed
  onSave: (job: JobApplication) => void;
  onClose: () => void;
}

export function EditApplicationModal({ job, onSave, onClose }: EditApplicationModalProps) {
  return (
    <Dialog open={job !== null} onOpenChange={(open) => !open && onClose()} disablePointerDismissal>
      <DialogContent className={dialogClass}>
        <DialogHeader className="border-b border-[#e8d8ce] pb-3">
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Edit Application
          </DialogTitle>
        </DialogHeader>
        {job && (
          // key resets the form's fields whenever a different row is opened
          <JobForm
            key={job.id}
            initial={toValues(job)}
            submitLabel="Save Changes"
            onCancel={onClose}
            onSubmit={(values) => onSave(toJob(job.id, values))}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
