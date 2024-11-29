// frontend/src/components/Navigation/Navigation.jsx

import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton'; 
import './Navigation.css';

const logo = '/bird.png';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session?.user);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const sessionLinks = sessionUser ? (
    <ProfileButton user={sessionUser} />
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