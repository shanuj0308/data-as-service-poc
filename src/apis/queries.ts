// src/apis/queries.ts
import { useQuery } from '@tanstack/react-query';

import {
  getApplicationsList,
  getJobList,
  getLegalHold,
  getLegalHoldList,
  getSourceConnection,
  getSourceConnections,
  getTargetConnection,
  getTargetConnections,
  getUnstructuredDataList,
} from '@/apis';
import { getRetentionPolicies, getRetentionPolicy } from '@/apis/retention';

/**
 * Fetch all source connection data
 * @returns Array of Source connection data
 */
export const useSourceConnectionList = () => {
  return useQuery({
    queryKey: ['sourceList'], // Include path in query key for cache
    queryFn: getSourceConnections,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetch single source connetion data based on connection_name
 * @param connection_name string
 * @returns Source connection data object
 */
export const useSourceConnection = (connection_name: string) => {
  return useQuery({
    queryKey: ['sourceConData', { connection_name }],
    queryFn: getSourceConnection,
  });
};

export const useTargetConnectionList = () => {
  return useQuery({
    queryKey: ['targetList'],
    queryFn: getTargetConnections,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTargetConnection = (connection_name: string, bucket_name: string) => {
  return useQuery({
    queryKey: ['targetConData', { connection_name, bucket_name }], // Include path in query key for cache
    queryFn: getTargetConnection,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLegalHoldList = () => {
  return useQuery({
    queryKey: ['legalHoldList'],
    queryFn: getLegalHoldList,
    staleTime: 1000 * 60 * 5,
  });
};

export const useJobDataList = () => {
  return useQuery({
    queryKey: ['JobDataList'],
    queryFn: getJobList,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLegalHold = (legal_hold_name: string) => {
  return useQuery({
    queryKey: ['legalHold', legal_hold_name],
    queryFn: () => getLegalHold(legal_hold_name),
  });
};

export const useApplicationsList = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: getApplicationsList,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetch All Retention Policy
 */
export const useRetentionPolicyList = () => {
  return useQuery({
    queryKey: ['retentionPolicyList'],
    queryFn: getRetentionPolicies,
    staleTime: 1000 * 60 * 5, // 5 min in milliseconds new data will not be fetched
  });
};

/**
 * Fetch single Retention Policy
 */
export const useRetentionPolicy = (policy_name: string) => {
  return useQuery({
    queryKey: ['retentionPolicy', { policy_name }],
    queryFn: () => getRetentionPolicy(policy_name),
    staleTime: 1000 * 60 * 5, // 5 min in milliseconds new data will not be fetched
  });
};

/*
 * @returns Fetch Lists of s3 buckets with details
 */
export const useUnstructuredDataList = (archiveId: string, s3Prefix: string) => {
  return useQuery({
    queryKey: ['unstructuredDataList', { archiveId, s3Prefix }], // Include path in query key for cache
    queryFn: () => getUnstructuredDataList(archiveId, s3Prefix),
    staleTime: 1000 * 60 * 60 * 24 * 1, // 1 day in milliseconds
  });
};
