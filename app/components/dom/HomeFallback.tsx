"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import HeroContent from "../content/HeroContent";
import SkillsContent from "../content/SkillsContent";
import WorkContent from "../content/WorkContent";
import ExperienceContent from "../content/ExperienceContent";
import styles from "../../home.module.css";

/** Document-flow version of the site, used when WebGL is unavailable. */
export default function HomeFallback() {
  return (
    <>
      <Navbar activePage="home" />
      <main className={styles.flowMain}>
        <section id="hero" data-scroll-section="hero" className={styles.flowHero}>
          <HeroContent />
        </section>
        <section
          id="skills"
          data-scroll-section="skills"
          className={styles.flowSection}
        >
          <SkillsContent />
        </section>
        <section id="work" data-scroll-section="work" className={styles.flowSection}>
          <WorkContent />
        </section>
        <section
          id="experience"
          data-scroll-section="experience"
          className={styles.flowSection}
        >
          <ExperienceContent />
        </section>
      </main>
      <Footer />
    </>
  );
}
