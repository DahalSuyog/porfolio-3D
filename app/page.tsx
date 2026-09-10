"use client";

import Navbar from "./components/dom/Navbar";
import HomeFallback from "./components/dom/HomeFallback";
import { useWebGLSupport } from "@/lib/use-webgl-support";
import { HOME_SECTIONS, type HomeSectionId } from "@/lib/sections";
import styles from "./home.module.css";

const SPACER_HEIGHTS: Record<HomeSectionId, string> = {
  hero: "110vh",
  skills: "130vh",
  work: "130vh",
  experience: "130vh",
  contact: "100vh",
};

export default function Home() {
  const webgl = useWebGLSupport();

  if (webgl === false) return <HomeFallback />;

  return (
    <>
      <Navbar activePage="home" />
      <main className={styles.main}>
        {HOME_SECTIONS.map((id) => (
          <section
            key={id}
            id={id}
            data-scroll-section={id}
            className={styles.spacer}
            style={{ height: SPACER_HEIGHTS[id] }}
          />
        ))}
      </main>
    </>
  );
}
