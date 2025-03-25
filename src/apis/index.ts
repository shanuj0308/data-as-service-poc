import axios from 'axios';

import { BASE_URL } from '@/constant/secret';
import { convertToObject } from '@/lib/utils';
import {
  Application,
  CreateJobData,
  LegalHoldListItem,
  RetentionPolicyListItem,
  S3BucketObject,
  SourceConnectionsData,
  TargetConnectionsData,
} from '@/types/common';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

type SourceQueryKey = ['sourceConData', { connection_name: string }];
type TargetQueryKey = ['targetConData', { connection_name: string; bucket_name: string }];

export const getSourceConnections = async () => {
  return (await axiosInstance.get<SourceConnectionsData[]>(`archive/connection/list`)).data;
};

export const getSourceConnection = async ({ queryKey }: { queryKey: SourceQueryKey }) => {
  const [, params] = queryKey;
  const { connection_name } = params;
  return (await axiosInstance.post<SourceConnectionsData>(`archive/connection/view`, { connection_name })).data;
};

export const getTestSourceConnection = async (source_con_data: SourceConnectionsData) => {
  return (
    await axiosInstance.post<{ connected: boolean }>(`archive/connection/test_connection`, { ...source_con_data })
  ).data;
};

export const createSourceConnection = async (connectionData: SourceConnectionsData) => {
  return await axiosInstance.post('archive/connection/create', connectionData);
};

export const updateSourceConnection = async (connectionData: SourceConnectionsData) => {
  return await axiosInstance.post(`archive/connection/update`, { ...connectionData });
};

export const getTargetConnections = async () => {
  return (await axiosInstance.get<TargetConnectionsData[]>(`archive/connection/target_conn_list`)).data;
};

export const getTargetConnection = async ({ queryKey }: { queryKey: TargetQueryKey }) => {
  const [, params] = queryKey;
  const { connection_name, bucket_name } = params;
  return (await axiosInstance.post(`archive/connection/view_targ_conn`, { connection_name, bucket_name })).data;
};

export const createS3Connection = async (connectionData: TargetConnectionsData) => {
  return await axiosInstance.post('archive/connection/create_targ_conn', connectionData);
};

export const updateTargetConnection = async (connectionData: TargetConnectionsData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await axiosInstance.post(`archive/connection/update_targ_conn`, { ...connectionData });
};

export const getLegalHoldList = async () => {
  return (await axiosInstance.get<{ data: LegalHoldListItem[] }>('archive/legalhold/list')).data.data;
};

export const applyLegalHold = async (data: { archive_id: any; policy_name: any; created_by: any }) => {
  const payload = {
    archive_id: data.archive_id,
    policy_name: data.policy_name,
    created_by: data.created_by,
  };
  return await axiosInstance.put('archive/legalhold/apply', payload);
};

export const createLegalHold = async (data: { legalhold_name: string; description: string; user_id: string }) => {
  return await axios.post('https://o33dd0mr26.execute-api.us-east-1.amazonaws.com/archive/legalhold/create', data);
};
export const removeLegalHold = async (data: { archive_id: any; created_by: any }) => {
  const payload = {
    archive_id: data.archive_id,
    policy_name: 'False',
    created_by: data.created_by,
  };
  return await axiosInstance.put('archive/legalhold/apply', payload); // Use the same endpoint as apply
};

export const getLegalHold = async (legal_hold_name: string) => {
  return (await axiosInstance.get(`/api/legal-hold/${legal_hold_name}`)).data;
};

export const getApplicationsList = async () => {
  return (await axiosInstance.get<{ data: Application[] }>('archive/api/list')).data.data;
};

// Export a constant function called getJobList that returns a promise
export const getJobList = async () => {
  return (await axiosInstance.get<any[]>(`archive/api/get_jobs`)).data;
};
// Export a function called createJob that takes in a parameter jobData of type CreateJobData
export const fetchJobTables = async (jobData: CreateJobData) => {
  // Use axiosInstance to make a post request to the 'archive/jobs/create' endpoint with the jobData as the payload
  return await axiosInstance.post('archive/api/fetch_tables', jobData);
};
// Export a constant function called saveJob that takes a jobId as a parameter
export const saveJob = async (jobId: any) => {
  // Use axiosInstance to make a post request to the 'archive/jobs/create' endpoint with the jobData as the payload
  return await axiosInstance.post('archive/api/create_job', { id: jobId });
};

export const runJob = async (runJobData: any) => {
  return await axiosInstance.post('archive/api/run_job', runJobData);
};

/**
 * Get Target Lists Connection Apis
 */
export const getUnstructuredDataList = async (archiveId: string, s3Prefix: string) => {
  const s3PathReq = {
    archive_id: archiveId,
    s3_prefix: s3Prefix,
  };
  const s3Data = await axiosInstance.post<S3BucketObject>(`archive/api/get_s3_objects`, s3PathReq);
  return convertToObject(s3Data.data);
};

export const downloadS3Files = async (bucket_name: string, selected_files: string[]) => {
  const s3DownloadReq = {
    bucket_name,
    selected_files,
  };
  const s3Data = await axiosInstance.post<{ url: string }>(`archive/api/download_s3_object`, s3DownloadReq);
  return s3Data.data;
};

export const downloadSummaryReport = async (
  selectedArchives: { archive_name: string; id: string }[],
): Promise<Blob> => {
  const payload = { data: selectedArchives };
  const response = await axiosInstance.post('archive/SummaryreportRL', payload, { responseType: 'blob' });
  return response.data;
};

// Retention Policy Dev APIs

export const getRetentionPolicyList = async () => {
  return (await axiosInstance.get<{ data: RetentionPolicyListItem[] }>('archive/retention/view')).data.data;
};

export const applyRetentionPolicy = async (data: { archive_id: string; policy_name: string; created_by: string }) => {
  const payload = {
    archive_id: data.archive_id,
    policy_name: data.policy_name,
    created_by: data.created_by,
  };
  return await axiosInstance.put('archive/retention/apply', payload);
};
