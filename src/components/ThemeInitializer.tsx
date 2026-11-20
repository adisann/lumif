"use client";

import { useEffect } from "react";

export function applyLumifTheme(isDark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", isDark);
  try {
    window.localStorage.setItem("lumif_theme", isDark ? "dark" : "light");
  } catch {
    // Storage unavailable in private browsing
  }
}

export function getSavedLumifTheme(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("lumif_theme") === "dark";
  } catch {
    return false;
  }
}

export default function ThemeInitializer() {
  useEffect(() => {
    applyLumifTheme(getSavedLumifTheme());
  }, []);

  return null;
}
