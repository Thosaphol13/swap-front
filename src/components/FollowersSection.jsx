import React from 'react';
import '../css/FollowersSection.css';

const FollowersSection = ({ followers, handleProfileClick }) => {
  return (
    <div className="followers-section">
      <h2>ผู้ติดตาม</h2>
      <ul className="followers-list">
        {followers.map((follower) => (
          <li key={follower.id} className="follower-item" onClick={() => handleProfileClick(follower.id)}>
            <img
              src={follower.profilePicture || 'https://via.placeholder.com/50'}
              alt={`${follower.firstName} ${follower.lastName}`}
              className="follower-profile-picture"
            />
            <span className="follower-name">{follower.firstName} {follower.lastName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowersSection;
