import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from '../OpenModalMenuItem/OpenModalMenuItem'; 
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import pb from './ProfileButton.module.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
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
    navigate('/');
  };

  const divClassName = showMenu ? pb.profileDropdown : pb.hidden;

  return (
    <div className={pb.profileButtonContainer}>
      <button onClick={toggleMenu} className={pb.profileButton}>
        <FaUserCircle />
      </button>
      <ul className={divClassName} ref={ulRef} >
        {user ? (
          <>
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li>
              <NavLink to="/my-listings" onClick={closeMenu}>Manage Spots</NavLink>
            </li>
            <li>
              <NavLink to="/manage-reviews" onClick={closeMenu}>Manage Reviews</NavLink>
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
              onItemClick={closeMenu}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              modalComponent={<SignupFormModal />}
              onItemClick={closeMenu}
            />
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;