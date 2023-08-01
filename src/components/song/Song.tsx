'use client';
import React, { useContext } from 'react';
import { songs } from './songs';
import Link from 'next/link';
import { AppContext } from '@/contexts/AppContext';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import db from '@/firebase/firebase';
interface SongProps {
  name: string;
  key: string;
  itemId: string;
}

const Song: React.FC<SongProps> = ({ name, itemId }) => {
  const { state, dispatch } = useContext(AppContext);
  const selectedcategoryFirstSong = async (itemId: string) => {
    if (state.isLoggedIn) {
      const categoryId = state.category.find(
        (item: { name: string; id: string }) => {
          return item.name == name;
        }
      ) || { name: '', id: '' };

      const q = query(
        collection(db, 'songs'),
        where('category_id', '==', categoryId.id)
      );
      let fetchedList;
      await getDocs(q).then((querySnapshot) => {
        const songsList = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        fetchedList = songsList;
        dispatch({ type: 'SET_SONGS', payload: songsList });
      });

      dispatch({
        type: 'PLAY_SONG',
        payload: 0,
      });

      // const playing = bool ? true : !state.isPlaying;
      if (state?.songs[0]?.category_id === itemId) {
        dispatch({ type: 'IS_PLAYING', payload: !state.isPlaying });
      } else {
        dispatch({ type: 'IS_PLAYING', payload: true });
      }
    } else {
      dispatch({
        type: 'LOGIN_POPUP',
        payload: true,
      });
    }
  };

  return (
    <div className="songsbox">
      <div className="img">
        <img src="images/song.jpg" />
      </div>
      <h4>{name}</h4>

      <p>Get Jiggy with 90s dhinchak beats. Cover Se</p>
      <Link
        href=""
        onClick={() => {
          selectedcategoryFirstSong(itemId);
        }}
      >
        <div className="player-icon">
          <span className="material-symbols-outlined">
            {state.isPlaying && state?.songs[0]?.category_id === itemId
              ? 'pause_circle'
              : 'play_circle'}
          </span>
          {/* <span className="material-symbols-outlined">pause_circle</span> */}
        </div>
      </Link>
    </div>
  );
};

export default Song;
