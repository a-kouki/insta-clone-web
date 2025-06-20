import UserProfile from './components/users';
import { getCookieServer } from '@/lib/cookiesServer';
import { redirect } from 'next/navigation';
import { api } from '@/services/api';

interface User {
  id: string;
  nameuser: string;
  profile_img: string;
  description: string;
  posts_user: any[];
  followings: string[];
  followers: string[];
}


async function getUser(username: string, token: string): Promise<User | null> {
  try {
    const response = await api.get(`/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // axios não usa cache: 'no-store'
    });

    return response.data;
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return null;
  }
}

export type paramsType = Promise<{ username: string }>;


export default async function Page( props : { params: paramsType }) {
  const { username } = await props.params; 

  const token = await getCookieServer();

  if (!token) redirect('/');

  const user = await getUser(username, token);
  if (!user) {
    return <p>Usuário não encontrado.</p>;
  }

  return <UserProfile user={user} token={token} />;
}


