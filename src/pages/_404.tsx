import styles from "./Home/style.module.css";

export function NotFound() {
  return (
    <section class={styles.not_found}>
      <h1>404: Not Found</h1>
      <p>It's gone :(</p>
    </section>
  );
}
