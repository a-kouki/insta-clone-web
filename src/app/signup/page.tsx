"use client";

import instalog from '/public/instagram-logo.png'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../page.module.scss'
import { api } from '@/services/api'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'

import axios from 'axios'


export default function Signup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [errorMessage, setErrorMessage] = useState('');
  const [errorField, setErrorField] = useState(''); 


  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') || ''
    const nameuser = formData.get('nameuser') || ''
    const email = formData.get('email') || ''
    const password = formData.get('password') || ''

    if (!name || !nameuser || !email || !password) {
      alert('Preencha todos os campos!')
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toString())) {
    setErrorMessage('Invalid email format.');
    setErrorField('email');
    setLoading(false);
    return;
    }

    const nameuserRegex = /^[a-z0-9_]+$/;
    if (!nameuserRegex.test(nameuser.toString())) {
      setErrorMessage('No whitespace and only lowercase letters.');
      setErrorField('nameuser');
      setLoading(false);
      return;
    }

    try {
      await api.post('/users', { name, nameuser, email, password })
      alert('Cadastro realizado com sucesso!')
      router.push('/instagram')
    } catch (err: unknown) {
        let message = 'Erro desconhecido';
        let field = '';

        if (axios.isAxiosError(err)) {
            message = err.response?.data?.message || err.message;

            // throw new Error("email: Este email já está em uso.")
            const parts = message.split(':');
            if (parts.length === 2) {
            field = parts[0].trim(); 
            message = parts[1].trim(); 
            }
        } else if (err instanceof Error) {
            message = err.message;
        }

        setErrorMessage(message);
        setErrorField(field); 
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.centerpage}>
      <section className={styles.login}>
        <form onSubmit={handleRegister}>
          <Image src={instalog} alt="instagram-logo" />

          <input
            type="email"
            required
            name="email"
            placeholder="email"
            className={`${styles.input} ${errorField === 'email' ? styles.inputError : ''}`}
          />

          <input
            type="text"
            required
            name="name"
            placeholder="name"
            maxLength={15}
            className={`${styles.input} ${errorField === 'name' ? styles.inputError : ''}`}
          />

          <input
            type="text"
            required
            name="nameuser"
            placeholder="name user"
            maxLength={20}
            className={`${styles.input} ${errorField === 'nameuser' ? styles.inputError : ''}`}
          />

          <input
            type="password"
            required
            name="password"
            placeholder="password"
            className={`${styles.input} ${errorField === 'password' ? styles.inputError : ''}`}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Register'}
          </button>

          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
            )}


          <span>Have an account?</span>
          <Link href="/">connect</Link>
        </form>
      </section>
    </div>
  )
}
