"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LOGO_TARGET_ID, ROCKET_IMPACT } from "@/lib/rocketEvents";

/**
 * The Jobbie logo. It stays hidden until the rocket from <RocketBackground /> hits this spot,
 * then pops out of the explosion. The sequence plays once per page load.
 * With reduced motion the logo is simply shown (see .logo-hidden in globals.css).
 */
export function LogoReveal() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const show = () => setShown(true);
    window.addEventListener(ROCKET_IMPACT, show);
    return () => window.removeEventListener(ROCKET_IMPACT, show);
  }, []);

  return (
    <div
      id={LOGO_TARGET_ID}
      className="relative mx-auto lg:mx-0 lg:mr-28 lg:justify-self-end w-60 sm:w-72 shrink-0"
    >
      <span aria-hidden="true" className={`logo-glow ${shown ? "logo-glow-on" : ""}`} />
      <div
        role="img"
        aria-label="Jobbie logo"
        className={`relative block w-full aspect-square rounded-full ${shown ? "logo-pop" : "logo-hidden"}`}
      >
        <Image
          src="/logo.png"
          alt=""
          width={640}
          height={640}
          priority
          className="logo-float w-full h-full object-contain select-none"
        />
      </div>
    </div>
  );
}
