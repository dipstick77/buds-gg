"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label = "Copy",
  hint,
  className = "",
}: {
  value: string;
  label?: string;
  hint?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 1800);
    }
  }

  return (
    <button
      type="button"
      className={`cta-btn cta-btn--primary ${className}`}
      onClick={onCopy}
      aria-live="polite"
    >
      <span>
        {status === "copied"
          ? hint || "Copied"
          : status === "error"
            ? "Copy failed"
            : label}
      </span>
    </button>
  );
}
