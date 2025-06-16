'use client';

import { useState } from 'react';
import styles from '@/styles/Username.module.scss';
import Menu from '@/app/components/Menu';
import PostModal from '@/app/components/PostModal';

import FollowButton from '../FollowButton';
import ViewFollows from '@/app/components/ViewFollow';

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

export default function UserProfile({ user, token }: { user: User, token: string }) {

  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "tagged">("posts");
  const [viewFollowings, setFollowings] = useState(false);
  const [viewFollows, setFollows] = useState(false);


  const posts = user?.posts_user?.slice().reverse() || [];

  const currentIndex = posts.findIndex(
    (p) => p.post_img === selectedPost?.post_img
  );

  const handleNextPost = () => {
    if (posts.length === 0) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < posts.length) {
      const nextPost = posts[nextIndex];
      setSelectedPost({
        ...nextPost,
        nameuser: user!.nameuser,
        profile_img: user!.profile_img,
        
      });
    }
  };

  const handlePrevPost = () => {
    if (posts.length === 0) return;
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const prevPost = posts[prevIndex];
      setSelectedPost({
        ...prevPost,
        nameuser: user!.nameuser,
        profile_img: user!.profile_img,
      });
    }
  };

  const isFirstPost = currentIndex === posts.length - 1;
  const isLastPost = currentIndex === 0;

  const profileUserId = user.id;

  return (
    <>
      <Menu token={token}/>
      <div className={styles.profile}>
        <img id="image_profile" src={user.profile_img}  onContextMenu={(e) => e.preventDefault()} alt="Profile" />
        <div className={styles.profile_detail}>
          <div className={styles.first_line_profile}>
            <span>{user.nameuser}</span>
            <FollowButton profileUserId={profileUserId} token={token} />
            <button>Message</button>
            <button>+</button>
            <button style={{ backgroundColor: 'transparent' }}>•••</button>
          </div>

          <div className={styles.second_line_profile}>
            <span>{user.posts_user?.length ?? 0} publications</span>
            <button onClick={() => setFollowings(true)}>{user.followings.length} following</button>
            {viewFollowings ? <ViewFollows token={token} type={'followings'} user={user.id} onClose={() => setFollowings(false)}/> : <></>}
            <button onClick={() => setFollows(true)}>{user.followers.length} followers</button>
            {viewFollows ? <ViewFollows token={token} type={'followers'} user={user.id} onClose={() => setFollows(false)}/> : <></>}
          </div>

          <textarea
            name="textarea"
            rows={5}
            cols={30}
            placeholder={user.description}
            disabled
          ></textarea>
        </div>
      </div>

      <div className={styles.forpadding}>
        <div className={styles.dividerContainer}>
          <hr />
          <div className={styles.yourPostSaved}>
            <button
              className={activeTab === "posts" ? styles.active : ""}
              onClick={() => setActiveTab("posts")}
            >
              <i className="bi bi-grid-3x3"></i> POSTS
            </button>
            <button
              className={activeTab === "reels" ? styles.active : ""}
              onClick={() => setActiveTab("reels")}
            >
              <i className="bi bi-film"></i> REELS
            </button>
            <button
              className={activeTab === "tagged" ? styles.active : ""}
              onClick={() => setActiveTab("tagged")}
            >
              <i className="bi bi-person-bounding-box"></i> TAGGED
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'posts' && (
        <div className={styles.postsArea}>
          {posts.length === 0 ? (
            <>
            <div className={styles.no_posts}>
            <i className="bi bi-camera" style={{fontSize: 80}}></i>
            <span>Posts</span>
            <span>no posts yet.</span>
            </div>
            </>
          ) : (
            posts.map((post, index) => (
              <button
                key={index}
                onClick={() =>
                  setSelectedPost({
                    ...post,
                    nameuser: user.nameuser,
                    profile_img: user.profile_img,
                    post: post.id,
                  })
                }
              >
                <img src={post.post_img}  onContextMenu={(e) => e.preventDefault()} alt={`Post ${index + 1}`} />
              </button>
            ))
          )}
        </div>
      )}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onNext={handleNextPost}
          onPrev={handlePrevPost}
          isFirstPost={isFirstPost}
          isLastPost={isLastPost}
          token={token}
        />
      )}

      {activeTab === "reels" && (
      <div className={styles.postsArea}>
      <div className={styles.taggedArea}>
        <div className={styles.no_posts}>
            <i className="bi bi-film" style={{fontSize: 80}}></i>
            <span>Reels</span>
            <span>No reels yet.</span>
        </div>
      </div>
      </div>
      )}

      {activeTab === "tagged" && (
        <div className={styles.postsArea}>
      <div className={styles.taggedArea}>
        <div className={styles.no_posts}>
            <i className="bi bi-person-square" style={{fontSize: 80}}></i>
            <span>Tagged</span>
            <span>No tagged yet.</span>
        </div>
      </div>
      </div>
      )}


      {viewFollows ? <> </>: <></>} 
    </>
  );
}
