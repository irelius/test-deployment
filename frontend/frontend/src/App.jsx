// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import SignupFormPage from './components/SignupFormModal/SignupFormModal';
import Navigation from './components/Navigation/Navigation';
import Spots from './components/Spots/Spots'; 
import SpotDetails from './components/Spots/SpotDetails';
import EditSpotForm from './components/EditSpotForm/EditSpotForm';
import * as sessionActions from './store/session';
import { ModalProvider } from './context/Modal'; 
import MyListings from './components/MyListings';
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm';
// import ManageReviews from './components/ReviewList/ManageReviews';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet context={{ sessionUser }} />}
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
        path: '/spots/:spotId/edit',
        element: <EditSpotForm />,
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
      // {
      //   path: '/manage-reviews',
      //   element: <ManageReviews />,
      // },
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