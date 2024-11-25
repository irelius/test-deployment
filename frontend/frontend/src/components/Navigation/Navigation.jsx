// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useRef, useEffect, useState } from 'react';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const searchContainerRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({});

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

  return (
    <nav className="navigation">
      <div className="navigation-left">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/bookings">Bookings</NavLink>
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
          <ProfileButton user={sessionUser} />
        )}
      </div>
    </nav>
  );
}

export default Navigation;