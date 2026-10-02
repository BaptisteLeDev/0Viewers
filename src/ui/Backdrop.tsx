import { shapes } from "coolshapes-react";
import styles from "./Backdrop.module.css";

const Flower = shapes.flower[2];
const Star = shapes.star[4];
const Ellipse = shapes.ellipse[1];
const Wheel = shapes.wheel[3];

export function Backdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <Flower size={320} className={`${styles.shape} ${styles.flower}`} />
      <Star size={220} className={`${styles.shape} ${styles.star}`} />
      <Ellipse size={260} className={`${styles.shape} ${styles.ellipse}`} />
      <Wheel size={200} className={`${styles.shape} ${styles.wheel}`} />
    </div>
  );
}
