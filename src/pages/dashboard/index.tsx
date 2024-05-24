import { GetServerSideProps } from 'next'
import styles from './styles.module.css'
import Head from 'next/head'

import { getSession } from 'next-auth/react'

export default function Dashboard(){
   
   return(
      <div className={styles.container}>
         <Head>
            <title> Meu painel de tarefas </title>
         </Head>

         <h1>Pg painel</h1>
      </div>
   )
}

export const getServerSideProps : GetServerSideProps = async ({req}) => {
   //pegando as infos da session no lado do servidor
   const session = await getSession({ req })

   //verificando user logado
   if(!session?.user){
      return{
         redirect: {
            destination: '/',
            permanent: false
         }
      }
   }


   return {
      props: {
         
      }
   }
}