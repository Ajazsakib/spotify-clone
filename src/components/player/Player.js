'use client';
import React, { useState, useRef, useEffect, useContext } from 'react';
// import { songs } from '../song/songs';
import { AppContext } from '@/contexts/AppContext';
// import { auth } from '../../firebase/firebase';

import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import db from '../../firebase/firebase';

const Player = () => {
  const { state, dispatch } = useContext(AppContext);
  const { songs, currentSongIndex, isPlaying } = state;

  // get songs data from firebase

  const songsCollectionRef = collection(db, 'songs');

  // const [songs, setSongs] = useState([]);
  // const [currentSongIndex, setCurrentSongIndex] = useState(0);
  var currentSong =
    state.songs.length > 0 ? state.songs[currentSongIndex] : null;

  const getSongsList = async () => {
    try {
      const data = await getDocs(songsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      dispatch({ type: 'SET_SONGS', payload: filteredData });
      dispatch({ type: 'PLAY_SONG', payload: 0 });
    } catch (err) {
      console.log('Error', err);
    }
  };

  useEffect(() => {
    getSongsList();
  }, []);
  console.log(state);
  // const currentSong = useState(songs[0]);

  const audioRef = useRef();

  const rangeRef = useRef();

  const volumeRangeRef = useRef();

  // const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currrentProgress, setCurrrentProgress] = React.useState(0);

  // const [progressSong, setProgresSong] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVolumeOn, setIsVolumeOn] = useState(true);

  const [isVolumeDown, setIsVolumeDown] = useState(false);

  // function for play and pause
  const togglePlayPause = () => {
    if (isPlaying) {
      // audioRef.current.pause();
      dispatch({ type: 'IS_PLAYING', payload: !isPlaying });
    } else {
      // audioRef.current.play();
      dispatch({ type: 'IS_PLAYING', payload: !isPlaying });
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      audioRef?.current?.pause();
    } else {
      audioRef?.current?.play();
    }
  }, [isPlaying]);

  // function for show elapsed time and duration
  function formatDurationDisplay(duration) {
    const min = Math.floor(duration / 60);
    const sec = Math.floor(duration - min * 60);

    const formatted = [min, sec].map((n) => (n < 10 ? '0' + n : n)).join(':');

    return formatted;
  }

  // function to change the   song range on mousemove

  useEffect(() => {
    setDuration(audioRef?.current?.duration);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMouseDown]);

  // function to change the   volume range on mousemove

  useEffect(() => {
    window.addEventListener('mousemove', handleVolumeMouseMove);
    window.addEventListener('mouseup', handleVolumeMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleVolumeMouseMove);
      window.removeEventListener('mouseup', handleVolumeMouseUp);
    };
  }, [isVolumeDown]);

  useEffect(() => {
    if (currentSong) {
      audioRef.current.volume = 0.1;
      volumeRangeRef.current.style.width = `10%`;
    }
  }, [currentSong]);

  // elapsed time
  var elapsedDisplay = formatDurationDisplay(currrentProgress);

  // total duration
  const durationDisplay = formatDurationDisplay(duration);

  // control songs progress bar width on mouse click
  const progressBarWidth = () => {
    var progressPercent =
      (audioRef.current.currentTime / audioRef.current.duration) * 100;
    // setProgresSong(progressPercent);
    rangeRef.current.style.width = `${progressPercent}%
    `;
  };

  // control songs progress bar width on mouse down
  const handleMouseDown = (e) => {
    const progressSongBar = e.target;

    const progressSongPosition = e.pageX - progressSongBar.offsetLeft;

    var progressSongWidth;

    if (progressSongBar.classList.contains('range-bar')) {
      progressSongWidth = progressSongBar.offsetWidth;
    } else {
      progressSongWidth = progressSongBar.parentElement.offsetWidth;
    }

    const progressPercent = (progressSongPosition / progressSongWidth) * 100;

    // setProgresSong(progressPercent);

    audioRef.current.currentTime = (duration * progressPercent) / 100;

    setIsMouseDown(true);
  };

  // handle mouse up
  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  // handle progress bar on mouse move

  const handleMouseMove = (e) => {
    if (isMouseDown) {
      const p = e.pageX - rangeRef.current.parentElement.offsetLeft;

      const q = rangeRef.current.parentElement.offsetWidth;

      const r = (p / q) * 100;

      audioRef.current.currentTime = (p / q) * audioRef.current.duration;

      // setProgresSong(r);

      rangeRef.current.style.width = `${r}%
    `;
    }
  };

  // toggle volume

  const toggleVolume = () => {
    setIsVolumeOn(!isVolumeOn);
    audioRef.current.muted = !audioRef.current.muted;

    if (audioRef.current.muted) {
      volumeRangeRef.current.style.width = '0';
    } else {
      volumeRangeRef.current.style.width = `50%`;
    }
  };
  // control volume on mousedown
  const handleVolumeMouseDown = (e) => {
    const volumeBarPos = e.pageX - e.target.offsetLeft;

    var volumeBarWidth;
    if (e.target.classList.contains('sound-progress-bar')) {
      volumeBarWidth = e.target.offsetWidth;
    } else {
      volumeBarWidth = e.target.parentElement.offsetWidth;
    }

    var volumePercent = (volumeBarPos / volumeBarWidth) * 100;

    if (volumePercent > 100) {
      volumePercent = 100;
    }

    audioRef.current.volume = volumePercent / 100;

    volumeRangeRef.current.style.width = `${volumePercent}%`;

    setIsVolumeDown(true);
  };

  const handleVolumeMouseUp = () => {
    setIsVolumeDown(false);
  };
  // control volume on mousemove
  const handleVolumeMouseMove = (e) => {
    if (isVolumeDown) {
      const p = e.pageX - volumeRangeRef.current.parentElement.offsetLeft;
      const q = volumeRangeRef.current.parentElement.offsetWidth;

      const r = (p / q) * 100;

      volumeRangeRef.current.style.width = `${r}%`;

      audioRef.current.volume = r / 100;
    }
  };

  // Next Song

  const forwardNextSong = () => {
    if (currentSongIndex == songs.length - 1) {
      dispatch({ type: 'PLAY_SONG', payload: 0 });
    } else {
      dispatch({ type: 'PLAY_SONG', payload: currentSongIndex + 1 });
    }
  };

  useEffect(() => {
    if (currentSong) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      audioRef.current.volume = 0.1;
      volumeRangeRef.current.style.width = `10%`;
    }
  }, [currentSongIndex]);

  // last song

  const backwardLastSong = () => {
    if (currentSongIndex == 0) {
      dispatch({ type: 'PLAY_SONG', payload: songs.length - 1 });
    } else {
      dispatch({ type: 'PLAY_SONG', payload: currentSongIndex - 1 });
    }
  };

  return (
    currentSong && (
      <div className="player">
        <div className="left">
          <div className="img">
            <img src="images/song.jpg" />
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
        <div className="middle">
          <div className="icons">
            <span className="material-symbols-outlined">shuffle</span>
            <span
              className="material-symbols-outlined"
              onClick={backwardLastSong}
            >
              skip_previous
            </span>
            <span
              className="material-symbols-outlined"
              onClick={togglePlayPause}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
            <span
              className="material-symbols-outlined"
              onClick={forwardNextSong}
            >
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
            <div className="range-bar" onMouseDown={handleMouseDown}>
              <div className="range" ref={rangeRef}></div>
            </div>
            <div className="left-song">{durationDisplay}</div>
          </div>
        </div>
        <div className="right">
          <div className="icons">
            <span className="material-symbols-outlined">segment</span>
            <span className="material-symbols-outlined">
              keyboard_previous_language
            </span>
          </div>
          <div className="sound-bar">
            <div className="icon" onClick={toggleVolume}>
              <span className="material-symbols-outlined">
                {isVolumeOn ? 'volume_up' : 'volume_off'}
              </span>
            </div>
            <div
              className="sound-progress-bar"
              onMouseDown={handleVolumeMouseDown}
            >
              <div className="range-bar" ref={volumeRangeRef}></div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Player;
