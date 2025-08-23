"use client";

import { useState, useEffect } from "react";

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Get theme from localStorage on mount
    const savedTheme =
      (localStorage.getItem("histoBitTheme") as "dark" | "light") || "dark";
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme: "dark" | "light") => {
    const root = document.documentElement;
    const sunIcon = document.getElementById("sunIcon");
    const moonIcon = document.getElementById("moonIcon");

    if (theme === "light") {
      // Light theme
      root.style.setProperty("--bg-primary", "#ffffff");
      root.style.setProperty("--bg-secondary", "#f8f9fa");
      root.style.setProperty("--bg-tertiary", "#e9ecef");
      root.style.setProperty("--text-primary", "#212529");
      root.style.setProperty("--text-secondary", "#6c757d");
      root.style.setProperty("--accent-primary", "#019863");
      root.style.setProperty("--accent-secondary", "#8ecdb7");
      root.style.setProperty("--border-primary", "#dee2e6");
      root.style.setProperty("--border-secondary", "#adb5bd");

      // Change icon
      if (sunIcon) sunIcon.style.display = "none";
      if (moonIcon) moonIcon.style.display = "block";

      // Apply light theme classes
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    } else {
      // Dark theme (default)
      root.style.setProperty("--bg-primary", "#10231c");
      root.style.setProperty("--bg-secondary", "#214a3c");
      root.style.setProperty("--bg-tertiary", "#17352b");
      root.style.setProperty("--text-primary", "#ffffff");
      root.style.setProperty("--text-secondary", "#8ecdb7");
      root.style.setProperty("--accent-primary", "#019863");
      root.style.setProperty("--accent-secondary", "#8ecdb7");
      root.style.setProperty("--border-primary", "#2f6a55");
      root.style.setProperty("--border-secondary", "#214a3c");

      // Change icon
      if (sunIcon) sunIcon.style.display = "block";
      if (moonIcon) moonIcon.style.display = "none";

      // Apply dark theme classes
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setCurrentTheme(newTheme);
    localStorage.setItem("histoBitTheme", newTheme);
    applyTheme(newTheme);
  };

  return {
    currentTheme,
    toggleTheme,
    applyTheme,
  };
}
