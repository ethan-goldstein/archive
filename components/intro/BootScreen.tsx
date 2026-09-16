"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Monitor } from "./Monitor";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content/profile";
import { useSettings } from "@/lib/settings/SettingsContext";
import { playBootChime, unlockAudio } from "@/lib/audio/chime";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { dur, ease } from "@/lib/motion";
import { markOpening } from "@/components/browser/BrowserWindow";

type Phase = "off" | "booting" | "ready";

/**
 * The intro. A dark room, a monitor, and one button. Audio only after a gesture.
 * Returning visitors get a one-second boot; reduced motion gets a fade.
 */
export function BootScreen() {
  const router = useRouter();
  const { sound, toggleSound, entered, markEntered } = useSettings();
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("off");
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);

  useEffect(() => {
    router.prefetch("/year/2005");
  }, [router]);

  const powerOn = () => {
    if (phase !== "off") return;
    unlockAudio();
    playBootChime();
    setPhase("booting");
    const wait = reduced ? 600 : entered ? 900 : 1800;
    window.setTimeout(() => setPhase("ready"), wait);
  };

  const enter = () => {
    markEntered();
    markOpening();
    router.push("/year/2005");
  };

  useEffect(() => {
    if (phase !== "off") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.metaKey || e.ctrlKey) return;
      powerOn();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reduced, entered]);

  return (
    <main data-era="xp" className="relative flex min-h-dvh flex-col items-center justify-center bg-black px-4 py-10 text-white" style={{ background: "#050506" }}>
      <div className="absolute right-4 top-4 flex items-center gap-2 md:right-6 md:top-6">
        <button type="button" onClick={toggleSound} aria-pressed={sound} className="btn-ghost h-9 gap-2 text-white">
          <Icon name={sound ? "volume" : "mute"} size={14} />
          <span className="label-mono">{sound ? "Sound on" : "Muted"}</span>
        </button>
        <Link href="/year/2005" className="btn-ghost h-9 text-white label-mono" onClick={markEntered}>
          Skip intro
        </Link>
      </div>

      <div className="w-full" onClick={phase === "off" ? powerOn : undefined}>
        {phase === "off" ? (
          <button type="button" onClick={powerOn} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black">
            Power on the archive
          </button>
        ) : null}
        <Monitor on={phase !== "off"}>
          <AnimatePresence mode="wait">
            {phase === "off" ? null : (
              <motion.div
                key="screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: reduced ? 0 : 0.9, duration: dur.slow } }}
                exit={{ opacity: 0 }}
                className="flex w-full flex-col items-center text-center"
              >
                <motion.p
                  className="pow m-0 text-[clamp(22px,4.5vw,40px)] text-white"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: reduced ? 0 : 1.0, duration: dur.base, ease: ease.outQuart } }}
                >
                  {profile.name.toUpperCase()}
                </motion.p>
                <motion.p
                  className="pow m-0 mt-2 text-[clamp(20px,4vw,34px)] text-[#ffe66d]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: reduced ? 0 : 1.15, duration: dur.base, ease: ease.outQuart } }}
                >
                  2005 — 2026
                </motion.p>
                <motion.p
                  className="m-0 mt-4 font-serif text-[clamp(22px,4.2vw,40px)] italic leading-tight text-white"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: reduced ? 0 : 1.35, duration: dur.base, ease: ease.outQuart } }}
                >
                  {profile.tagline}
                </motion.p>
                <motion.p
                  className="label-mono m-0 mt-5 text-white/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: reduced ? 0 : 1.6, duration: dur.base } }}
                >
                  February 10, 2005 · {profile.birthplace.label}
                </motion.p>
                <AnimatePresence>
                  {phase === "ready" ? (
                    <motion.button
                      key="enter"
                      type="button"
                      onClick={enter}
                      className="btn-era mt-7 text-[13px] uppercase tracking-[0.16em]"
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: dur.base, ease: ease.outBack } }}
                    >
                      <Icon name="folder" size={14} />
                      Enter the archive
                    </motion.button>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </Monitor>
      </div>

      <div className="mt-8 h-6 text-center" aria-live="polite">
        {phase === "off" ? (
          <p className="m-0 font-pixel text-[11px] tracking-[0.2em] text-white/60">
            {hydrated ? "PRESS ANY KEY OR TAP TO POWER ON" : "TAP TO POWER ON"}
            <span className="ml-1 inline-block w-[0.6em]" style={{ animation: "blink 1s steps(1) infinite" }}>_</span>
          </p>
        ) : phase === "booting" ? (
          <p className="m-0 font-pixel text-[11px] tracking-[0.2em] text-white/60">LOADING ARCHIVE…</p>
        ) : (
          <p className="m-0 font-pixel text-[11px] tracking-[0.2em] text-white/40">READY</p>
        )}
      </div>
    </main>
  );
}
