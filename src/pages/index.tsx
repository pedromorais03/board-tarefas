import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "../styles/home.module.css";

import HeroImage from '../../public/assets/hero.png'

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image className={styles.hero} src={HeroImage}  alt="Logo Tarefas+" priority={true} />
        </div>
        <h1 className={styles.title}>Sistema feito para voce organizar <br /> seus estudos e tarefas</h1>
      </main>
      
    </div>
  );
}
