// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import SignupFormPage from './components/SignupFormModal/SignupFormModal';
import Navigation from './components/Navigation/Navigation';
import Spots from './components/Spots/Spots'; 
import SpotDetails from './components/Spots/SpotDetails';
import * as sessionActions from './store/session';
import { ModalProvider } from './context/Modal'; 
import MyListings from './components/MyListings';
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Spots />,
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails />,
      },
      {
        path: '/signup',
        element: <SignupFormPage />,
      },
      {
        path: '/my-listings',
        element: <MyListings />,
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm />,
      },
    ],
  },
]);

function App() {
  return (
    <ModalProvider>
      <RouterProvider router={router} />
    </ModalProvider>
  );
}

export default App;