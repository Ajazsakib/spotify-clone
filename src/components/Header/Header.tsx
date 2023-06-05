'use client';
import React, { useState, useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebase';
const Header = () => {
  const { state } = useContext(AppContext);

  // const signOut = async () => {

  // };
  const { dispatch } = useContext(AppContext);

  const router = useRouter();

  const handleLogout = async () => {
    auth.signOut().then(() => {
      console.log('Logout Successfull');
      router.push('/login');
      dispatch({ type: 'IS_LOGGED_IN', payload: false });
    });
  };

  return (
    <div className="header">
      <div className="left">
        <a>
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </a>
        <a>
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </a>
      </div>
      <div className="right">
        {state.isLoggedIn ? (
          <>
            <button className="btn btn-primary">Upgrade</button>
            <button className="btn btn-secondary">
              <span className="material-symbols-outlined">
                arrow_circle_right
              </span>
              Install App
            </button>
            <div className="user">
              <span
                className="material-symbols-outlined"
                onClick={handleLogout}
              >
                person
              </span>
              <span>{localStorage.getItem('username')}</span>
              <div className="user-dropdown">
                <ul>
                  <li>
                    <Link href="/" className="text">
                      Account
                    </Link>
                    <span className="material-symbols-outlined">
                      open_in_new
                    </span>
                  </li>
                  <li>
                    <Link href="/" className="text">
                      Account
                    </Link>
                    <span className="material-symbols-outlined">
                      open_in_new
                    </span>
                  </li>
                  <li>
                    <Link href="/" className="text">
                      Account
                    </Link>
                    <span className="material-symbols-outlined">
                      open_in_new
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link href="/register" className="btn btn-secondary">
              Sign Up
            </Link>
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
