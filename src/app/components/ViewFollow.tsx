import styles from '@/styles/ViewFollow.module.scss';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';

interface Props {
  token: string;
  type: 'followings' | 'followers';
  user:string;
  onClose: () => void;
}

interface FollowedUser {
  id: string;
  nameuser: string;
  name:string,
  profile_img: string;
}

const ViewFollows: React.FC<Props> = ({ token, type,user, onClose}) => {
  const [viewFollows, setFollowedUsers] = useState<FollowedUser[]>([]);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const res = await api.get(`/listfollow/${type}?userId=${user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFollowedUsers(res.data);
      } catch (error) {
        console.error('Erro ao carregar follows:', error);
      }
    };

    fetchFollowings();
  }, [type, token]);


  return (
    <div className={styles.main} onClick={onClose}>
      <div className={styles.view}>
        {viewFollows.length === 0 ? (
          <span style={{padding:10}}>None user find.</span>
        ) : (
          viewFollows.map((user) => (
            <div key={user.id}>
              <a href={`/${user.nameuser}`}  className={styles.userCard}>
              <img src={user.profile_img}  onContextMenu={(e) => e.preventDefault()} alt="img" />
              <div>
              <span>{user.nameuser}</span>
              <span>{user.name}</span>
              </div>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewFollows;
