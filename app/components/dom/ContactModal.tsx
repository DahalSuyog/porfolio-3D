"use client";

import React from "react";
import { useUIStore } from "@/lib/ui-store";
import styles from "./contact-modal.module.css";

export default function ContactModal() {
  const contactOpen = useUIStore((state) => state.contactOpen);
  const closeContact = useUIStore((state) => state.closeContact);

  if (!contactOpen) return null;

  const email = "sonofdahal@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    alert("Email copied to clipboard.");
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Contact"
      onClick={closeContact}
    >
      <div className={styles.content} onClick={(event) => event.stopPropagation()}>
        <button onClick={closeContact} className={styles.close} aria-label="Close">
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className={styles.iconBox}>
          <span className="material-symbols-outlined text-2xl">mail</span>
        </div>

        <h3 className={styles.title}>Get in touch</h3>
        <p className={styles.subtitle}>
          Questions, opportunities, or just a hello. My inbox is open.
        </p>

        <div className={styles.emailBox}>
          <span className={styles.emailLabel}>Email</span>
          <span className={styles.emailAddress}>{email}</span>
          <button onClick={handleCopy} className={styles.copyBtn}>
            <span className="material-symbols-outlined text-sm">
              content_copy
            </span>
            Copy address
          </button>
        </div>

        <div className={styles.socialSection}>
          <span className={styles.socialLabel}>Elsewhere</span>
          <div className={styles.socialLinks}>
            <a
              href="https://github.com/DahalSuyog"
              target="_blank"
              rel="noreferrer"
              className={styles.socialLink}
              aria-label="Open GitHub profile"
              title="Open GitHub profile"
            >
              <svg
                className={styles.socialIcon}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.24c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.72.08-.72 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.48-1.34-5.48-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.53.12-3.19 0 0 1.01-.32 3.3 1.23A11.44 11.44 0 0 1 12 6.08c1.02 0 2.05.14 3.01.41 2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.89.12 3.19.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.08.81 2.18v3.24c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/suyog-dahal-452801274/"
              target="_blank"
              rel="noreferrer"
              className={styles.socialLink}
              aria-label="Open LinkedIn profile"
              title="Open LinkedIn profile"
            >
              <svg
                className={styles.socialIcon}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
