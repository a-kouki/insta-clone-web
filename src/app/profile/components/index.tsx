'use client';

import { use, useState } from 'react';
import styles from '@/styles/Username.module.scss';
import Menu from '@/app/components/Menu';
import PostModal from '../../components/PostModal';
import { deleteCookie } from 'cookies-next';
import { useRouter} from 'next/navigation';
import { api } from '@/services/api';
import ViewFollows from '@/app/components/ViewFollow';

interface User {
  id: string;
  nameuser: string;
  profile_img: string;
  description: string;
  posts_user: any[];
  followings: any[];
  followers: any[];

}

export default function ProfileClient({ user, token }: { user: User, token: string }) {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [viewFollowings, setFollowings] = useState(false);
  const [viewFollows, setFollows] = useState(false);

  const posts = user.posts_user?.slice().reverse() || [];

  const currentIndex = posts.findIndex(p => p.post_img === selectedPost?.post_img);

  const handleNextPost = () => {
    if (posts.length === 0) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < posts.length) {
      const nextPost = posts[nextIndex];
      setSelectedPost({
        ...nextPost,
        nameuser: user.id,
        profile_img: user.profile_img,
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
        nameuser: user.id,
        profile_img: user.profile_img,
      });
    }
  };

  const isFirstPost = currentIndex === posts.length - 1; // último
  const isLastPost = currentIndex === 0; // primeiro

  //apagar cookie
  const [getout, setGetOut] = useState(false);
  const router = useRouter()
  async function handleGetOut(){
    deleteCookie('session', {path: "/"})

    router.replace("/")
  }
  

  return (
    <>
      <Menu token={token}/>
      {getout &&(
          <div className={styles.getOut}>
              <button onClick={handleGetOut}>Get Out</button>
              <button onClick={() => setGetOut(false)}>Cancel</button>
          </div>
      )}

      <div className={styles.profile}>
        <img id="image_profile" src={user.profile_img}  onContextMenu={(e) => e.preventDefault()} alt="Profile" />
        <div className={styles.profile_detail}>
          <div className={styles.first_line_profile}>
            <span>{user.nameuser}</span>
            <button id="follow_user" onClick={() => router.push('/accounts/edit')}>Edit Profile</button>
            <button>Archived Items</button>
            <button onClick={() => setGetOut(!getout)}>
              <i className="bi bi-gear-wide"></i>
            </button>
          </div>
          
          <div className={styles.second_line_profile}>
            <span>{user.posts_user.length} publications</span>
            <button onClick={() => setFollowings(true)}>{user.followings.length} following</button>
            {viewFollowings ? <ViewFollows token={token} type={'followings'} user={user.id} onClose={() => setFollowings(false)}/> : <></>}
            <button onClick={() => setFollows(true)}>{user.followers.length} followers</button>
            {viewFollows ? <ViewFollows token={token} type={'followers'} user={user.id}  onClose={() => setFollows(false)}/> : <></>}
          </div>
          
        
          <textarea
            name="textarea"
            rows={5}
            cols={30}
            placeholder={user.description}
            disabled
          />
        </div>
      </div>

      <div className={styles.forpadding}>
        <div className={styles.dividerContainer}>
          <hr />
          <div className={styles.yourPostSaved}>
            <button
              className={activeTab === 'posts' ? styles.active : ''}
              onClick={() => setActiveTab('posts')}
            >
              <i className="bi bi-grid-3x3"></i> POSTS
            </button>
            <button
              className={activeTab === 'saved' ? styles.active : ''}
              onClick={() => setActiveTab('saved')}
            >
              <i className="bi bi-bookmark"></i> SAVED
            </button>
            <button
              className={activeTab === 'tagged' ? styles.active : ''}
              onClick={() => setActiveTab('tagged')}
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
            <span>Share photos</span>
            <span>When you share photos, they will appear on your profile.</span>
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

      {activeTab === 'saved' && 
      <div className={styles.postsArea}>
        <div className={styles.savedArea}>
        <div className={styles.no_posts}>
            <i className="bi bi-bookmark" style={{fontSize: 80}}></i>
            <span>Save posts</span>
            <span>Save photos and videos you want to see again.</span>
        </div>
      </div>
      </div>
      }

      {activeTab === "tagged" && 
      <div className={styles.postsArea}>
      <div className={styles.taggedArea}>
        <div className={styles.no_posts}>
            <i className="bi bi-person-square" style={{fontSize: 80}}></i>
            <span>Photos with you</span>
            <span>When people tag you in photos, they'll appear here.</span>
        </div>
      </div>
      </div>
      }
    </>
  );
}
