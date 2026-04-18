"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AdminTheme = "light" | "dark";

type AdminThemeContextValue = {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
};

const STORAGE_KEY = "tiles-and-more-admin-theme";

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.adminTheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);

    return () => {
      delete document.documentElement.dataset.adminTheme;
    };
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (nextTheme: AdminTheme) => setThemeState(nextTheme),
    }),
    [theme],
  );

  return <AdminThemeContext.Provider value={value}>{children}</AdminThemeContext.Provider>;
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);

  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider.");
  }

  return context;
}
