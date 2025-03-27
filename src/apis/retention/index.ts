import axios from 'axios';

import { BASE_URL } from '@/constant/secret';
import { getCookie } from '@/lib/utils';
import { RetentionPolicy } from '@/types/common';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to attach idToken from cookie
axiosInstance.interceptors.request.use(
  (config) => {
    const idToken = getCookie('idToken');
    const accessToken = getCookie('accessToken');
    if (idToken) {
      config.headers.Authorization = `idToken ${idToken}||accessToken ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Get all Retention policy lists
 */
export const getRetentionPolicies = async () => {
  return (await axiosInstance.get<RetentionPolicy[]>(`archive/retention/list`)).data;
};

/**
 * Create Retention policy
 */
export const createRetentionPolicy = async (retentionData: RetentionPolicy) => {
  return await axiosInstance.post('archive/retention/create', retentionData);
};

/**
 * Get single Retention policy by policy name
 */
export const getRetentionPolicy = async (policy_name: string) => {
  return (await axiosInstance.post<RetentionPolicy>(`archive/retention/view`, { policy_name })).data;
};

/**
 * Update Retention policy
 */
export const updateRetentionPolicy = async (retentionData: RetentionPolicy) => {
  return await axiosInstance.put(`archive/retention/update`, { ...retentionData });
};

/**
 * Delete Retention policy
 */
export const deleteRetentionPolicy = async (policy_name: string) => {
  return await axiosInstance.delete<void>(`archive/retention/delete`, { data: { policy_name } });
};
