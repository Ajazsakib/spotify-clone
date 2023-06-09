import React from 'react';
import Link from 'next/link';
import { json } from 'stream/consumers';

interface IProps {
  handleLogout: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}
const Dropdown = ({ handleLogout, dropdownRef }: IProps) => {
  const username = localStorage.getItem('username') || 'dummy';
  const userObject = JSON.parse(username);
  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <span>{userObject.name}</span>
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
