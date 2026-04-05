import type { Slide } from "../lib/slides";
import type { ReactNode } from "react";
import styles from "./SlideContent.module.css";

type SlideContentProps = {
  slide: Slide;
  expanded?: boolean;
  collapsible?: boolean;
  onToggle?: () => void;
  className?: string;
  titleClassName?: string;
  compact?: boolean;
  tone?: "light" | "dark";
  mediaContext?: "site" | "ar";
  afterTitle?: ReactNode;
};

export function SlideContent({
  slide,
  expanded = true,
  collapsible = false,
  onToggle,
  className,
  titleClassName,
  compact = false,
  tone = "light",
  mediaContext,
  afterTitle
}: SlideContentProps) {
  const visibleMediaSources = slide.mediaSources?.filter(
    (source) => !source.contexts || !mediaContext || source.contexts.includes(mediaContext)
  );

  return (
    <div
      className={[
        styles.content,
        tone === "dark" ? styles.toneDark : "",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.titleRow}>
        <h2 className={[styles.title, compact ? styles.titleCompact : "", titleClassName].filter(Boolean).join(" ")}>
          {slide.title}
        </h2>
        {afterTitle}
      </div>
      <p className={expanded ? styles.descriptionExpanded : styles.descriptionCollapsed}>
        {slide.description}
      </p>
      {expanded ? <p className={styles.details}>{slide.details}</p> : null}
      {expanded ? (
        <div className={styles.references}>
          <span className={styles.referencesTitle}>Referências</span>
          <ul className={styles.referencesList}>
            {slide.references.map((reference) => (
              <li key={reference}>{reference}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {expanded && visibleMediaSources?.length ? (
        <div className={styles.references}>
          <span className={styles.referencesTitle}>Fontes da mídia</span>
          <ul className={styles.referencesList}>
            {visibleMediaSources.map((source) => (
              <li key={source.label}>
                {source.url ? (
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                ) : (
                  source.label
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {collapsible ? (
        <button
          className={styles.textToggle}
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
        >
          {expanded ? "Recolher" : "Mostrar mais"}
        </button>
      ) : null}
    </div>
  );
}
