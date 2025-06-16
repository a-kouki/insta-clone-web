import styles from './page.module.scss'
import instacelular from '/public/instagram-celular.png'
import instalog from '/public/instagram-logo.png'
import Image from 'next/image'
import Link from 'next/link'
import {api} from '@/services/api'
import { redirect} from 'next/navigation'
import { cookies } from 'next/headers'

export default function MainPage(){

  async function handleLogin(formdata:FormData){
    "use server"

    const email = formdata.get("email")
    const password = formdata.get("password")

    if(email === "" || password===""){
      return;
    }

    try{
      const response = await api.post("session",{
        email,
        password
      })

      if(!response.data.token){
        return;
      }
      
      const expressTime = 60*60*24*30*1000;
      const cookieStore = await cookies()
      cookieStore.set("session", response.data.token,{
        maxAge:expressTime,
        path: "/",
        httpOnly: false,
        secure:process.env.Node_ENV === "production"
      })

    }catch{
      return;
    }

    redirect("/instagram")
  }

  return(
    <>
    <div className={styles.centerpage}>
      <Image className={styles.celular} 
      src={instacelular}
      alt= 'feed_insta' 
      />
    
      <section className={styles.login}>
        <form action={handleLogin}>
          <Image 
          src={instalog}
          alt ='instagram-logo'
          />

          <input type='email'
          required
          name='email'
          placeholder="name user or email"
          className={styles.input}
          />

          <input type='password'
          required
          name='password'
          placeholder="password"
          className={styles.input}
          />

          <button type="submit">Enter</button>
          <Link href="/signup"> Don't have an account? Sign up</Link>
        </form>
      </section>
    </div>
    </>
  )
}