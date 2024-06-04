import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { getSession } from 'next-auth/react'
import {ChangeEvent, FormEvent, useState, useEffect} from 'react'
import styles from './styles.module.css'
import Head from 'next/head'

import { Textarea } from '../../components/textarea'
import {FiShare2} from 'react-icons/fi'
import {FaTrash} from 'react-icons/fa'

import {db} from '../../services/firebaseConnection'
import {addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc} from 'firebase/firestore'


interface HomeProps{
   user: {
      name: string,
      email: string
   }
}

interface TaskProps{
   id: string,
   created: Date,
   isPublic: boolean, 
   task: string,
   email: string,
   userName: string
}

export default function Dashboard( { user }: HomeProps ){
   const [input, setInput] = useState("")
   const [publicTask, setPublicTask] = useState(false)
   const [tasks, setTasks]= useState<TaskProps[]>([])

   useEffect(() =>{
      async function loadTarefas(){
         const tasksRef = collection(db, "tasks")
         const q = query(
            tasksRef,
            orderBy("created", "desc"),
            where("email", "==", user?.email) // when we want to use 'where' in firebase, we should create an index in the collection
         )

         onSnapshot(q, (snapshot) => {
            let list: TaskProps[] = []

            snapshot.forEach((doc) => {
               list.push({
                  id: doc.id,
                  created: doc.data().created,
                  isPublic: doc.data().isPublic,
                  task: doc.data().task,
                  email: doc.data().email,
                  userName: doc.data().userName
               })
            })

            setTasks(list)

         })

      }

      loadTarefas()
   }, [user?.email])

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

   async function handleShare(id: string){
      await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/task/${id}`)
   }

   async function handleDeleteTask(id: string){
      const docRef = doc(db, "tasks", id)
      await deleteDoc(docRef)
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

               {tasks.map((task) => (
                  <article key={task.id} className={styles.task}>
                     {task.isPublic && (
                        <div className={styles.tagContainer}>
                           <label className={styles.tag}>PÚBLICO</label>
                           <button className={styles.shareButton} onClick={ () => handleShare(task.id)}>
                              <FiShare2 size={22} color="#3183ff" />
                           </button>
                        </div>
                     )}
                     <div className={styles.taskContent}>
                        {task.isPublic ? (
                           <Link href={`/task/${task.id}`}>
                              <p>
                                 {task.task}
                              </p>
                           </Link>
                        ) : (
                           <p>
                              {task.task}
                           </p>
                        )}
                        <button className={styles.trashButton} onClick={() => handleDeleteTask(task.id)}>
                           <FaTrash size={24} color="#ea3140" />
                        </button>
                     </div>
                  </article>
               ))}

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