// src/apis/mutations.ts
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  applyLegalHold,
  createLegalHold,
  createS3Connection,
  createSourceConnection,
  downloadS3Files,
  fetchJobTables,
  getTestSourceConnection,
  removeLegalHold,
  runJob,
  saveJob,
  updateSourceConnection,
  updateTargetConnection,
} from '@/apis';
import { createRetentionPolicy, deleteRetentionPolicy, updateRetentionPolicy } from '@/apis/retention';
import { toast } from '@/components/ui/use-toast';
import useUsername from '@/hooks/useUsername';
import { CreateJobData, RetentionPolicy, SourceConnectionsData, TargetConnectionsData } from '@/types/common';

export const useCreateSourceConnection = () => {
  const queryClient = useQueryClient();
  const username = useUsername();

  return useMutation({
    mutationFn: (data: SourceConnectionsData) => {
      const payload = {
        ...data,
        created_by: username || 'anonymous',
      };
      return createSourceConnection(payload);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast({
          variant: 'destructive',
          title: error.message,
          description: error.response?.data || 'Error while creating connection. Please try again.',
        });
      }
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Connection saved successfully.',
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sourceList'] });
    },
  });
};

export const useCreateS3Connection = () => {
  const queryClient = useQueryClient();
  const username = useUsername();

  return useMutation({
    mutationFn: (data: TargetConnectionsData) => {
      const payload = {
        ...data,
        created_by: username || 'anonymous',
      };
      return createS3Connection(payload);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast({
          variant: 'destructive',
          title: error.message,
          description: error.response?.data || 'Error while creating connection. Please try again.',
        });
      }
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Connection created successfully.',
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['targetList'] });
    },
  });
};

/**
 * Test source connetion data before saving them
 * @param source_con_data - Source connection data
 * @returns void
 */
export const useTestSourceConnection = () => {
  return useMutation({
    mutationFn: (data: SourceConnectionsData) => getTestSourceConnection(data),
    onError: (error) => {
      console.log('Error');
      console.error('Mutation error:', error.message);
      toast({
        variant: 'destructive',
        title: error.message,
        description: 'Connection failed, please check the details and try again.',
      });
    },
    onSuccess: (data) => {
      const { connected } = data;
      if (connected === false)
        return toast({
          variant: 'destructive',
          title: 'Connection failed, please check the details and try again.',
        });
      toast({
        variant: 'default',
        title: 'Connection successful, please create the connection.',
      });
    },
    onSettled: async (_, errors) => {
      console.log('Settled');
      console.log(errors);
    },
  });
};

export const useUpdateSourceConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SourceConnectionsData) => updateSourceConnection(data),
    onError: (error) => {
      console.log('Error');
      console.error('Mutation error:', error.message);
      toast({
        variant: 'destructive',
        title: error.message,
      });
    },
    onSuccess: () => {
      console.log('Success');
      toast({
        variant: 'default',
        title: 'Connection updated successfully.',
      });
    },
    onSettled: async (_, errors) => {
      console.log('Settled');
      console.log(errors);
      await queryClient.invalidateQueries({ queryKey: ['sourceList'] });
      await queryClient.invalidateQueries({ queryKey: ['sourceConData'] });
    },
  });
};

export const useCreateJob = () => {
  const useClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateJobData) => {
      console.log(data);
      const jobId = (await fetchJobTables(data)).data['job_id'];
      console.log(jobId);
      return saveJob(jobId);
    },
    onMutate: () => {
      console.log('Mutate');
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error creating job.',
        description: 'Error while creating job. Please try again.',
      });
    },
    onSuccess: () => {
      console.log('Success');
      toast({
        variant: 'default',
        title: 'Job created successfully.',
      });
    },
    onSettled: async (_, errors) => {
      console.log('Settled');
      console.log(errors);
      await useClient.invalidateQueries({ queryKey: ['JobDataList'] }); // to invalidate the existing data, and fetch new
    },
  });
};

export const useUpdateTargetConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TargetConnectionsData) => updateTargetConnection(data),
    onError: (error) => {
      console.log('Error');
      console.error('Mutation error:', error.message);
      toast({
        variant: 'destructive',
        title: error.message,
      });
    },
    onSuccess: (msg) => {
      console.log('Success', msg);
      toast({
        variant: 'default',
        title: 'Connection updated successfully.',
      });
    },
    onSettled: async (_, errors) => {
      console.log('Settled');
      console.log(errors);
      await queryClient.invalidateQueries({ queryKey: ['targetList'] });
    },
  });
};

export const useCreateLegalHold = () => {
  const queryClient = useQueryClient();
  const username = useUsername();

  return useMutation({
    mutationFn: async (data: { legalhold_name: string; description: string; user_id?: string }) => {
      const payload = {
        legalhold_name: data.legalhold_name,
        description: data.description,
        user_id: data.user_id || username || 'anonymous',
      };

      return await createLegalHold(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legalHoldList'] });
      toast({
        title: 'Success',
        description: 'Legal hold created successfully',
        variant: 'default',
      });
    },
    onError: (error) => {
      console.error('Error creating legal hold:', error);
      toast({
        title: 'Error',
        description: 'Failed to create legal hold',
        variant: 'destructive',
      });
    },
  });
};

export const useApplyLegalHold = () => {
  const queryClient = useQueryClient();
  const username = useUsername();

  return useMutation({
    mutationFn: async (data: { archive_id: string; policy_name: string }) => {
      const payload = {
        archive_id: data.archive_id,
        policy_name: data.policy_name,
        created_by: username || 'anonymous',
      };

      return await applyLegalHold(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legalHoldList'] });
      toast({
        title: 'Success',
        description: 'Legal hold applied successfully',
        variant: 'default',
      });
    },
    onError: (error) => {
      console.error('Error applying legal hold:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply legal hold',
        variant: 'destructive',
      });
    },
  });
};

export const useRemoveLegalHold = () => {
  const queryClient = useQueryClient();
  const username = useUsername();

  return useMutation({
    mutationFn: async (data: { archive_id: string }) => {
      const payload = {
        archive_id: data.archive_id,
        policy_name: 'False',
        created_by: username || 'anonymous',
      };

      return await removeLegalHold(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legalHoldList'] });
      toast({
        title: 'Success',
        description: 'Legal hold removed successfully',
        variant: 'default',
      });
    },
    onError: (error) => {
      console.error('Error removing legal hold:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove legal hold',
        variant: 'destructive',
      });
    },
  });
};

export const useRunJob = () => {
  return useMutation({
    mutationFn: (data: any) => runJob(data),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: error.message,
        description: axios.isAxiosError(error) && error.response ? error.response.data : '',
      });
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Job run submitted successfully.',
      });
    },
    onSettled: async (_, errors) => {
      console.log('Settled');
      console.log(errors);
    },
  });
};

/**
 * Create new retention pilicy
 * @returns null
 */
export const useCreateRetention = () => {
  const useClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RetentionPolicy) => createRetentionPolicy(data),
    onMutate: () => {
      console.log('Mutate');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: `Error while creating policy`,
        description: axios.isAxiosError(error) && error.response ? error.response.data : '',
      });
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Retention saved successfully.',
      });
    },
    onSettled: async (_, errors) => {
      console.log(errors);
      await useClient.invalidateQueries({ queryKey: ['retentionPolicyList'] });
      await useClient.invalidateQueries({ queryKey: ['retentionPolicy'] });
    },
  });
};

/**
 * Update existing retention pilicy
 * @returns null
 */
export const useUpdateRetention = () => {
  const useClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RetentionPolicy) => updateRetentionPolicy(data),
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error saving retention.',
        description: 'Error while saving the retention. Please try again.',
      });
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Retention saved successfully.',
      });
    },
    onSettled: async (_, errors) => {
      console.log(errors);
      await useClient.invalidateQueries({ queryKey: ['retentionPolicyList'] });
      await useClient.invalidateQueries({ queryKey: ['retentionPolicy'] });
    },
  });
};

/**
 * Delete retention pilicy
 * @returns null
 */
export const useDeleteRetention = () => {
  const useClient = useQueryClient();
  return useMutation({
    mutationFn: (policy_name: string) => deleteRetentionPolicy(policy_name),
    onMutate: () => {
      console.log('Mutate');
    },
    onError: () => {
      console.log('Error');
      toast({
        variant: 'destructive',
        title: 'Error deleting retention.',
        description: 'Error while deleting the retention. Please try again.',
      });
    },
    onSuccess: () => {
      console.log('Success');
      toast({
        variant: 'default',
        title: 'Retention deleted successfully.',
      });
    },
    onSettled: async (_, errors) => {
      console.log('Settled');
      console.log(errors);
      await useClient.invalidateQueries({ queryKey: ['retentionPolicyList'] });
      await useClient.invalidateQueries({ queryKey: ['retentionPolicy'] });
    },
  });
};
/**
 * Download s3 bucket files
 * No Cache, as we are getting pre-signed s3 url which get expired after few minutes
 */

export const useDownloadS3Files = () => {
  return useMutation({
    mutationFn: ({ bucketName, selected_files }: { bucketName: string; selected_files: string[] }) =>
      downloadS3Files(bucketName, selected_files),
    onError: (error) => {
      console.log('Error');
      console.error('Mutation error:', error.message);
      toast({
        variant: 'destructive',
        title: error.message,
      });
    },
    onSuccess: (msg) => {
      console.log('Success', msg);
      toast({
        variant: 'default',
        title: 'File downloaded successfully.',
      });
    },
  });
};
