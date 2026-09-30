"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PASSWORD_RULES } from "@/lib/validation";

const inputClass =
  "w-full bg-white border border-[#e2d5cb] rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-slate-800 mt-1";
const labelClass = "text-xs font-semibold text-slate-700";
const submitClass =
  "w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

type Props = { onSwitch: () => void };

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, error: (data.error as string | undefined) ?? "" };
}

export function LoginForm({ onSwitch }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { ok, error } = await postJson("/api/login", { email, password });
      if (!ok) return setError(error || "Couldn't log in. Try again.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <p role="alert" className="text-xs text-rose-600 text-center">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="login-email" className={labelClass}>
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="login-password" className={labelClass}>
          Password
        </label>
        <input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>
      <button type="submit" disabled={loading} className={submitClass}>
        {loading ? "Logging in..." : "Log in"}
      </button>
      <p className="text-[11px] text-center text-slate-600">
        New to Jobbie?{" "}
        <button type="button" onClick={onSwitch} className="underline font-semibold text-slate-900 cursor-pointer">
          Create an account
        </button>
      </p>
    </form>
  );
}

export function SignupForm({ onSwitch }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordOk = PASSWORD_RULES.every((r) => r.test(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!passwordOk) return setError("Choose a stronger password. See the checklist below.");
    setLoading(true);
    try {
      const { ok, error } = await postJson("/api/signup", { name, email, password });
      if (!ok) return setError(error || "Something went wrong during signup.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <p role="alert" className="text-xs text-rose-600 text-center">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="signup-name" className={labelClass}>
          Full name
        </label>
        <input
          id="signup-name"
          type="text"
          required
          autoComplete="name"
          placeholder="Alex Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="signup-email" className={labelClass}>
          Email address
        </label>
        <input
          id="signup-email"
          type="email"
          required
          autoComplete="email"
          placeholder="alex@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="signup-password" className={labelClass}>
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        <ul className="mt-2 space-y-0.5" aria-label="Password requirements">
          {PASSWORD_RULES.map((r) => (
            <li
              key={r.label}
              className={`text-[11px] ${r.test(password) ? "text-emerald-700" : "text-slate-500"}`}
            >
              {r.test(password) ? "✓" : "○"} {r.label}
            </li>
          ))}
        </ul>
      </div>
      <button type="submit" disabled={loading || !passwordOk} className={submitClass}>
        {loading ? "Creating account..." : "Sign up"}
      </button>
      <p className="text-[11px] text-center text-slate-600">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="underline font-semibold text-slate-900 cursor-pointer">
          Log in
        </button>
      </p>
    </form>
  );
}
