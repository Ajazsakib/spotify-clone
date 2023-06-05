import React from 'react';
import LibraryBox from './LibraryBox';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <div className="top-content active">
          <div className="icon">
            <span className="material-symbols-outlined">home</span>
          </div>
          <div className="menu">Home</div>
        </div>
        <div className="top-content">
          <div className="icon">
            <span className="material-symbols-outlined">search</span>
          </div>
          <div className="menu">Search</div>
        </div>
      </div>
      <div className="bottom">
        <div className="header">
          <div className="left">
            <div className="icon">
              <span className="material-symbols-outlined">expand_content</span>
            </div>
            <div className="menu">Your Library</div>
          </div>
          <div className="right">
            <div className="icon">
              <span className="material-symbols-outlined">add</span>
            </div>
            <div className="icon">
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>
        </div>
        <div className="library-box p-24 bg-light">
          <LibraryBox
            title="Create your first playlist"
            description="it's easy we'll help you"
            action="Create playlist"
          />
        </div>
        <div className="library-box p-24 bg-light">
          <LibraryBox
            title="Let's find the some podcast to follow"
            description="we'll keep you updated on new episodes"
            action="Browse Podcasts"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
