// frontend/src/components/Layout.jsx

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { restoreUser } from '../store/session';
import Footer from './Footer';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ paddingBottom: '100px' }}> 
      {children}
      <Footer /> 
    </div>
  );
};

export default Layout;