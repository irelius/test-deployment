// frontend/src/components/Navigation/ProfileButton.jsx

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from '../OpenModalMenuItem/OpenModalMenuItem'; 
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  console.log('ProfileButton rendered');       //!CONSOLE LOG!

  const openMenu = () => {
    console.log('openMenu called');        //!CONSOLE LOG!
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    console.log('useEffect called');      //!CONSOLE LOG!
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  return (
    <>
      <button onClick={openMenu} className="profile-button">
        <FaUserCircle />
      </button>
      <ul className={`profile-dropdown ${showMenu ? "" : "hidden"}`} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.username}</li>
            <li>
              <NavLink to="/my-listings" onClick={closeMenu}>Manage Spots</NavLink>
            </li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;