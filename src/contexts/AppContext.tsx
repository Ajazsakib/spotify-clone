'use client';
import { createContext, useReducer } from 'react';

interface Songs {
  id: string;
  artist: string;
  category_id: string;
  created_by: string;
  src: string;
  title: string;
}

interface Category {
  id: string;
  name: string;
}

interface InitialState {
  songs: Songs[];
  category: Category[];
  currentSongIndex: number;
  isPlaying: boolean;
  isLoggedIn: boolean;
  loginPopup: boolean;
  showLoader: boolean;
}

const initialState = {
  songs: [],
  // artist: [],
  category: [],
  currentSongIndex: 0,
  isPlaying: false,
  isLoggedIn: false,
  currentUserLoggedIn: {},
  loginPopup: false,
  showLoader: false,
};

export const AppContext = createContext<{
  state: InitialState;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (
  state: InitialState,
  action: { type: string; payload: any }
) => {
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
    case 'LOGIN_POPUP':
      return {
        ...state,
        loginPopup: action.payload,
      };
    case 'SHOW_LOADER':
      return {
        ...state,
        showLoader: action.payload,
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
