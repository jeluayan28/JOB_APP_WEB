import { redirect } from "next/navigation";

// Login now lives in a pop-up on the landing page; old links land there with it open.
export default function LoginPage() {
  redirect("/?auth=login");
}
