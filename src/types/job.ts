export type JobStatus = "APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED";

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  salary: string;
  status: JobStatus;
  appliedDate: string;
  notes: string;
}