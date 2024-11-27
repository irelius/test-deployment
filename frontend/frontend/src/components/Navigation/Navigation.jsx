// frontend/src/components/Navigation/Navigation.jsx

import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useRef, useEffect, useState } from 'react';
import { logout } from '../../store/session';
import './Navigation.css';

const logo = '/bird.png';

function Navigation({ isLoaded }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session?.user);
  const searchContainerRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (searchContainerRef.current) {
        const rect = searchContainerRef.current.getBoundingClientRect();
        const dropdownWidth = 200; 
        const viewportWidth = window.innerWidth;

        if (rect.left + dropdownWidth > viewportWidth) {
          setDropdownPosition({ right: 0, left: 'auto' });
        } else {
          setDropdownPosition({ left: 0, right: 'auto' });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navigation">
      <div className="navigation-left">
        <NavLink to="/" onClick={handleLogoClick}>
          <img src={logo} alt="Logo" className="nav-logo" />
        </NavLink>
      </div>
      <div className="navigation-right">
        <div className="search-container" ref={searchContainerRef}>
          <button className="search-button">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <div className="search-dropdown" style={dropdownPosition}>
            <input type="text" placeholder="Search for a location" />
          </div>
        </div>
        {isLoaded && (
          <div className="profile-dropdown">
            <ProfileButton user={sessionUser} />
            <div className="profile-dropdown-content">
              {sessionUser ? (
                <>
                  <span>Hello, {sessionUser.username}</span>
                  <NavLink to="/my-listings">Manage Spots</NavLink>
                  <button onClick={handleLogout}>Log Out</button>
                </>
              ) : (
                <>
                  <OpenModalButton
                    modalComponent={<LoginFormModal />}
                    buttonText="Log In"
                  />
                  <OpenModalButton
                    modalComponent={<SignupFormModal />}
                    buttonText="Sign Up"
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;