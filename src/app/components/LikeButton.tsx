import React, { useEffect, useState } from 'react';
import styles from '@/styles/Username.module.scss';

import { api } from '@/services/api';

interface LikeButtonProps {
  postId: string; // ID do perfil visitado
  token: string | null;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, token }) => {
  const [isLike, setIsLike] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLike = async () => {
      try {
        const response = await api.get(`/checkinglike/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsLike(response.data.isLike);
      } catch (error) {
        setIsLike(false);
      } finally {
        setLoading(false);
      }
    };

    checkLike();
  }, [postId, token]);

  const handleLike = async () => {
    if (!token) return; // prevenir sem token

    try {
      if (isLike) {
        // Deslike
        await api.delete('/unlike', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: { post_id: postId }, // no axios o DELETE com body usa data
        });
        setIsLike(false);
      } else {
        // Like
        await api.post(
          '/like',
          { post_id: postId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setIsLike(true);
      }
    } catch (err) {
      console.error('Erro ao atualizar like:', err);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <button onClick={handleLike} className="like-btn">
      <i
        className={`bi ${isLike ? 'bi-heart-fill text-red-600' : 'bi-heart'}`}
        style={isLike ? { color: '#ff3040' } : {}}
      ></i>
    </button>
  );
};

export default LikeButton;
