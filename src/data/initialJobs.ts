import { JobApplication } from "@/types/job";

export const INITIAL_JOBS: JobApplication[] = [
  {
    id: "1",
    position: "Frontend Engineer",
    company: "Google",
    stage: "INTERVIEWING",
    priority: "High",
    interviewDate: "2026-09-20",
    jobLink: "https://careers.google.com",
    location: "Remote",
    salary: "$130k - $150k",
  },
  {
    id: "2",
    position: "UI Developer",
    company: "Vercel",
    stage: "APPLIED",
    priority: "Medium",
    interviewDate: "N/A",
    jobLink: "https://vercel.com/careers",
    location: "New York, NY",
    salary: "$120k - $140k",
  },
  {
    id: "3",
    position: "React Developer",
    company: "Stripe",
    stage: "OFFERED",
    priority: "High",
    interviewDate: "2026-09-15",
    jobLink: "https://stripe.com/jobs",
    location: "Remote",
    salary: "$140k - $160k",
  },
];