"use client";

import { TIMELINE } from "@/data/site";
import styles from "./content.module.css";

export default function ExperienceContent() {
  return (
    <div className={styles.panel}>
      <header className={styles.sectionHeader}>
        <p className={styles.label}>Experience</p>
        <h2 className={styles.title}>Education &amp; background</h2>
      </header>

      <div className={styles.timeline}>
        {TIMELINE.map((entry) => (
          <article key={entry.title} className={styles.timelineItem}>
            <span className={styles.timelineDate}>{entry.period}</span>
            <div>
              <h3 className={styles.timelineTitle}>{entry.title}</h3>
              <p className={styles.timelineOrg}>{entry.org}</p>
              <p className={styles.timelineDesc}>{entry.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
