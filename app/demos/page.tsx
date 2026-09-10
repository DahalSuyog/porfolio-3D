"use client";

import { Suspense } from "react";
import Navbar from "../components/dom/Navbar";
import DemosFallback from "./DemosFallback";
import DemosUrlSync from "./DemosUrlSync";
import { useWebGLSupport } from "@/lib/use-webgl-support";
import styles from "../home.module.css";

const SPACER_HEIGHTS: Record<string, string> = {
  demos: "170vh",
  contact: "100vh",
};

export default function DemosPage() {
  const webgl = useWebGLSupport();

  return (
    <>
      <Navbar activePage="demos" />
      <Suspense fallback={null}>
        <DemosUrlSync />
      </Suspense>

      {webgl === false ? (
        <DemosFallback />
      ) : (
        <main className={styles.main}>
          {Object.entries(SPACER_HEIGHTS).map(([id, height]) => (
            <section
              key={id}
              id={id}
              data-scroll-section={id}
              className={styles.spacer}
              style={{ height }}
            />
          ))}
        </main>
      )}
    </>
  );
}
