//[id] -> shows that we gonna receive a parameter in the route. as NextJS use the fodler's name to create a new route, the [any].tsx inside the folder indicates a route param
import Head from 'next/head'
import styles from './styles.module.css'
import { GetServerSideProps } from 'next'

import {db} from '../../services/firebaseConnection'
import {doc, collection, query, where, getDoc} from 'firebase/firestore'
import { redirect } from 'next/dist/server/api-utils'
import { Textarea } from '@/src/components/textarea'

interface TaskProps{
   item: {
      task: string,
      isPublic: boolean, 
      created: Date,
      email: string,
      userName: string,
      taskId: string,
   }
}


export default function Task({ item } : TaskProps){
   return(
      <div className={styles.container}>
         <Head>
            <title>Detalhes da Tarefa</title>
         </Head>
         <main className={styles.main}>
            <h2>Tarefa</h2>
            <article className={styles.task}>
               <p>{item?.task}</p>
            </article>
         </main>

         <section className={styles.commentsContainer}>
            <h2>Deixar comentário</h2>
            <form>
               <Textarea placeholder='Digite seu comentário'/>
               <button className={styles.button}>Comentar</button>
            </form>
         </section>
      </div>
   )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
   //params?.id -> its the file's name
   const id = params?.id as string

   const docRef = doc(db, "tasks", id)

   const snapshot = await getDoc(docRef)
   if(snapshot.data() === undefined){
      return{
         redirect:{
            destination: '/',
            permanent: false,
         },
      }
   }

   if(!snapshot.data()?.isPublic){
      return{
         redirect:{
            destination: '/',
            permanent: false,
         },
      }
   }
   
   const miliseconds = snapshot.data()?.created?.seconds * 1000

   const task = {
      task: snapshot.data()?.task,
      isPublic: snapshot.data()?.isPublic,
      created: new Date(miliseconds).toLocaleDateString(),
      email: snapshot.data()?.email,
      userName: snapshot.data()?.userName,
      taskId: id
   }
   console.log(task)

   return {
      props: {
         item: task,
      }
   }
}