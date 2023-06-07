'use client';

import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from './page.module.css';
import Head from 'next/head';
import Header from '../components/Header/Header';
import Song from '../components/song/Song';
const inter = Inter({ subsets: ['latin'] });
import { songs } from '../components/song/songs';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import db from '@/firebase/firebase';
import Link from 'next/link';
import Wrapper from '@/components/wrapper/Wrapper';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const { state, dispatch } = useContext(AppContext);
  const songsCategoryRef = collection(db, 'category');

  const getCategory = async () => {
    const data = await getDocs(songsCategoryRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    dispatch({ type: 'FETCH_CATEGORY', payload: filteredData });
  };

  useEffect(() => {
    getCategory();
    const username = localStorage.getItem('username');
    if (username != '') {
      dispatch({ type: 'IS_LOGGED_IN', payload: true });
    }
  }, []);

  return (
    <Wrapper>
      <main>
        <div className="songslist">
          <h2>Songs List</h2>
          <div className="songslist-content">
            {state.category.length > 0 &&
              state.category.map((item) => {
                return (
                  <>
                    <Link href={`/category/${item.name}`}>
                      <Song key={item.id} name={item.name} />
                    </Link>
                  </>
                );
              })}
          </div>
        </div>
      </main>
    </Wrapper>
  );
}
