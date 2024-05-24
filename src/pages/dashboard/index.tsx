import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import {ChangeEvent, FormEvent, useState} from 'react'
import styles from './styles.module.css'
import Head from 'next/head'

import { Textarea } from '../../components/textarea'
import {FiShare2} from 'react-icons/fi'
import {FaTrash} from 'react-icons/fa'

import {db} from '../../services/firebaseConnection'
import {addDoc, collection} from 'firebase/firestore'


interface HomeProps{
   user: {
      name: string,
      email: string
   }
}

export default function Dashboard( { user }: HomeProps ){
   const [input, setInput] = useState("")
   const [publicTask, setPublicTask] = useState(false)

   function handleChangePublic(e: ChangeEvent<HTMLInputElement>){
      setPublicTask(e.target.checked)
   }

   async function handleRegisterTask(e: FormEvent){
      e.preventDefault()

      if(input === '')
         return

      try{
         await addDoc(collection(db, "tasks"), {
            task: input,
            isPublic: publicTask,
            created: new Date(),
            userName: user?.name,
            email: user?.email
         })

         setInput("")
         setPublicTask(false)

      }catch(err){
         console.log(err)
      }
   }

   return(
      <div className={styles.container}>
         <Head>
            <title> Meu painel de tarefas </title>
         </Head>

         <main className={styles.main}>
            <section className={styles.content}>
               <div className={styles.contentForm}>
                  <h1 className={styles.title}>Qual sua tarefa?</h1>
                  
                  <form onSubmit={handleRegisterTask}>
                     <Textarea 
                      placeholder='Digite sua tarefa' 
                      value={input} 
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                     />
                     <div className={styles.checkboxArea}>
                        <input 
                         className={styles.checkbox} 
                         type="checkbox"
                         checked={publicTask}
                         onChange={handleChangePublic}
                        />
                        <label>Deixar tarefa pública</label>
                     </div>

                     <button type="submit" className={styles.button}>Registrar</button>
                  </form>
               </div>
            </section>

            <section className={styles.taskContainer}>   
               <h1>Minhas tarefas</h1>

               <article className={styles.task}>
                  <div className={styles.tagContainer}>
                     <label className={styles.tag}>PÚBLICO</label>
                     <button className={styles.shareButton}>
                        <FiShare2 size={22} color="#3183ff" />
                     </button>
                  </div>
                  <div className={styles.taskContent}>
                     <p>
                        Minha task
                     </p>
                     <button className={styles.trashButton}>
                        <FaTrash size={24} color="#ea3140" />
                     </button>
                  </div>
               </article>
            </section>
         </main>
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
      //retornando se tiver algum usuario logado
      props: {
         user: {
            name: session?.user?.name,
            email: session?.user?.email
         }
      }
   }
}