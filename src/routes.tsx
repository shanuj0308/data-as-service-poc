import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';

import SummaryReportPage from './pages/SummartReportPage';

import App from '@/App';
import AddLegalHoldPage from '@/pages/Admin/Administration/LegalHold/AddLegalHold';
import ListLegalHold from '@/pages/Admin/Administration/LegalHold/List';
import AddRetention from '@/pages/Admin/Administration/Policy/RetentionPolicy/AddRetention';
import EditRetention from '@/pages/Admin/Administration/Policy/RetentionPolicy/EditRetention';
import ListRetentionPolicy from '@/pages/Admin/Administration/Policy/RetentionPolicy/List';
import AddSourceCon from '@/pages/Admin/Administration/SourceConnection/AddSource';
import EditSourceCon from '@/pages/Admin/Administration/SourceConnection/EditSource';
import ListSourceConnection from '@/pages/Admin/Administration/SourceConnection/List';
import AddTargetCon from '@/pages/Admin/Administration/TargetConnection/AddTarget';
import EditTargetCon from '@/pages/Admin/Administration/TargetConnection/EditTarget';
import ListTargetConnection from '@/pages/Admin/Administration/TargetConnection/List';
import ApplyLegalHold from '@/pages/ApplyLegalHold';
import ApplyLegalHoldForm from '@/pages/ApplyLegalHoldForm';
import Dashboard from '@/pages/Dashboard';
import AddJobForm from '@/pages/JobListing/AddJob';
import JobList from '@/pages/JobListing/JobList';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import Reporting from '@/pages/Reporting';
import ListUnstructuredData from '@/pages/Unstructured/List';
import ApplyRetentionPolicy from './pages/Retention/ApplyRetentionPolicy';
import ApplyRetentionPolicyForm from './pages/Retention/ApplyRetentionPolicyForm';

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

/**
 * End User Authorized Routes
 */
const AuthorizedRoutes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h2>Error Page</h2>,
    children: [
      {
        path: '/',
        element: <Navigate to='/dashboard' replace />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/execute-query',
        element: <Reporting />,
      },
      {
        path: '/unstructured/:archive_id',
        element: <ListUnstructuredData />,
      },
      {
        path: '/source-connection',
        element: <ListSourceConnection />,
      },
      {
        path: '/source-connection/add',
        element: <AddSourceCon />,
      },
      {
        path: '/source-connection/edit/:connection_name',
        element: <EditSourceCon />,
      },
      {
        path: '/target-connection',
        element: <ListTargetConnection />,
      },
      {
        path: '/target-connection/add',
        element: <AddTargetCon />,
      },
      {
        path: '/target-connection/edit/:connection_name/:bucket_name',
        element: <EditTargetCon />,
      },
      {
        path: '/retention-policy',
        element: <ListRetentionPolicy />,
      },
      {
        path: '/retention-policy/add',
        element: <AddRetention />,
      },
      {
        path: '/retention-policy/edit/:policy_name',
        element: <EditRetention />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/legal-hold',
        element: <ListLegalHold />,
      },
      {
        path: '/legal-hold/add',
        element: <AddLegalHoldPage />,
      },
      {
        path: '/apply-legal-hold',
        element: <ApplyLegalHold />,
      },
      {
        path: '/apply-legal-hold/form',
        element: <ApplyLegalHoldForm />,
      },
      {
        path: '/jobs/list',
        element: <JobList />,
      },
      {
        path: '/jobs/add',
        element: <AddJobForm />,
      },
      {
        path: '/summary-report',
        element: <SummaryReportPage />,
      },
      {
        path: '/apply-retention-policy',
        element: <ApplyRetentionPolicy />,
      },
      {
        path: '/apply-retention-policy/form',
        element: <ApplyRetentionPolicyForm />,
      },
    ],
  },
]);

const Router = () => {
  return (
    <>
      <AuthenticatedTemplate>
        <RouterProvider router={AuthorizedRoutes} />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <RouterProvider router={LoginRoute} />
      </UnauthenticatedTemplate>
    </>
  );
};

export default Router;
