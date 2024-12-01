// frontend/src/components/Navigation/Navigation.jsx

import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton'; 
// import OpenModalMenuItem from '../OpenModalMenuItem/OpenModalMenuItem'; 
// import LoginFormModal from '../LoginFormModal/LoginFormModal';
// import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './Navigation.css';

const logo = '/bird.png';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session?.user);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleCreateSpotClick = () => {
    navigate('/spots/new');
  };

  const sessionLinks = sessionUser ? (
    <>
      <button onClick={handleCreateSpotClick} className="create-spot-button">Create a New Spot</button>
      <ProfileButton user={sessionUser} />
    </>
  ) : (
    <ProfileButton user={null} />
  );

  return (
    <nav className="navigation">
      <div className="navigation-left">
        <NavLink to="/" onClick={handleLogoClick}>
          <img src={logo} alt="Logo" className="nav-logo" />
        </NavLink>
      </div>
      <div className="navigation-right">
        {isLoaded && sessionLinks}
      </div>
    </nav>
  );
}

export default Navigation;