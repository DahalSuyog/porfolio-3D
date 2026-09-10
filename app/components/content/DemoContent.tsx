"use client";

import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { CATEGORIES, PROJECTS, getProject } from "@/data/projects";
import { useDemoStore } from "@/lib/demo-store";
import styles from "./content.module.css";

export default function DemoContent() {
  const activeId = useDemoStore((state) => state.activeId);
  const activeCategory = useDemoStore((state) => state.activeCategory);
  const activeTab = useDemoStore((state) => state.activeTab);
  const setActiveId = useDemoStore((state) => state.setActiveId);
  const setActiveCategory = useDemoStore((state) => state.setActiveCategory);
  const setActiveTab = useDemoStore((state) => state.setActiveTab);

  const activeProject = getProject(activeId);
  const filteredProjects = PROJECTS.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  const selectProject = (id: string) => {
    setActiveId(id);
    // Native history API is supported by the App Router and works from the
    // canvas's separate React root, where next/navigation hooks do not.
    window.history.replaceState(null, "", `/demos?project=${id}`);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const first = PROJECTS.find(
      (p) => category === "All" || p.category === category
    );
    if (first) selectProject(first.id);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeProject.codeSnippet);
    alert("Code copied to clipboard.");
  };

  return (
    <div
      className={styles.panel}
      style={{ "--project-accent": activeProject.accent } as React.CSSProperties}
    >
      <div className={styles.demo}>
        <div className={styles.demoHeader}>
          <div>
            <p className={styles.label}>Demos</p>
            <h1 className={styles.demoTitle}>Projects</h1>
            <p className={styles.demoDesc}>
              Technical notes and implementation excerpts for selected projects.
            </p>
          </div>
          <Link href="/" className={styles.backLink}>
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Back home
          </Link>
        </div>

        <div className={styles.categories}>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`${styles.catBtn} ${
                activeCategory === category
                  ? styles.catActive
                  : styles.catInactive
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.dashboard}>
          <div className={styles.viewer}>
            <div className={styles.tabBar}>
              {(
                [
                  ["overview", "Overview"],
                  ["details", "Details"],
                  ["code", "Code"],
                ] as const
              ).map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${styles.tabBtn} ${
                    activeTab === tab ? styles.tabActive : styles.tabInactive
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className={styles.workspace}>
              <div>
                <div className={styles.projectMeta}>
                  {activeProject.tech.map((tech) => (
                    <span key={tech} className={styles.projectTech}>
                      {tech}
                    </span>
                  ))}
                </div>
                <h2 className={styles.projectName}>{activeProject.title}</h2>
                <p className={styles.projectDesc}>
                  {activeProject.longDescription}
                </p>
              </div>

              <div>
                {activeTab === "overview" &&
                  (activeProject.mediaUrl ? (
                    <div className={styles.demoFrame}>
                      <Image
                        src={activeProject.mediaUrl}
                        alt={activeProject.title}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ) : (
                    <div className={styles.demoFrameEmpty}>
                      <div className={styles.emptyIconBox}>
                        <span className="material-symbols-outlined text-4xl">
                          description
                        </span>
                      </div>
                      <div>
                        <h3 className={styles.emptyTitle}>No recorded video</h3>
                        <p className={styles.emptyDesc}>
                          There is no visual recording for this project yet. See
                          the Details and Code tabs for the full breakdown.
                        </p>
                      </div>
                    </div>
                  ))}

                {activeTab === "details" && (
                  <div className={styles.specsPanel}>
                    {Object.entries(activeProject.specs).map(([key, value]) => (
                      <div key={key} className={styles.specsRow}>
                        <span className={styles.specsKey}>{key}</span>
                        <span className={styles.specsVal}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "code" && (
                  <div className={styles.codeFrame}>
                    <div className={styles.codeHeader}>
                      <span>
                        {activeProject.title.toLowerCase().replace(/\s+/g, "-")}
                        .py
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className={styles.copyCodeBtn}
                      >
                        <span className="material-symbols-outlined text-sm">
                          content_copy
                        </span>
                        Copy
                      </button>
                    </div>
                    <pre className={styles.codeBlock}>
                      <code>{activeProject.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.projectListHeader}>
              <h2 className={styles.projectListTitle}>All projects</h2>
              <span className={styles.projectCount}>
                {filteredProjects.length} shown
              </span>
            </div>

            {filteredProjects.map((project) => {
              const isActive = project.id === activeId;
              return (
                <button
                  key={project.id}
                  onClick={() => selectProject(project.id)}
                  className={`${styles.projectItem} ${
                    isActive
                      ? styles.projectItemActive
                      : styles.projectItemInactive
                  }`}
                  style={
                    { "--item-accent": project.accent } as React.CSSProperties
                  }
                >
                  <span className={styles.projCategory}>
                    {project.category}
                  </span>
                  <span className={styles.projName}>{project.title}</span>
                  <span className={styles.projDesc}>{project.description}</span>
                </button>
              );
            })}

            {filteredProjects.length === 0 && (
              <p className={styles.emptyState}>No projects in this category.</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
