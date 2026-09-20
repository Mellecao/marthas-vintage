import styles from "./textile-cargo.module.css";

export function StitchOutline({ variant = "soft" }: { variant?: "soft" | "wide" }) {
  const path = variant === "wide"
    ? "M3 12 Q7 3 18 5 L83 3 Q97 5 96 18 L98 82 Q96 97 82 96 L17 98 Q3 96 5 82 Z"
    : "M5 16 Q6 5 19 6 L84 4 Q96 7 95 20 L97 83 Q94 96 80 95 L16 97 Q4 94 6 80 Z";

  return (
    <svg className={styles.stitchOutline} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path className={styles.stitchPath} d={path} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function TextileOutline({ variant = "a" }: { variant?: "a" | "b" }) {
  const path = variant === "a"
    ? "M4 13 Q7 2 20 5 L84 3 Q98 8 95 22 L98 82 Q93 98 78 95 L15 98 Q2 92 6 78 Z"
    : "M7 7 Q22 2 38 5 L88 4 Q98 16 94 31 L97 87 Q87 98 72 95 L9 97 Q1 83 5 67 Z";

  return (
    <svg className={styles.textileOutline} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={path} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
