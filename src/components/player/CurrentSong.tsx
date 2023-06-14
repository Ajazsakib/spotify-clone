import React from 'react';
import { useRouter } from 'next/navigation';

const CurrentSong = ({ currentSong }) => {
  const router = useRouter();
  return (
    <div className="left">
      <div className="img">
        <img
          src={
            router.pathname == '/' ? `images/song.jpg` : `../images/song.jpg`
          }
        />
      </div>
      <div className="text">
        <p className="song-title">{currentSong.title} </p>
        <p className="song-artist">{currentSong.artist}</p>
      </div>
      <div className="icons">
        <span className="material-symbols-outlined">favorite</span>
        <span className="material-symbols-outlined">panorama</span>
      </div>
    </div>
  );
};

export default CurrentSong;
