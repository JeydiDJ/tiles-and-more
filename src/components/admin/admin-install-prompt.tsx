"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function AdminInstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installState, setInstallState] = useState<"idle" | "ready" | "accepted" | "dismissed" | "unavailable">("idle");

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      setInstallState("unavailable");
      return;
    }

    const adminScope = `/${window.location.pathname.split("/").filter(Boolean)[0] ?? ""}`.replace(/\/+$/, "");

    navigator.serviceWorker.register("/admin-sw.js", { scope: adminScope }).catch(() => {
      return undefined;
    });

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
      setInstallState("ready");
    };

    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
      setInstallState("accepted");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installPromptEvent) {
      setInstallState("unavailable");
      return;
    }

    setIsInstalling(true);

    try {
      await installPromptEvent.prompt();
      const choiceResult = await installPromptEvent.userChoice;

      setInstallPromptEvent(null);
      setInstallState(choiceResult.outcome === "accepted" ? "accepted" : "dismissed");
    } finally {
      setIsInstalling(false);
    }
  }

  const helperText =
    installState === "accepted"
      ? "Admin app installed. You can launch it directly from your device."
      : installState === "dismissed"
        ? "Install was dismissed. You can try again any time from a supported browser."
        : installState === "unavailable"
          ? "Install is available after the browser recognizes this device and session as installable."
          : "Install the admin workspace for a cleaner app-style experience with standalone launch.";

  return (
    <div className="rounded-[1.4rem] border border-[#e3e7f0] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)] sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#eceef5] bg-[#f7f8fc] text-[#17141a]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
            <path d="M12 4.5v9" strokeLinecap="round" />
            <path d="m8.5 10.5 3.5 3.5 3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 17.5h14" strokeLinecap="round" />
          </svg>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Install Admin App</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#17141a]">Open the workspace like a native app</h2>
          <p className="mt-3 text-sm leading-6 text-[#6f6a75]">{helperText}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleInstall}
          disabled={!installPromptEvent || isInstalling || installState === "accepted"}
          className="inline-flex items-center justify-center rounded-xl bg-[#17141a] px-4 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#2a262e] disabled:cursor-not-allowed disabled:bg-[#d8dce6] disabled:text-[#6f6a75]"
        >
          {installState === "accepted" ? "Installed" : isInstalling ? "Installing..." : "Install App"}
        </button>

        <span className="text-xs uppercase tracking-[0.18em] text-[#9793a0]">Admin-only install</span>
      </div>
    </div>
  );
}
