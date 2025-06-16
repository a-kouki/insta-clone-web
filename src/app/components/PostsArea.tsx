// components/PostsArea.tsx

"use client";
import styles from '@/styles/PostsArea.module.scss'; // Se estiver usando SCSS module
import { Post, User } from '@/app/types'; // ou '@/app/page' dependendo do seu path
 // Importa o tipo Post da página principal
import { useEffect, useState } from 'react';
import { api } from '@/services/api';

import LikeButton from './LikeButton';
import PostModal from './PostModal';


interface PostsAreaProps {
  posts: Post[];
  token: string;
}

function PostsArea({ posts, token }: PostsAreaProps) {

  function tempoRelativo(data: string) {
  const postDate = new Date(data);
  const agora = new Date();
  const diffMs = agora.getTime() - postDate.getTime();
  const diffSeg = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSeg / 60);
  const diffHora = Math.floor(diffMin / 60);
  const diffDia = Math.floor(diffHora / 24);

  if (diffSeg < 60) return 'now';
  if (diffHora < 24) return `${diffHora} h`;
  if (diffDia === 1) return '1d';
  return `${diffDia} d`;
  }

  const [liked, setLiked] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);


  return (
    <>
    <div className={styles.posts_area}>
      {posts.map(({ user, post }) => (
        <div key={post.post_id} className={styles.posts}>
          <div className={styles.details_one}>
            <div className={styles.details_two}>
              <img src={user.profile_img} alt="profile" width={42} style={{ borderRadius: '50%' }}  onContextMenu={(e) => e.preventDefault()} />
              <div>
                <a href={`/${user.id}`}>
                  <button>{user.id}</button> • <button style={{color:'gray'}}>{tempoRelativo(post.data_post)}</button> 
                </a>
                <br />
                <span>{post.music_name}</span>
              </div>
            </div>
            <p>•••</p>
          </div>

          <img className={styles.post_img} src={post.post_img} data-post-id={post.post_id}  onContextMenu={(e) => e.preventDefault()}/>

          <div className={styles.icons}>
            <div className={styles.icons_right}>
              <LikeButton postId={post.post_id} token = {token}/>
              <button onClick={() => setSelectedPost({
                ...post,
                nameuser: user.id,
                profile_img: user.profile_img,
              })}>
                <i className="bi bi-chat"></i>
              </button>
              <button><i className="bi bi-send"></i></button>
            </div>
            <button><i className="bi bi-bookmark"></i></button>
          </div>

          <div className={styles.description}>
            <button>Like by</button>

            <div className={styles.comment_line}>
              <a href={`/${user.id}`}>{user.id}</a>
              <span style={{paddingLeft: '5px'}}>{post.description_post}</span>
            </div>

            <textarea placeholder="Add a comment.."></textarea>
          </div>
        </div>  
      )
      
      )}
    </div>

    {selectedPost && (
     <PostModal
      post={selectedPost}
      onClose={() => setSelectedPost(null)}
      token={token!}
      onNext={() => {}}
      onPrev={() => {}}
      isFirstPost={true}
      isLastPost={true}
    />

    )}


    </>
  );
}

export default PostsArea;