import { SlideAudioButton } from "./components/SlideAudioButton";
import { SlideContent } from "./components/SlideContent";
import { SlideFeedMedia } from "./components/SlideFeedMedia";
import { slides } from "./lib/slides";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.kicker}>Museu de Capoeira</span>
        <h1 className={styles.title}>Museu Virtual da Capoeira</h1>
      </section>

      <section className={styles.feed} aria-label="Feed de imagens e descrições">
        {slides.map((slide, index) => (
          <article key={slide.assetId} id={slide.assetId} className={styles.post}>
            <SlideFeedMedia slide={slide} />
            <SlideContent
              slide={slide}
              className={styles.postBody}
              titleClassName={styles.postTitle}
              afterTitle={
                slide.kind === "model" && slide.audio ? <SlideAudioButton slide={slide} /> : null
              }
              mediaContext="site"
              tone="dark"
            />
          </article>
        ))}
      </section>
    </main>
  );
}
