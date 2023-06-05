import React from 'react';
import Link from 'next/link';
const Dropdown = ({ handleLogout, dropdownRef }) => {
  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <span>{localStorage.getItem('username')}</span>
      <ul>
        <li>
          <Link href="/" className="text">
            Account
          </Link>
          <span className="material-symbols-outlined">open_in_new</span>
        </li>
        <li>
          <Link href="/" className="text">
            profile
          </Link>
          <span className="material-symbols-outlined">open_in_new</span>
        </li>
        <li onClick={handleLogout}>
          <Link href="/" className="text">
            Log Out
          </Link>
          <span className="material-symbols-outlined"></span>
        </li>
      </ul>
    </div>
  );
};

export default Dropdown;
