'use client';
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';
// import { songs } from '../song/songs';
import { AppContext } from '@/contexts/AppContext';
// import { auth } from '../../firebase/firebase';

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

  // const [songs, setSongs] = useState([]);
  // const [currentSongIndex, setCurrentSongIndex] = useState(0);
  var currentSong =
    state.songs.length > 0 ? state.songs[currentSongIndex] : null;

  console.log(currentSong, '?:>::::::::::');

  // const currentSong = useMemo(() => {
  //   state.songs.length > 0 ? state.songs[currentSongIndex] : null;
  // }, currentSong);

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

  // const currentSong = useState(songs[0]);

  const audioRef = useRef();

  const rangeRef = useRef();

  const volumeRangeRef = useRef();

  const [targetRefEle, setTargetRefEle] = useState(null);

  // const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currrentProgress, setCurrrentProgress] = useState(0);

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
      console.log(targetRefEle);
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

      // setProgresSong(r);
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
  }, []);

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
