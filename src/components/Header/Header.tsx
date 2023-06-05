'use client';
import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '@/contexts/AppContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebase';
import Dropdown from './Dropdown';
const Header = () => {
  const { state } = useContext(AppContext);

  const [openDropdown, setOpenDropdown] = useState(false);

  const { dispatch } = useContext(AppContext);

  const router = useRouter();

  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    auth.signOut().then(() => {
      console.log('Logout Successfull');
      // router.push('/login');
      dispatch({ type: 'IS_LOGGED_IN', payload: false });
    });
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdown(false);
    }
    console.log(dropdownRef);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

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
                onClick={() => {
                  setOpenDropdown(!openDropdown);
                }}
              >
                person
              </span>
              {openDropdown && (
                <Dropdown
                  handleLogout={handleLogout}
                  dropdownRef={dropdownRef}
                />
              )}
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
