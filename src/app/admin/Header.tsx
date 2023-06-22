import { AppContext } from '@/contexts/AppContext';
import React, { useState, useRef, useContext, useEffect } from 'react';
// import Dropdown from './Dropdown';
import Dropdown from '@/components/Header/Dropdown';
import { useRouter } from 'next/navigation';
const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef: React.RefObject<HTMLDivElement> = useRef(null);
  const { dispatch } = useContext(AppContext);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.setItem('username', '');
    dispatch({ type: 'IS_LOGGED_IN', payload: false });

    router.push('/login');
  };

  const handleClickOutside = (event: { target: any }) => {
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
    <div className="admin-header">
      <div className="left">
        <h3>Spotify</h3>
      </div>
      <div className="right">
        <div className="search-field">
          <input type="text" className="form-control" placeholder="search..." />
        </div>
        <div
          className="user-profile"
          onClick={() => {
            setOpenDropdown(!openDropdown);
          }}
        >
          <div className="img">
            <img src="../images/user.png" />
            <span className="material-symbols-outlined">expand_more</span>
          </div>
          {openDropdown && (
            <Dropdown dropdownRef={dropdownRef} handleLogout={handleLogout} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
