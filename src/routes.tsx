import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';

import Login from './pages/Login';

import App from '@/App';
import useLoggedInUserRole from '@/hooks/useLoggedInUserRole';
import { roleRoutes } from '@/roleRoutes';

const LoginRoute = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Navigate to='/' replace />,
    children: [
      {
        path: '/',
        element: <Login />,
      },
    ],
  },
]);

const Router = () => {
  const { highestRole } = useLoggedInUserRole();

  const getRouter = () => {
    // Determine the routes based on the user's role
    const routes = highestRole
      ? roleRoutes[highestRole as keyof typeof roleRoutes] || roleRoutes.end_user_role
      : roleRoutes.unauthenticated;

    // Create the router with the selected routes
    return createBrowserRouter([
      {
        path: '/',
        element: <App />,
        errorElement: <Navigate to='/' replace />,
        children: routes,
      },
    ]);
  };

  return (
    <>
      <AuthenticatedTemplate>
        <RouterProvider router={getRouter()} />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <RouterProvider router={LoginRoute} />
      </UnauthenticatedTemplate>
    </>
  );
};

export default Router;
