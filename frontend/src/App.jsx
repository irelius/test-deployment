import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage/SignupFormPage';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import SplashPage from './components/SplashPage/SplashPage';
import Leaderboards from './components/Leaderboards/Leaderboards';
import BountyDetails from './components/BountyDetails/BountyDetails';
import CreateBounty from './components/CreateBounty/CreateBounty';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
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
        element: <SplashPage />
      },
      {
        path: '/leaderboards',
        element: <Leaderboards />
      },
      {
        path: '/bounty/:bountyId',
        element: <BountyDetails />
      },
      {
        path: '/bounty/new',
        element: <CreateBounty />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;