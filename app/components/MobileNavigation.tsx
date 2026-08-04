"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#approach", label: "Practice" },
  { href: "/#ai-practice", label: "AI workflow" },
  { href: "/about", label: "About" },
  { href: "/playground", label: "Playground" },
] as const;

export function MobileNavigation() {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  function closeMenu(returnFocus = false) {
    const details = detailsRef.current;
    if (!details) return;
    details.open = false;
    if (returnFocus) details.querySelector("summary")?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDetailsElement>) {
    if (event.key !== "Escape" || !detailsRef.current?.open) return;
    event.preventDefault();
    closeMenu(true);
  }

  return (
    <details ref={detailsRef} className="mobile-nav" onKeyDown={handleKeyDown}>
      <summary aria-label="Open navigation"><span /><span /></summary>
      <nav aria-label="Mobile navigation">
        {links.map((link) => (
          <Link href={link.href} onClick={() => closeMenu()} key={link.href}>{link.label}</Link>
        ))}
      </nav>
    </details>
  );
}
