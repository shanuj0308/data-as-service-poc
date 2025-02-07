import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from '@/App';
import Dashboard from '@/pages/dashboard';
import Login from '@/pages/login';
import Unstructured from '@/pages/unstructured';
import Reporting from "@/pages/reporting";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h2>Error Page Contnet</h2>,
    children: [
      {
        path: '/',
        element: <Login />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: "/structured-reporting/:id",
        element: <Reporting/>      
      },
      {
        path: '/unstructured',
        element: <Unstructured />,
      },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
