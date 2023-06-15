import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '@/contexts/AppContext';
const SongRangeSlider = (props) => {
  const { state, dispatch } = useContext(AppContext);
  const { songs, currentSongIndex, isPlaying } = state;

  const {
    backwardLastSong,
    togglePlayPause,

    forwardNextSong,
    currentSong,
    audioRef,
    setDuration,
    setCurrrentProgress,
    progressBarWidth,
    elapsedDisplay,
    handleMouseDown,
    rangeRef,
    durationDisplay,
  } = props;

  return (
    <div className="middle">
      <div className="icons">
        <span className="material-symbols-outlined">shuffle</span>
        <span className="material-symbols-outlined" onClick={backwardLastSong}>
          skip_previous
        </span>
        <span className="material-symbols-outlined" onClick={togglePlayPause}>
          {isPlaying ? 'pause' : 'play_arrow'}
        </span>
        <span className="material-symbols-outlined" onClick={forwardNextSong}>
          skip_next
        </span>
        <span className="material-symbols-outlined">repeat</span>
      </div>
      <div className="audio">
        <audio
          key={currentSong.id}
          ref={audioRef}
          onDurationChange={(e) => {
            setDuration(e.currentTarget.duration);
          }}
          onTimeUpdate={(e) => {
            setCurrrentProgress(e.currentTarget.currentTime);
            progressBarWidth();
          }}
        >
          <source src={currentSong.src} type="audio/mpeg" />
        </audio>
      </div>
      <div className="song-range">
        <div className="current-time-song">{elapsedDisplay}</div>
        <div className="range-bar songParent" onMouseDown={handleMouseDown}>
          <div className="range songChild" ref={rangeRef}></div>
        </div>
        <div className="left-song">{durationDisplay}</div>
      </div>
    </div>
  );
};

export default SongRangeSlider;
