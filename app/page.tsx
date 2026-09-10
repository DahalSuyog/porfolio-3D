"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "./components/dom/Navbar";
import Footer from "./components/dom/Footer";
import ContactModal from "./components/dom/ContactModal";
import Depth from "./components/dom/Depth";
import { scrollToSection } from "@/lib/lenis";
import { SITE, SKILLS, TIMELINE } from "@/data/site";
import { PROJECTS } from "@/data/projects";
import styles from "./home.module.css";

export default function Home() {
  const [showContactModal, setShowContactModal] = useState(false);
  const openContact = () => setShowContactModal(true);

  return (
    <>
      <Navbar onContactClick={openContact} activePage="home" />

      <main className={styles.main}>
        <section id="hero" data-scroll-section="hero" className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <Depth strength={0.5}>
                <p className={styles.availability}>{SITE.availability}</p>
              </Depth>
              <Depth strength={0.75}>
                <h1 className={styles.heroTitle}>{SITE.name}</h1>
                <p className={styles.heroRole}>{SITE.role}</p>
              </Depth>
              <Depth strength={0.9}>
                <p className={styles.heroIntro}>{SITE.intro}</p>
              </Depth>
              <Depth strength={1}>
                <div className={styles.heroActions}>
                  <Link
                    href="/#work"
                    className={styles.ctaPrimary}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection("work");
                    }}
                  >
                    View work
                  </Link>
                  <button onClick={openContact} className={styles.ctaSecondary}>
                    Contact me
                  </button>
                </div>
              </Depth>
            </div>
            <div className={styles.heroVisual} aria-hidden="true" />
          </div>
          <Depth strength={1}>
            <p className={styles.scrollHint}>Scroll to explore</p>
          </Depth>
        </section>

        <section
          id="skills"
          data-scroll-section="skills"
          className={styles.chapter}
        >
          <div className={styles.chapterInner}>
            <Depth strength={0.55}>
              <header className={styles.chapterHeader}>
                <p className={styles.chapterLabel}>Skills</p>
                <h2 className={styles.chapterTitle}>What I work with</h2>
                <p className={styles.chapterDesc}>
                  A practical toolkit spanning low-level performance, modern web
                  systems, and applied machine learning.
                </p>
              </header>
            </Depth>

            <div className={styles.skillsGrid}>
              {SKILLS.map((skill) => (
                <Depth
                  key={skill.title}
                  strength={1}
                  className={styles.cardDepth}
                >
                  <article className={styles.skillCard}>
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
                </Depth>
              ))}
            </div>
          </div>
        </section>

        <section id="work" data-scroll-section="work" className={styles.chapter}>
          <div className={styles.chapterInner}>
            <Depth strength={0.55}>
              <header className={styles.chapterHeader}>
                <p className={styles.chapterLabel}>Selected work</p>
                <h2 className={styles.chapterTitle}>Projects</h2>
                <p className={styles.chapterDesc}>
                  Focused systems exploring agent learning and computer vision.
                </p>
              </header>
            </Depth>

            <div className={styles.workGrid}>
              {PROJECTS.map((project) => (
                <Depth
                  key={project.id}
                  strength={1}
                  className={styles.cardDepth}
                >
                  <article className={styles.workCard}>
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
                      <span className={styles.workStatLabel}>
                        {project.stat.label}
                      </span>
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
                </Depth>
              ))}
            </div>
          </div>
        </section>

        <section
          id="experience"
          data-scroll-section="experience"
          className={styles.chapter}
        >
          <div className={styles.chapterInner}>
            <Depth strength={0.55}>
              <header className={styles.chapterHeader}>
                <p className={styles.chapterLabel}>Experience</p>
                <h2 className={styles.chapterTitle}>
                  Education &amp; background
                </h2>
              </header>
            </Depth>

            <div className={styles.timeline}>
              {TIMELINE.map((entry) => (
                <Depth key={entry.title} strength={0.85}>
                  <article className={styles.timelineItem}>
                    <span className={styles.timelineDate}>{entry.period}</span>
                    <div>
                      <h3 className={styles.timelineTitle}>{entry.title}</h3>
                      <p className={styles.timelineOrg}>{entry.org}</p>
                      <p className={styles.timelineDesc}>{entry.desc}</p>
                    </div>
                  </article>
                </Depth>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer onContactClick={openContact} />

      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </>
  );
}
