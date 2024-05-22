import Head from "next/head";
import Image from "next/image";
import styles from "../styles/home.module.css";

import HeroImage from '../../public/assets/hero.png'

export default function Home() {
  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image className={styles.hero} src={HeroImage}  alt="Logo Tarefas+" priority={true} />
        </div>
        <h1 className={styles.title}>Sistema feito para voce organizar <br /> seus estudos e tarefas</h1>

        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+7 posts</span>
          </section>
          <section className={styles.box}>
            <span>+99 comentários</span>
          </section>
        </div>
      </main>

    </div>
  );
}
