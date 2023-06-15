'use client';
import React, { useContext, useEffect } from 'react';
import Header from '@/components/Header/Header';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import db from '@/firebase/firebase';
import { AppContext } from '../../../contexts/AppContext';
import Wrapper from '@/components/wrapper/Wrapper';
const index = ({ params }) => {
  const { state, dispatch } = useContext(AppContext);
  const { category, currentSongIndex, isPlaying } = state;

  var songsCategoryRef = collection(db, 'category');

  const getCategoryData = async () => {
    const categoryId = category.find((item) => {
      return item.name == params.name;
    });

    console.log(categoryId, 'from parameter');
    const q = query(
      collection(db, 'songs'),
      where('category_id', '==', categoryId.id)
    );

    await getDocs(q).then((querySnapshot) => {
      const songsList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      dispatch({ type: 'SET_SONGS', payload: songsList });
    });
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  const selectedSong = (index) => {
    dispatch({
      type: 'PLAY_SONG',
      payload: index,
    });
    dispatch({ type: 'IS_PLAYING', payload: !isPlaying });
  };

  return (
    <Wrapper>
      <div>
        <div className="page-body">
          <div className="current-song-profile">
            <div className="img">
              <img src="../images/song.jpg" />
            </div>
            <div className="text">
              <p>Playlist</p>
              <h1 className="big-heading">{params.name} Swagger</h1>
              <p>Cover - Movie Name</p>
              <ul>
                <li>100,000 - likes</li>
                <li>50 - Songs</li>
              </ul>
            </div>
          </div>
          <div className="songs-table">
            <table>
              <thead>
                <tr>
                  <td>#</td>
                  <td>Title</td>
                  <td>Album</td>
                  <td>Date Added</td>
                  <td>
                    <span className="material-symbols-outlined">schedule</span>
                  </td>
                </tr>
              </thead>
              <tbody>
                {state.songs.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td>
                        <span
                          className="material-symbols-outlined"
                          onClick={() => {
                            selectedSong(index);
                          }}
                        >
                          {currentSongIndex == !index
                            ? 'play_arrow'
                            : currentSongIndex == index && isPlaying
                            ? 'pause'
                            : 'play_arrow'}
                        </span>
                      </td>
                      <td style={{ display: 'flex' }}>
                        <div className="img">
                          <img src="../images/song.jpg" />
                        </div>
                        <div className="text">
                          <h5>{item.title}</h5>
                          <p>{item.artist}</p>
                        </div>
                      </td>
                      <td>Movie Name</td>
                      <td>3 Weeks Ago</td>
                      <td>05:30</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default index;
