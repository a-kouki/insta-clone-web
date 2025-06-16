'use client';

import { useEffect, useState } from 'react';
import PostsArea from '../../components/PostsArea';
import Menu from '@/app/components/Menu';
import { Post } from '@/app/types';
import { api } from '@/services/api';

interface ClientAppProps {
  token: string;
}

export default function ClientApp({ token }: ClientAppProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchPosts = async (currentPage = 1) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await api.get(`/instagram`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //if (!res.ok) throw new Error(`Erro: ${res.status}`);
      const data = await res.data;
      setPosts(prev => [...prev, ...data.post]);
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPosts(page);
  }, [page, token]);

  useEffect(() => {
    if (!token) return;

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        !loading
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, token]);

  return (
    <main>
      <Menu token={token} />
      <PostsArea posts={posts} token={token} />
    </main>
  );
}
