"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const LOTTIE_SRC = "/animations/servenow-hologram.lottie";

export function ServeNowHeroAnimation() {
  const [useLottie, setUseLottie] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(LOTTIE_SRC, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setUseLottie(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600/25 via-cyan-500/10 to-zinc-900/30" />
      <div className="hero-grid absolute inset-0 opacity-[0.15]" aria-hidden />
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-cyan-300/15 blur-3xl" />

      {useLottie ? (
        <div className="absolute inset-0 flex items-center justify-center opacity-90">
          <DotLottieReact
            src={LOTTIE_SRC}
            loop
            autoplay
            className="h-full max-h-[420px] w-full max-w-[520px]"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-8 opacity-95">
          <Image
            src="/hero/servenow-hero.svg"
            alt=""
            width={640}
            height={400}
            className="max-h-[min(420px,50vh)] w-auto drop-shadow-lg"
            priority
          />
        </div>
      )}
    </div>
  );
}
