"use client";

import Footer from "../components/dom/Footer";
import DemoContent from "../components/content/DemoContent";
import styles from "../home.module.css";

/** Document-flow version of the demos page, used when WebGL is unavailable. */
export default function DemosFallback() {
  return (
    <main className={styles.flowMain}>
      <section
        id="demos"
        data-scroll-section="demos"
        className={styles.flowSection}
      >
        <DemoContent />
      </section>
      <Footer />
    </main>
  );
}
