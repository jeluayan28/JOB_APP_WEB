
export type JobStatus = "APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED";
export type JobPriority = "Low" | "Medium" | "High";

export interface JobApplication {
  id: string;
  position: string;
  company: string;
  stage: JobStatus;
  priority?: JobPriority;
  interviewDate?: string;
  jobLink?: string;
  location?: string;
  salary?: string;
  notes?: string;
}