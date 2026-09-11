"use client";

import { JobApplication, JobStatus } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobTableProps {
  jobs: JobApplication[];
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onDeleteJob: (id: string) => void;
}

const statusBadgeStyles: Record<JobStatus, string> = {
  APPLIED: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
  INTERVIEWING: "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
  OFFERED: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200",
  REJECTED: "bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200",
};

export function JobTable({ jobs, onUpdateStatus, onDeleteJob }: JobTableProps) {
  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                No job applications found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-semibold text-slate-900">{job.company}</TableCell>
                <TableCell>{job.position}</TableCell>
                <TableCell className="text-slate-600">{job.location || "N/A"}</TableCell>
                <TableCell className="text-slate-600">{job.salary || "N/A"}</TableCell>
                <TableCell>
                  <Select
                    value={job.status}
                    onValueChange={(val) => onUpdateStatus(job.id, val as JobStatus)}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs font-medium">
                      <SelectValue>
                        <Badge variant="outline" className={statusBadgeStyles[job.status]}>
                          {job.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPLIED">APPLIED</SelectItem>
                      <SelectItem value="INTERVIEWING">INTERVIEWING</SelectItem>
                      <SelectItem value="OFFERED">OFFERED</SelectItem>
                      <SelectItem value="REJECTED">REJECTED</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-slate-500">{job.appliedDate}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                    onClick={() => onDeleteJob(job.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}