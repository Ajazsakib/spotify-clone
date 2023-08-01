'use client';
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';

import { AppContext } from '@/contexts/AppContext';

import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import db from '../../firebase/firebase';
import { useRouter } from 'next/navigation';
import CurrentSong from './CurrentSong';
import SongRangeSlider from './SongRangeSlider';
import VolumeRangeSlider from './VolumeRangeSlider';
const Player = () => {
  const router = useRouter();

  const { state, dispatch } = useContext(AppContext);
  const { songs, currentSongIndex, isPlaying } = state;

  // get songs data from firebase

  const songsCollectionRef = collection(db, 'songs');

  var currentPlayingCategory =
    state.songs.length > 0
      ? state.songs.filter((song) => {
          return song.category_id === state.category[0].id;
        })
      : null;

  var currentSong =
    currentPlayingCategory && currentPlayingCategory.length > 0
      ? currentPlayingCategory[currentSongIndex]
      : null;

  const getSongsList = async () => {
    try {
      const data = await getDocs(songsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      dispatch({ type: 'SET_SONGS', payload: filteredData });
      dispatch({ type: 'PLAY_SONG', payload: 0 });
    } catch (err) {}
  };

  useEffect(() => {
    getSongsList();
  }, []);

  const audioRef = useRef();

  const rangeRef = useRef();

  const volumeRangeRef = useRef();

  const [targetRefEle, setTargetRefEle] = useState(null);

  const [duration, setDuration] = useState(0);
  const [currrentProgress, setCurrrentProgress] = useState(0);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVolumeOn, setIsVolumeOn] = useState(true);

  const [isVolumeDown, setIsVolumeDown] = useState(false);

  // function for play and pause
  const togglePlayPause = () => {
    if (isPlaying) {
      dispatch({ type: 'IS_PLAYING', payload: !isPlaying });
    } else {
      dispatch({ type: 'IS_PLAYING', payload: !isPlaying });
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      audioRef?.current?.pause();
    } else {
      audioRef?.current?.play();
    }
  }, [isPlaying, songs]);

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
  const handleMouseDown = useCallback(
    (e) => {
      var targetRef;
      var progressWidth;
      const progressBar = e.target;
      const progressPosition = e.pageX - progressBar.offsetLeft;
      if (
        progressBar.classList.contains('songParent') ||
        progressBar.classList.contains('songChild')
      ) {
        targetRef = rangeRef;
      } else {
        targetRef = volumeRangeRef;
      }
      setTargetRefEle(targetRef);
      if (
        progressBar.classList.contains('songParent') ||
        progressBar.classList.contains('volumeParent')
      ) {
        progressWidth = progressBar.offsetWidth;
      } else {
        progressWidth = progressBar.parentElement.offsetWidth;
      }
      const progressPercent = (progressPosition / progressWidth) * 100;
      if (targetRef == rangeRef) {
        audioRef.current.currentTime = (duration * progressPercent) / 100;
      } else {
        audioRef.current.volume = progressPercent / 100;
        targetRef.current.style.width = `${progressPercent}%`;
      }
      setIsMouseDown(true);
    },
    [isMouseDown]
  );

  // handle mouse up
  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  // handle progress bar on mouse move

  const handleMouseMove = (e) => {
    if (isMouseDown) {
      const p = e.pageX - targetRefEle.current.parentElement.offsetLeft;

      const q = targetRefEle.current.parentElement.offsetWidth;

      const r = (p / q) * 100;

      if (targetRefEle == rangeRef) {
        audioRef.current.currentTime = (p / q) * audioRef.current.duration;
        targetRefEle.current.style.width = `${r}%
    `;
      } else {
        targetRefEle.current.style.width = `${r}%`;
        audioRef.current.volume = r / 100;
      }
    }
  };

  // toggle volume
  const toggleVolume = useCallback(() => {
    setIsVolumeOn(!isVolumeOn);
    audioRef.current.muted = !audioRef.current.muted;

    if (audioRef.current.muted) {
      volumeRangeRef.current.style.width = '0';
    } else {
      volumeRangeRef.current.style.width = `50%`;
    }
  }, [isVolumeOn]);

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

  useEffect(() => {
    if (currentSong) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
      audioRef.current.volume = 0.1;
      volumeRangeRef.current.style.width = `10%`;
    }
  }, []);

  // last song

  const backwardLastSong = () => {
    if (currentSongIndex == 0) {
      dispatch({ type: 'PLAY_SONG', payload: songs.length - 1 });
    } else {
      dispatch({ type: 'PLAY_SONG', payload: currentSongIndex - 1 });
    }
  };

  console.log('rendered');

  return (
    currentSong && (
      <div className="player">
        <CurrentSong currentSong={currentSong} />
        <SongRangeSlider
          backwardLastSong={backwardLastSong}
          togglePlayPause={togglePlayPause}
          isPlaying={isPlaying}
          forwardNextSong={forwardNextSong}
          currentSong={currentSong}
          audioRef={audioRef}
          setDuration={setDuration}
          setCurrrentProgress={setCurrrentProgress}
          progressBarWidth={progressBarWidth}
          elapsedDisplay={elapsedDisplay}
          handleMouseDown={handleMouseDown}
          rangeRef={rangeRef}
          durationDisplay={durationDisplay}
        />
        <VolumeRangeSlider
          toggleVolume={toggleVolume}
          isVolumeOn={isVolumeOn}
          volumeRangeRef={volumeRangeRef}
          handleMouseDown={handleMouseDown}
        />
      </div>
    )
  );
};

export default Player;
