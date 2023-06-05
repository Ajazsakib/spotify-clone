import React, { useContext } from 'react';
import Header from '../Header/Header';
import Player from '../player/Player';
import Sidebar from '../sidebar/Sidebar';
import { AppContext } from '@/contexts/AppContext';
export default function Wrapper({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useContext(AppContext);
  return (
    <div className="main-section">
      <div className="left-section">
        <Sidebar />
      </div>

      <div className="right-section">
        <Header />
        {children}
      </div>
      <div className="footer">{state.isLoggedIn && <Player />}</div>
    </div>
  );
}
