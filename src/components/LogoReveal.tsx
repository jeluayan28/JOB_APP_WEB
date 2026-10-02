"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LOGO_TARGET_ID, ROCKET_IMPACT, ROCKET_LAUNCH, ROCKET_REPLAY } from "@/lib/rocketEvents";

/**
 * The Jobbie logo. It stays hidden until the rocket from <RocketBackground /> hits this spot,
 * then pops out of the explosion. Click it to fly the rocket in again.
 * With reduced motion the logo is simply shown (see .logo-hidden in globals.css).
 */
export function LogoReveal() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const show = () => setShown(true);
    const hide = () => setShown(false);
    window.addEventListener(ROCKET_IMPACT, show);
    window.addEventListener(ROCKET_LAUNCH, hide);
    return () => {
      window.removeEventListener(ROCKET_IMPACT, show);
      window.removeEventListener(ROCKET_LAUNCH, hide);
    };
  }, []);

  return (
    <div
      id={LOGO_TARGET_ID}
      className="relative mx-auto lg:mx-0 lg:mr-28 lg:justify-self-end w-60 sm:w-72 shrink-0"
    >
      <span aria-hidden="true" className={`logo-glow ${shown ? "logo-glow-on" : ""}`} />
      <button
        type="button"
        disabled={!shown}
        onClick={() => window.dispatchEvent(new Event(ROCKET_REPLAY))}
        aria-label="Jobbie logo. Press to watch the rocket again."
        className={`relative block w-full aspect-square rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 ${
          shown ? "logo-pop cursor-pointer" : "logo-hidden"
        }`}
      >
        <Image
          src="/logo.png"
          alt=""
          width={640}
          height={640}
          priority
          className="logo-float w-full h-full object-contain select-none"
        />
      </button>
    </div>
  );
}
