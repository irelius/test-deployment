// frontend/src/components/Navigation/ProfileButton.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(sessionActions.logout());
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="profile-dropdown">
      <button onClick={toggleDropdown} className="profile-button">
        <FaUserCircle className="profile-icon" />
        {user.username}
      </button>
      {showDropdown && (
        <div className="dropdown-menu">
          <button onClick={handleLogout}>Log Out</button>
        </div>
      )}
    </div>
  );
}

export default ProfileButton;