import { ChapterTrack } from "./chapter-scroll";
import styles from "./textile-cargo.module.css";

export function StoryChapters() {
  return (
    <section id="collection" className={styles.chapterSection} aria-labelledby="gallery-title">
      <span id="personal-style" className={styles.anchor} aria-hidden="true" />

      <header className={styles.chapterHeader}>
        <p className={styles.eyebrow}>Martha’s eye in practice</p>
        <h2 id="gallery-title">Why these<br />belong together.</h2>
        <p>
          Not a catalog of pieces. Three ways Martha connects color, texture and character across things that were never meant to match.
        </p>
      </header>

      <ChapterTrack />
    </section>
  );
}
