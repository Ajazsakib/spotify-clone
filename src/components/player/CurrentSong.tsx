import React from 'react';
import { useRouter } from 'next/navigation';

interface IProps {
  currentSong: {
    artist: string;
    category_id: string;
    created_by: string;
    id: string;
    src: string;
    title: string;
  };
}

const CurrentSong = ({ currentSong }: IProps) => {
  const router = useRouter();

  return (
    <div className="left">
      <div className="img">
        <img src={`../images/song.jpg`} />
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

export default React.memo(CurrentSong);
