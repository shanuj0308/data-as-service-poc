import { Navigate, RouteObject } from 'react-router-dom';

import ApplyRetentionPolicy from './pages/Retention/ApplyRetentionPolicy';
import ApplyRetentionPolicyForm from './pages/Retention/ApplyRetentionPolicyForm';

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
import SummaryReportPage from '@/pages/SummartReportPage';
import ListUnstructuredData from '@/pages/Unstructured/List';
// Base route definitions (shared across roles where applicable)
const routeDefinitions: Record<string, RouteObject> = {
  login: {
    path: '/',
    element: <Login />,
  },
  dashboard: {
    path: '/dashboard',
    element: <Dashboard />,
  },
  unstructured: {
    path: '/unstructured/:archive_id',
    element: <ListUnstructuredData />,
  },
  profile: {
    path: '/profile',
    element: <Profile />,
  },
  listSourceConnection: {
    path: '/source-connection',
    element: <ListSourceConnection />,
  },
  addSourceConnection: {
    path: '/source-connection/add',
    element: <AddSourceCon />,
  },
  editSourceConnection: {
    path: '/source-connection/edit/:connection_name',
    element: <EditSourceCon />,
  },
  listTargetConnection: {
    path: '/target-connection',
    element: <ListTargetConnection />,
  },
  addTargetConnection: {
    path: '/target-connection/add',
    element: <AddTargetCon />,
  },
  editTargetConnection: {
    path: '/target-connection/edit/:connection_name/:bucket_name',
    element: <EditTargetCon />,
  },
  listRetentionPolicy: {
    path: '/retention-policy',
    element: <ListRetentionPolicy />,
  },
  addRetentionPolicy: {
    path: '/retention-policy/add',
    element: <AddRetention />,
  },
  editRetentionPolicy: {
    path: '/retention-policy/edit/:policy_name',
    element: <EditRetention />,
  },
  listLegalHold: {
    path: '/legal-hold',
    element: <ListLegalHold />,
  },
  addLegalHoldPage: {
    path: '/legal-hold/add',
    element: <AddLegalHoldPage />,
  },
  applyLegalHold: {
    path: '/apply-legal-hold',
    element: <ApplyLegalHold />,
  },
  applyLegalHoldForm: {
    path: '/apply-legal-hold/form',
    element: <ApplyLegalHoldForm />,
  },
  jobList: {
    path: '/jobs/list',
    element: <JobList />,
  },
  addJobForm: {
    path: '/jobs/add',
    element: <AddJobForm />,
  },
  summaryReportPage: {
    path: '/summary-report',
    element: <SummaryReportPage />,
  },
  executeQuery: {
    path: '/execute-query',
    element: <Reporting />,
  },
  applyRetentionPolicy: {
    path: '/apply-retention-policy',
    element: <ApplyRetentionPolicy />,
  },
  applyRetentionPolicyForm: {
    path: '/apply-retention-policy/form',
    element: <ApplyRetentionPolicyForm />,
  },
};
// Role-based route configurations
export const roleRoutes: Record<string, RouteObject[]> = {
  KVUEVAULT_DEV_ADMIN: [
    { path: '/', element: <Navigate to='/dashboard' replace /> }, // Default redirect
    routeDefinitions.dashboard,
    routeDefinitions.unstructured,
    routeDefinitions.listSourceConnection,
    routeDefinitions.addSourceConnection,
    routeDefinitions.editSourceConnection,
    routeDefinitions.listTargetConnection,
    routeDefinitions.addTargetConnection,
    routeDefinitions.editTargetConnection,
    routeDefinitions.listRetentionPolicy,
    routeDefinitions.addRetentionPolicy,
    routeDefinitions.editRetentionPolicy,
    routeDefinitions.listLegalHold,
    routeDefinitions.addLegalHoldPage,
    routeDefinitions.applyLegalHold,
    routeDefinitions.applyLegalHoldForm,
    routeDefinitions.jobList,
    routeDefinitions.addJobForm,
    routeDefinitions.summaryReportPage,
    routeDefinitions.profile,
    routeDefinitions.executeQuery,
  ],
  KVUEVAULT_DEV_DEVELOPER: [
    { path: '/', element: <Navigate to='/dashboard' replace /> }, // Default redirect
    routeDefinitions.dashboard,
    routeDefinitions.unstructured,
    routeDefinitions.listSourceConnection,
    routeDefinitions.listTargetConnection,
    routeDefinitions.listRetentionPolicy,
    routeDefinitions.listLegalHold,
    routeDefinitions.addLegalHoldPage,
    routeDefinitions.applyLegalHold,
    routeDefinitions.applyLegalHoldForm,
    routeDefinitions.jobList,
    routeDefinitions.addJobForm,
    routeDefinitions.summaryReportPage,
    routeDefinitions.profile,
    routeDefinitions.executeQuery,
    routeDefinitions.applyRetentionPolicy,
    routeDefinitions.applyRetentionPolicyForm,
  ],
  end_user_role: [
    { path: '/', element: <Navigate to='/dashboard' replace /> }, // Default redirect
    routeDefinitions.dashboard,
    routeDefinitions.unstructured,
    routeDefinitions.profile,
    routeDefinitions.executeQuery,
  ],
  unauthenticated: [routeDefinitions.login],
};
