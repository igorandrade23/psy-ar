import { SlideAudioButton } from "./components/SlideAudioButton";
import { SiteLoader } from "./components/SiteLoader";
import { SlideContent } from "./components/SlideContent";
import { SlideFeedMedia } from "./components/SlideFeedMedia";
import { slides } from "./lib/slides";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <SiteLoader />
      <main className={styles.page}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Capoeira em corpo e história</h1>
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
    </>
  );
}
