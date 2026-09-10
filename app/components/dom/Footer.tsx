"use client";

import React, { useEffect, useState } from "react";
import { SITE } from "@/data/site";
import styles from "./footer.module.css";

interface FooterProps {
  onContactClick: () => void;
}

export default function Footer({ onContactClick }: FooterProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: SITE.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      id="contact"
      data-scroll-section="contact"
      className={styles.footer}
    >
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.top}>
          <p className={styles.label}>Contact</p>
          <h2 className={styles.title}>
            Let&rsquo;s build something <em>intelligent</em>.
          </h2>
          <p className={styles.desc}>
            Questions, opportunities, or just a hello. My inbox is open, from
            Kathmandu to wherever you are.
          </p>
          <div className={styles.actions}>
            <button onClick={onContactClick} className={styles.primary}>
              Get in touch
            </button>
            <a href={`mailto:${SITE.email}`} className={styles.secondary}>
              {SITE.email}
            </a>
          </div>
        </div>

        <div className={styles.meta}>
          <div className={styles.socials}>
            <a
              className={styles.socialLink}
              href={SITE.socials.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className={styles.socialLink}
              href={SITE.socials.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <button onClick={onContactClick} className={styles.socialLink}>
              Contact
            </button>
          </div>

          <p className={styles.clock} suppressHydrationWarning>
            Kathmandu <span className={styles.clockTime}>{time ?? "NPT"}</span>
          </p>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Suyog Dahal
          </p>
        </div>
      </div>
    </footer>
  );
}
