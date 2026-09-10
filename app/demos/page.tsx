"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/dom/Navbar";
import Footer from "../components/dom/Footer";
import ContactModal from "../components/dom/ContactModal";
import { CATEGORIES, PROJECTS, getProject } from "@/data/projects";
import { useDemoStore } from "@/lib/demo-store";
import styles from "./demos.module.css";

export default function DemosPage() {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className={styles.page}>
      <Navbar
        onContactClick={() => setShowContactModal(true)}
        activePage="demos"
      />

      <Suspense
        fallback={
          <main className={styles.main}>
            <p className={styles.suspenseFallback}>Loading projects…</p>
          </main>
        }
      >
        <DemosContent />
      </Suspense>

      <Footer onContactClick={() => setShowContactModal(true)} />

      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
}

function DemosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setActiveId = useDemoStore((state) => state.setActiveId);

  const [selectedId, setSelectedId] = useState<string>(PROJECTS[0].id);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "code">(
    "overview"
  );

  const requestedProject = PROJECTS.find(
    (p) => p.id === searchParams.get("project")
  );
  const activeProjectId = requestedProject ? requestedProject.id : selectedId;

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeCategory === "All") return true;
    return p.category === activeCategory;
  });

  const activeProject = getProject(activeProjectId);

  useEffect(() => {
    setActiveId(activeProjectId);
  }, [activeProjectId, setActiveId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeProject.codeSnippet);
    alert("Code copied to clipboard.");
  };

  const selectProject = (id: string) => {
    setSelectedId(id);
    setActiveTab("overview");
    router.replace(`/demos?project=${id}`, { scroll: false });
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const filtered = PROJECTS.filter(
      (p) => cat === "All" || p.category === cat
    );
    if (filtered.length > 0) {
      setActiveTab("overview");
      setSelectedId(filtered[0].id);
      router.replace(`/demos?project=${filtered[0].id}`, { scroll: false });
    }
  };

  return (
    <main
      className={styles.main}
      data-scroll-section="demos"
      style={{ "--project-accent": activeProject.accent } as React.CSSProperties}
    >
      <div className={styles.header}>
        <p className={styles.pageLabel}>Demos</p>
        <h1 className={styles.pageTitle}>Projects</h1>
        <p className={styles.pageDesc}>
          Technical notes and implementation excerpts for selected projects.
        </p>
        <Link href="/" className={styles.backLink}>
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Back home
        </Link>
      </div>

      <div className={styles.categoriesBar}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`${styles.catBtn} ${
              activeCategory === cat ? styles.catBtnActive : styles.catBtnInactive
            }`}
          >
            {cat}
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
                  activeTab === tab ? styles.tabBtnActive : styles.tabBtnInactive
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.workspace}>
            <div>
              <div className={styles.projectMeta}>
                {activeProject.tech.map((t) => (
                  <span key={t} className={styles.projectTech}>
                    {t}
                  </span>
                ))}
              </div>
              <h2 className={styles.projectName}>{activeProject.title}</h2>
              <p className={styles.projectDesc}>
                {activeProject.longDescription}
              </p>
            </div>

            <div className={styles.body}>
              {activeTab === "overview" && (
                <div>
                  {activeProject.mediaUrl ? (
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
                  )}
                </div>
              )}

              {activeTab === "details" && (
                <div className={styles.specsPanel}>
                  {Object.entries(activeProject.specs).map(([key, val]) => (
                    <div key={key} className={styles.specsRow}>
                      <span className={styles.specsKey}>{key}</span>
                      <span className={styles.specsVal}>{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "code" && (
                <div className={styles.codePanel}>
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
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.projectList}>
            <div className={styles.projectListHeader}>
              <h2 className={styles.projectListTitle}>All projects</h2>
              <span className={styles.projectCount}>
                {filteredProjects.length} shown
              </span>
            </div>

            {filteredProjects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              return (
                <button
                  key={proj.id}
                  onClick={() => selectProject(proj.id)}
                  className={`${styles.projectItem} ${
                    isActive ? styles.projectItemActive : styles.projectItemInactive
                  }`}
                  style={
                    { "--item-accent": proj.accent } as React.CSSProperties
                  }
                >
                  <span className={styles.projCategory}>{proj.category}</span>
                  <span className={styles.projName}>{proj.title}</span>
                  <span className={styles.projDesc}>{proj.description}</span>
                </button>
              );
            })}

            {filteredProjects.length === 0 && (
              <p className={styles.emptyState}>No projects in this category.</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
