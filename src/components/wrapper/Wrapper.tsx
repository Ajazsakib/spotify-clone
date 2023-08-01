'use-client';
import React, { useContext, useState, useEffect, useRef } from 'react';
import Header from '../Header/Header';
import Player from '../player/Player';
import Sidebar from '../sidebar/Sidebar';
import { AppContext } from '@/contexts/AppContext';
import Link from 'next/link';
export default function Wrapper({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useContext(AppContext);

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const loginPopupRef: React.RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  const handleClickOutside = (event: { target: any }) => {
    if (
      loginPopupRef.current &&
      !loginPopupRef.current.contains(event.target)
    ) {
      dispatch({
        type: 'LOGIN_POPUP',
        payload: false,
      });
    }
  };

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
      {state.loginPopup && (
        <div className="login-popup">
          <div className="login-popup-box" ref={loginPopupRef}>
            <h1>Please Login</h1>
            <br />
            <div style={{ display: 'flex' }}>
              <Link href="/register" className="btn btn-secondary">
                Sign Up
              </Link>

              <Link href="/login" className="btn btn-primary">
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
