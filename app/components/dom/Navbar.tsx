"use client";

import React from "react";
import Link from "next/link";
import { scrollToSection } from "@/lib/lenis";
import { useScrollStore } from "@/lib/scroll-store";
import { useUIStore } from "@/lib/ui-store";
import type { SectionId } from "@/lib/sections";
import styles from "./navbar.module.css";

interface NavbarProps {
  activePage?: "home" | "demos";
}

const LINKS: { id: SectionId; label: string; href: string }[] = [
  { id: "hero", label: "About", href: "/#hero" },
  { id: "skills", label: "Skills", href: "/#skills" },
  { id: "work", label: "Work", href: "/#work" },
  { id: "experience", label: "Experience", href: "/#experience" },
];

export default function Navbar({ activePage = "home" }: NavbarProps) {
  const section = useScrollStore((state) => state.section);
  const openContact = useUIStore((state) => state.openContact);

  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        Suyog Dahal
        <span className={styles.logoDot} aria-hidden="true" />
      </Link>

      <nav className={styles.links} aria-label="Primary">
        {LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            onClick={(event) => {
              if (activePage !== "home") return;
              event.preventDefault();
              scrollToSection(link.id);
            }}
            className={`${styles.link} ${
              activePage === "home" && section === link.id
                ? styles.linkActive
                : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/demos"
          className={`${styles.link} ${
            activePage === "demos" ? styles.linkActive : ""
          }`}
        >
          Demos
        </Link>
      </nav>

      <button onClick={openContact} className={styles.contactBtn}>
        Contact
      </button>
    </header>
  );
}
