import React from 'react';
import '../css/Sidebar.css';
import { FaBookmark, FaCog, FaSearch } from 'react-icons/fa';

const Sidebar = ({ user, isAdmin, handleProfileClick, handleAdminClick }) => {
  return (
    <div className="sidebar">
      <div className="profile-container1">
        <button className="profile-btn" onClick={() => handleProfileClick(user.id)}>
          <img 
            src={user.profilePicture || '/default-profile.png'} 
            alt="Profile" 
            className="profile-image1" 
          />
        </button>
        <div className="user-info" onClick={() => handleProfileClick(user.id)}>
          <div className="user-name">{user.firstName} {user.lastName}</div>
          <div className="user-role">{user.role}</div>
        </div>
      </div>
      {/* If the user is an admin, display a link to admin management page */}
      {isAdmin && (
        <div className="admin-link" onClick={handleAdminClick}>
          <FaCog className="admin-icon" />
          <span className="admin-link-text">Admin Management</span>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
