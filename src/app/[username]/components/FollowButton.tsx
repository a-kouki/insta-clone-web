import React, { useEffect, useState } from 'react';
import styles from '@/styles/Username.module.scss';
import { api } from '@/services/api';

interface FollowButtonProps {
  profileUserId: string; // ID do perfil visitado
  token: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ profileUserId, token }) => {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFollow = async () => {
      try {
        const response = await api.get(`/checkingfollow/${profileUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        setIsFollowing(false);
      } finally {
        setLoading(false);
      }
    };

    checkFollow();
  }, [profileUserId, token]);

  const handleClick = async () => {
    try {
      if (isFollowing) {
        // unfollow
        await api.delete(`/unfollow`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { followingId: profileUserId },
        });
        setIsFollowing(false);
      } else {
        // follow
        await api.post(
          `/follow`,
          { followingId: profileUserId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error);
    }
  };

  if (loading) {
    return <div className={styles.loader}></div>;
  }

  return (
    <button
      className={`${styles.button} ${isFollowing ? '' : styles.follow}`}
      onClick={handleClick}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
