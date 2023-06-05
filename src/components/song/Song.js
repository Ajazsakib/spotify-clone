'use client';
import React from 'react';
import { songs } from './songs';

const Song = ({ name }) => {
  return (
    <div className="songsbox">
      <div className="img">
        <img src="images/song.jpg" />
      </div>
      <h4>{name}</h4>
      <p>Get Jiggy with 90s 'dhinchak' beats. Cover Se</p>
      <div className="player-icon">
        <span className="material-symbols-outlined">play_circle</span>
      </div>
    </div>
  );
};

export default Song;
