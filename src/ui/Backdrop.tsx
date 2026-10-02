import { shapes } from "coolshapes-react";
import styles from "./Backdrop.module.css";

const Flower = shapes.flower[2];
const Star = shapes.star[4];
const Ellipse = shapes.ellipse[1];

export function Backdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <Flower size={160} className={`${styles.shape} ${styles.flower}`} />
      <Star size={140} className={`${styles.shape} ${styles.star}`} />
      <Ellipse size={150} className={`${styles.shape} ${styles.ellipse}`} />
    </div>
  );
}
