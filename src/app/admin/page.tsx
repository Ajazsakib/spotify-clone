'use client';
import React, { useEffect, useContext, useState } from 'react';
import { AppContext } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import Header from './Header';
import './admin.css';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import db from '@/firebase/firebase';
import Link from 'next/link';

const SongsList = () => {
  const { dispatch } = useContext(AppContext);

  const [songs, setSongs] = useState<FilteredData[]>([]);

  const router = useRouter();

  const songsRef = collection(db, 'songs');

  interface FilteredData {
    [key: string]: string | undefined;
    artist?: string;
    category_id?: string;
    created_by?: string;
    id?: string;
    src?: string;
    title?: string;
  }

  const getSongs = async () => {
    const data = await getDocs(songsRef);
    const filteredData: FilteredData[] = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log(filteredData);
    setSongs(filteredData);
  };

  const deleteSong = async (id: string | undefined) => {
    if (id !== undefined) {
      const docRef = doc(db, 'songs', id);
      deleteDoc(docRef)
        .then(() => {
          console.log('Entire Document has been deleted successfully.');
        })
        .catch((error) => {
          console.log(error);
        });

      getSongs();
    }
  };

  useEffect(() => {
    getSongs();
    const username = localStorage.getItem('username');

    if (username) {
      const userObject = JSON.parse(username);
      if (userObject.name != '' && userObject.isAdmin == true) {
        dispatch({ type: 'IS_LOGGED_IN', payload: true });
      } else {
        dispatch({ type: 'IS_LOGGED_IN', payload: false });

        router.push('/login');
      }
    } else {
      dispatch({ type: 'IS_LOGGED_IN', payload: false });

      router.push('/login');
    }
  }, []);

  return (
    <>
      <Header />
      <div className="songs-wraper">
        <h2>Songs List</h2>
        <div className="add-song">
          <Link href="/admin/addSong">
            <button className="btn btn-secondary">Add Songs</button>
          </Link>
        </div>
        <div className="songs">
          {songs &&
            songs.map((song) => {
              return (
                <div className="song-box" key={song.id}>
                  <p>{song.title}</p>
                  <span
                    className="material-symbols-outlined"
                    onClick={() => {
                      deleteSong(song.id);
                    }}
                  >
                    delete
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default SongsList;
