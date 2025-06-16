import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/PostModal.module.scss";

import LikeButton from "./LikeButton";

import { api } from "@/services/api";

import CommentBox, { CommentBoxHandle } from "./Comments";


type PostModalProps = {
  post: {
    post_id: string;
    post_img: string;
    music_name: string;
    description_post: string;
    nameuser: string;
    profile_img: string;
    data_post?: string;
    likes?: string[];
    comments?: {
      user: {
        nameuser: string;
        profile_img: string;
      };
      comment: string;
      createdAt: string;
    }[];

  };
 
  onClose: () => void;
  token: string;
  onNext?: () => void;
  onPrev?: () => void;
  isFirstPost?: boolean;
  isLastPost?: boolean;
};

export default function PostModal({ post, onClose, onNext, onPrev, isFirstPost, isLastPost, token }: PostModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && !isLastPost) {e.preventDefault(); onNext?.()}
      else if (e.key === "ArrowLeft" && !isFirstPost) {e.preventDefault(); onPrev?.()}
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFirstPost, isLastPost]);


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
    return `${diffDia} d`
  }

  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    async function checkOwnership() {
      try {
        const res = await api.get(`/api/check-post-owner?post_id=${post.post_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.data;
        setIsOwner(data.isOwner);
      } catch (err) {
        console.error("Erro ao verificar propriedade do post", err);
      }
    }

    checkOwnership();
  }, [post.post_id, token]);

  const [editPost, editPostStatus] = useState(false);

  
  const deletePost = async () => {
  if (!window.confirm("Tem certeza que deseja excluir este post?")) return;

  try {
    const res = await api.delete(`/api/deletepost?post_id=${post.post_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.data;
  
    if (data.success) {
      alert("Post delete with success.");
      onClose(); // Fecha o modal (ou atualize o estado do frontend)
    } else {
      alert("Erro ao deletar: " + (data.error || "erro desconhecido"));
    }
  } catch (err) {
    console.error("Erro ao deletar post:", err);
    alert("Erro de conexão ao tentar deletar o post.");
  }
};

// Dentro do seu componente:
const commentBoxRef = useRef<CommentBoxHandle>(null);


  return (
    <>
    <div className={styles.post_view_center} onClick={onClose}>
      <div className={styles.post_view} onClick={(e) => e.stopPropagation()}>
        {/* Navegação lateral */}
        {!isLastPost && (
          <button className={styles.navLeft} onClick={onPrev}>{'<'}</button>
        )}
        {!isFirstPost && (
          <button className={styles.navRight} onClick={onNext}>{'>'}</button>
        )}
        {/* Imagem/Vídeo */}
        <div className={styles.img_or_Video}>
          <img id="post_img" src={post.post_img} alt="Post"  onContextMenu={(e) => e.preventDefault()}/>
        </div>

        {/* Conteúdo do post */}
        <div className={styles.about_post}>
          <div className={styles.details_one}>
            <div className={styles.details_two}>
              <img src={post.profile_img} style={{ width: '50px', borderRadius: '50%' }}  onContextMenu={(e) => e.preventDefault()}/>
              <div>
                <a href={`./${post.nameuser}`} >{post.nameuser}</a><br/>
                <span>{post.music_name}</span>
              </div>
            </div>
            {isOwner && (
              editPost ? 
              (
              <>
              <div className={styles.editspost}>
                <div>
                  <button style={{color:'red'}} onClick={deletePost}>delete</button>
                  <hr></hr>
                  <button>share</button>
                  <hr></hr>
                  <button onClick={() => editPostStatus(false)}>cancel</button>
                </div>
              </div>
                <button onClick={() => editPostStatus(false)}>•••</button>
              </>
              ) 
              : 
              (<button onClick={() => editPostStatus(true)}>•••</button>)
            )}
          </div>

          <div className={styles.area_comment}>
            <div className={styles.each_comment}>
              <img src={post.profile_img} style={{ width: '50px', borderRadius: '50%' }}  onContextMenu={(e) => e.preventDefault()} />
              <div className={styles.comment}>
                <div className={styles.comment_line}>
                  <a href={`./${post.nameuser}`}>{post.nameuser}</a>
                  <span style={{paddingLeft: '5px'}}>{post.description_post}</span>
                </div>
                <div className={styles.data_like_res}>
                  {/*<span>{post.data_post ? tempoRelativo(post.data_post) : ""}</span>
                  <span>{post.likes?.length ?? 0} likes</span>*/}
                  <span>Responder</span>
                </div>
              </div>
              <img src="./icons/coracao.png" width="10px"  onContextMenu={(e) => e.preventDefault()}/>
            </div>

            {post.comments?.map((comment, idx) => (
            <div key={idx} className={styles.each_comment}>
              <img
                src={comment.user.profile_img}
                style={{ width: '50px', borderRadius: '50%' }}
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className={styles.comment}>
                <div className={styles.comment_line}>
                  <a href={`./${comment.user.nameuser}`}>{comment.user.nameuser}</a>
                  <span style={{ paddingLeft: '5px' }}>{comment.comment}</span>
                </div>
                <div className={styles.data_like_res}>
                  <span>Responder</span>
                </div>
              </div>
              <img src="./icons/coracao.png" width="10px"  onContextMenu={(e) => e.preventDefault()}/>
            </div>
          ))}

          </div>
          

          <div className={styles.icons}>
            <div className={styles.icons_right}>
              <LikeButton postId={post.post_id} token={token}/>
              <button onClick={() => commentBoxRef.current?.focusTextarea()}>
                <i className="bi bi-chat"></i>
              </button>
              <button><i className="bi bi-send"></i></button>
            </div>
            <button><i className="bi bi-bookmark"></i></button>
          </div>

          <div><button>Liked by</button></div>

          <CommentBox token={token} postId={post.post_id} ref={commentBoxRef}/>

        </div>
      </div>

      <div className={styles.modal_background} onClick={onClose}></div>
    </div>
    </>
  );
}
