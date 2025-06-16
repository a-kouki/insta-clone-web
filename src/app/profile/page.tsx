import ProfileClient from './components'
import { getCookieServer } from '@/lib/cookiesServer'
import { api } from '@/services/api';

interface User {
  listfollows: any[];
  id: string;
  nameuser: string;
  profile_img: string;
  description: string;
  posts_user: any[];
  followings: any[];
  followers: any[];
  followerId: string;
}

async function getUserAndToken(): Promise<{ user: User | null, token: string | null }> {
  const token = await getCookieServer();
  if (!token) return { user: null, token: null };

  try {
    const response = await api.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = response.data;
    return { user, token };
  } catch (error) {
    return { user: null, token };
  }
}

export default async function ProfilePage() {
  const { user, token } = await getUserAndToken();

  if (!user) return <p>Usuário não encontrado ou não autorizado</p>;

  return <ProfileClient user={user} token={token!} />;
}
