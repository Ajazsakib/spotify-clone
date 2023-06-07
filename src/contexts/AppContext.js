'use client';
import { createContext, useReducer } from 'react';

export const AppContext = createContext();

const initialState = {
  songs: [],
  artist: [],
  category: [],
  currentSongIndex: 0,
  isPlaying: false,
  isLoggedIn: false,
  currentUserLoggedIn: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SONGS':
      return {
        ...state,
        songs: action.payload,
      };
    case 'FETCH_CATEGORY':
      return {
        ...state,
        category: action.payload,
      };
    case 'PLAY_SONG':
      return {
        ...state,
        currentSongIndex: action.payload,
      };
    case 'IS_PLAYING':
      return {
        ...state,
        isPlaying: action.payload,
      };
    case 'IS_LOGGED_IN':
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    case 'CURRENT_USER':
      return {
        ...state,
        currentUserLoggedIn: action.payload,
      };

    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
