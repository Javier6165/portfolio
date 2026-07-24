"use client";

export function ThemeToggle() {
  function toggleTheme() {
    const current = document.documentElement.dataset.theme === "human" ? "human" : "system";
    const next = current === "system" ? "human" : "system";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next === "system" ? "dark" : "light";
    localStorage.setItem("javier-theme", next);
    window.dispatchEvent(new CustomEvent("portfolio-theme-change"));
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle between Human and System modes"
      title="Toggle Human / System mode"
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__dot" />
      </span>
      <span className="theme-toggle__label" aria-hidden="true">
        <span className="theme-toggle__system">System</span>
        <span className="theme-toggle__human">Human</span>
      </span>
    </button>
  );
}
