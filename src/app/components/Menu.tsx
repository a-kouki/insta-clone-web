// src/components/Menu/Menu.tsx
"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/Menu.module.scss";
import Image from 'next/image';

// Importando as imagens como variáveis
import instalog from "/public/icons/Instagram-Logo.png";
import instalogMini from "/public/icons/instagram.png";
import homeIcon from "/public/icons/Home.svg";
import searchIcon from "/public/icons/search.png";
import exploreIcon from "/public/icons/explore.svg";
import reelsIcon from "/public/icons/reels.png";
import sendIcon from "/public/icons/send.png";
import heartIcon from "/public/icons/heart.png";
import publicIcon from "/public/icons/public.png";
import profilePic from "/public/icons/profile.jpg";

import { useRouter} from 'next/navigation';

import { deleteCookie } from 'cookies-next';

import { CreatePostModal } from "./CreatePostModal";

import {api} from '@/services/api'


interface Props{
  token:string | null;
}

const Menu: React.FC<Props> = ({token}) => {
  const [searchMode, setSearchMode] = useState(false);
  const [user, setUser] = useState<{profile_img:string} | null>(null)

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  
  
  const toggleSearch = () => {
    setSearchMode(prev => !prev);
  };

  const [getout, setGetOut] = useState(false);
  const router = useRouter()
  async function handleGetOut(){
    deleteCookie('session', {path: "/"})

    router.replace("/")
  }


  useEffect(() => {
  if (!token) return;

  const fetchUser = async () => {
    try {
      const res = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
    }
  };

  fetchUser();
}, [token]);


  const [createPost, setPost] = useState(false);

  useEffect(() => {
    if (!token || searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await api.get(`/search/users?query=${searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSearchResults(res.data); 
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, token]);

    
  return (
    <>

    {getout &&(
          <div className={styles.getOut}>
              <button onClick={handleGetOut}>Get Out</button>
              <button onClick={() => setGetOut(false)}>Cancel</button>
          </div>
      )}

    <div
      className={styles.area_search}
      style={{ display: searchMode ? "flex" : "none" }}
      >
      <div className={styles.input_search}>
        <span>Search</span>
        <input id="search" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
      </div>
      <div className={styles.list_search}>
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <a
              key={user.id}
              href={`/${user.nameuser}`}
              className={styles.search_result_item}
            >
              <img
                src={user.profile_img}
                alt="profile"
                onContextMenu={(e) => e.preventDefault()}
              />
              <div>
                <span>{user.nameuser}</span>
                <span>{user.name}</span>
              </div>
            </a>
          ))
        ) : (
          searchQuery && <p style={{ padding: "1rem", color: "#888" }}>Nenhum usuário encontrado.</p>
        )}
      </div>

    </div>
    
    <div className={searchMode ? styles.menus_change : styles.menu}>
      <a href="/instagram" className={searchMode ? styles.logo_insta_change : styles.logo_insta}>
        <Image 
          src={searchMode ? instalogMini : instalog}
          alt="Instagram Logo" 
        />
      </a>

      <nav className={`${searchMode ? styles.menus_options_change : styles.menus_options} ${styles.font_menus}`}>
          <>
            <a className={styles.home_button} href="/instagram">
              <div>
                <Image src={homeIcon} alt="Home" />
                <p>Home</p>
              </div>
            </a>
            <a className={styles.search_button} onClick={toggleSearch}>
              <div>
                <Image src={searchIcon} alt="Search" />
                <p>Search</p>
              </div>
            </a>
            <a>
              <div>
                <Image src={exploreIcon} alt="Explore" />
                <p>Explore</p>
              </div>
            </a>
            <a>
              <div>
                <Image src={reelsIcon} alt="Reels" />
                <p>Reels</p>
              </div>
            </a>
            <a>
              <div>
                <Image src={sendIcon} alt="Messages" />
                <p>Messages</p>
              </div>
            </a>
            <a>
              <div>
                <Image src={heartIcon} alt="Notifications" />
                <p>Notifications</p>
              </div>
            </a>
            <a>
              <div onClick={() => setPost(true)}>
                <Image src={publicIcon} alt="Create"/>
                <p>Create</p>
              </div>
            </a>
            <a href="/profile">
              <div className={styles.profile_button}>
                <img src={user?.profile_img} alt="Profile" style={{ borderRadius: "15px" }}  onContextMenu={(e) => e.preventDefault()}/>
                <p>Profile</p>
              </div>
            </a>
          </>
      </nav>

      <div className={`${styles.menus_profile} ${styles.font_menus}`}>
          <button onClick={() => setGetOut(!getout)} className={styles.menu_button}>
            <div className={styles.more}>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p>More</p>
          </button>
      </div>
    </div>


    {createPost &&(
      <CreatePostModal token={token} onClose={() =>{setPost(false)}}/>
    )}
  </>
  );
};

export default Menu;
