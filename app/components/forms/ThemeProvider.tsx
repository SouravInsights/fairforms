// app/components/forms/ThemeProvider.tsx
"use client";

import { Form } from "@/types/form";
import { useEffect } from "react";

interface ThemeProviderProps {
  theme: Form["settings"]["theme"];
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  // Apply theme background to root element when component mounts
  useEffect(() => {
    document.documentElement.style.backgroundColor = theme.backgroundColor;
    document.body.style.backgroundColor = theme.backgroundColor;

    // Cleanup when component unmounts
    return () => {
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
    };
  }, [theme.backgroundColor]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {children}
    </div>
  );
}
