"use client";

import { SKILLS } from "@/data/site";
import styles from "./content.module.css";

export default function SkillsContent() {
  return (
    <div className={styles.panel}>
      <header className={styles.sectionHeader}>
        <p className={styles.label}>Skills</p>
        <h2 className={styles.title}>What I work with</h2>
        <p className={styles.desc}>
          A practical toolkit spanning low-level performance, modern web
          systems, and applied machine learning.
        </p>
      </header>

      <div className={styles.skillsGrid}>
        {SKILLS.map((skill) => (
          <article key={skill.title} className={styles.skillCard}>
            <div className={styles.skillIcon}>
              <span className="material-symbols-outlined text-2xl">
                {skill.icon}
              </span>
            </div>
            <h3 className={styles.skillTitle}>{skill.title}</h3>
            <p className={styles.skillDesc}>{skill.desc}</p>
            <div className={styles.skillTags}>
              {skill.tags.map((tag) => (
                <span key={tag} className={styles.skillTag}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
