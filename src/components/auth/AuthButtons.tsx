"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoginForm, SignupForm } from "@/components/auth/AuthForms";

type Mode = "login" | "signup";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

/** The "Log in" and "Sign up" buttons for the landing header, and the pop-up they open. */
export function AuthButtons({ initialMode }: { initialMode: Mode | null }) {
  const [mode, setMode] = useState<Mode | null>(initialMode);

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
        <DialogContent className="sm:max-w-[400px] bg-[#f5ebe6] border border-[#e8d8ce] rounded-2xl p-6 font-mono text-slate-800 shadow-xl">
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
