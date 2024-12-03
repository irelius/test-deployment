import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton'; 
import styles from './Navigation.module.css';

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
      <button onClick={handleCreateSpotClick} className={styles.createSpotButton}>Create a New Spot</button>
      <ProfileButton user={sessionUser} />
    </>
  ) : (
    <ProfileButton user={null} />
  );

  return (
    <nav className={styles.navigation}>
      <div className={styles.navigationLeft}>
        <NavLink to="/" onClick={handleLogoClick}>
          <img src={logo} alt="Logo" className={styles.navLogo} />
        </NavLink>
      </div>
      <div className={styles.navigationRight}>
        {isLoaded && sessionLinks}
      </div>
    </nav>
  );
}

export default Navigation;