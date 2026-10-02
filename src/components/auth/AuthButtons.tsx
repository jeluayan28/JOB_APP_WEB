"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoginForm, SignupForm } from "@/components/auth/AuthForms";

type Mode = "login" | "signup";

const OPEN_AUTH_EVENT = "jobbie:open-auth";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

/** A landing-page button that opens the sign-up pop-up owned by <AuthButtons />. */
export function SignupCta({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent<Mode>(OPEN_AUTH_EVENT, { detail: "signup" }))}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-md cursor-pointer ${focusRing} ${className}`}
    >
      {children}
      <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </button>
  );
}

/** The "Log in" and "Sign up" buttons for the landing header, and the pop-up they open. */
export function AuthButtons({ initialMode }: { initialMode: Mode | null }) {
  const [mode, setMode] = useState<Mode | null>(initialMode);

  useEffect(() => {
    const open = (e: Event) => setMode((e as CustomEvent<Mode>).detail);
    window.addEventListener(OPEN_AUTH_EVENT, open);
    return () => window.removeEventListener(OPEN_AUTH_EVENT, open);
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setMode(null);
    // Drop ?auth=... so a refresh doesn't reopen the pop-up
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <>
      <nav className="flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`px-3.5 py-2 rounded-lg border border-[#e2d5cb] text-slate-700 hover:bg-white/60 transition-colors cursor-pointer ${focusRing}`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm cursor-pointer ${focusRing}`}
        >
          Sign up
        </button>
      </nav>

      <Dialog open={mode !== null} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[400px] max-h-[90svh] overflow-y-auto bg-[#f5ebe6] border border-[#e8d8ce] rounded-2xl p-4 sm:p-6 font-mono text-slate-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 text-center">
              {mode === "signup" ? "Create your account" : "Log in to Jobbie"}
            </DialogTitle>
          </DialogHeader>
          {mode === "signup" ? (
            <SignupForm onSwitch={() => setMode("login")} />
          ) : (
            <LoginForm onSwitch={() => setMode("signup")} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
