"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/data/site";
import { useUIStore } from "@/lib/ui-store";
import styles from "./content.module.css";

export default function ContactContent() {
  const openContact = useUIStore((state) => state.openContact);
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
    <div className={styles.panel}>
      <div className={styles.contact}>
        <div>
          <p className={styles.label}>Contact</p>
          <h2 className={styles.contactTitle}>
            Let&rsquo;s build something <em>intelligent</em>.
          </h2>
          <p className={styles.contactDesc}>
            Questions, opportunities, or just a hello. My inbox is open, from
            Kathmandu to wherever you are.
          </p>
          <div className={styles.contactActions}>
            <button className={styles.primary} onClick={openContact}>
              Get in touch
            </button>
            <a href={`mailto:${SITE.email}`} className={styles.emailLink}>
              {SITE.email}
            </a>
          </div>
        </div>

        <div className={styles.contactMeta}>
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
            <button className={styles.socialLink} onClick={openContact}>
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
    </div>
  );
}
