"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "sereniq-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const decide = (value: "accepted" | "declined") => {
    localStorage.setItem(STORAGE_KEY, value);
    // Signal other components (e.g. analytics gating) without a full reload.
    window.dispatchEvent(new CustomEvent("cookie-consent", { detail: value }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-ink/10">
        <h3 className="font-heading text-lg font-semibold text-ink">Cookie consent</h3>
        <p className="mt-2 text-sm leading-relaxed text-mocha-dark">
          We and our partners use cookies and similar technologies to personalize
          content, analyze traffic, and improve your shopping experience. You can
          accept all cookies or continue with only the essentials.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => decide("accepted")}>
            Accept all
          </Button>
          <button
            onClick={() => decide("declined")}
            className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition hover:bg-cream"
          >
            Essentials only
          </button>
        </div>
      </div>
    </div>
  );
}
