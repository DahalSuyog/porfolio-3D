"use client";

import Link from "next/link";
import { PROJECTS } from "@/data/projects";
import styles from "./content.module.css";

export default function WorkContent() {
  return (
    <div className={styles.panel}>
      <header className={styles.sectionHeader}>
        <p className={styles.label}>Selected work</p>
        <h2 className={styles.title}>Projects</h2>
        <p className={styles.desc}>
          Focused systems exploring agent learning and computer vision.
        </p>
      </header>

      <div className={styles.workGrid}>
        {PROJECTS.map((project) => (
          <article key={project.id} className={styles.workCard}>
            <div className={styles.workTags}>
              {project.tech.slice(0, 3).map((tag) => (
                <span key={tag} className={styles.workTag}>
                  {tag}
                </span>
              ))}
            </div>
            <h3 className={styles.workTitle}>{project.title}</h3>
            <p className={styles.workDesc}>{project.description}</p>
            <div className={styles.workStat}>
              <span className={styles.workStatValue}>
                {project.stat.value}
              </span>
              <span className={styles.workStatLabel}>{project.stat.label}</span>
            </div>
            <Link
              href={`/demos?project=${project.id}`}
              className={styles.workLink}
            >
              View demo
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
