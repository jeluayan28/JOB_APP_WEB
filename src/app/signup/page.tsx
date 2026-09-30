import { redirect } from "next/navigation";

// Sign-up now lives in a pop-up on the landing page; old links land there with it open.
export default function SignupPage() {
  redirect("/?auth=signup");
}
