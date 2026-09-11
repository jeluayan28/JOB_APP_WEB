import { JobApplication } from "@/types/job";

export const INITIAL_JOBS: JobApplication[] = [
  {
    id: "1",
    company: "Google",
    position: "Frontend Engineer",
    location: "Remote",
    salary: "$130k - $150k",
    status: "INTERVIEWING",
    appliedDate: "2026-09-01",
    notes: "Passed technical screening. Onsite round scheduled next week.",
  },
  {
    id: "2",
    company: "Vercel",
    position: "UI Developer",
    location: "New York, NY",
    salary: "$120k - $140k",
    status: "APPLIED",
    appliedDate: "2026-09-05",
    notes: "Submitted application via referral.",
  },
  {
    id: "3",
    company: "Stripe",
    position: "React Engineer",
    location: "Remote",
    salary: "$140k - $160k",
    status: "OFFERED",
    appliedDate: "2026-08-15",
    notes: "Offer letter received. Decision deadline by Friday.",
  },
];