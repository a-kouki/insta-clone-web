export interface Post {
    user: User;
    post: Post;
    post_id: string;
    post_img: string;
    data_post: string;
    description_post: string;
    music_name: string;
  }
  
  export interface User {
    id:String;
    name: string;
    nameuser: string;
    profile_img: string;
    description: string;
    follower: string[];
    following: string[];
    posts_user: Post[];
  }
  