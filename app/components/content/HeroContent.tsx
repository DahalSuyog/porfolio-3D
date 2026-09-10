"use client";

import { SITE } from "@/data/site";
import { scrollToSection } from "@/lib/lenis";
import { useUIStore } from "@/lib/ui-store";
import styles from "./content.module.css";

export default function HeroContent() {
  const openContact = useUIStore((state) => state.openContact);

  return (
    <div className={styles.panel}>
      <div className={styles.hero}>
        <p className={styles.availability}>{SITE.availability}</p>
        <h1 className={styles.heroTitle}>{SITE.name}</h1>
        <p className={styles.heroRole}>{SITE.role}</p>
        <p className={styles.heroIntro}>{SITE.intro}</p>
        <div className={styles.actions}>
          <button
            className={styles.primary}
            onClick={() => scrollToSection("work")}
          >
            View work
          </button>
          <button className={styles.secondary} onClick={openContact}>
            Contact me
          </button>
        </div>
      </div>
    </div>
  );
}
