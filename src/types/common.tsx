// src/types/common.tsx
import * as z from 'zod';

import { noSpecialCharacters, noSpecialCharactersOrSpaces, validS3BucketName } from '@/lib/utils';

export type GraphData = {
  displayName: string;
  userPrincipalName: string;
  mail: string;
  businessPhones: string[];
  officeLocation: string;
  jobTitle: string;
};

export type ArchivedData = {
  application_folder: string;
  completed_at: string;
  legal_hold: 'Yes' | 'No';
  type: 'Structured' | 'Unstructured';
  gxp: 'Gxp' | 'Gxp Medium' | 'Gxp High' | 'Non-Gxp';
};

export type CreateJobData = {
  archive_name: string;
  source_name: string;
  target_name: string;
  sgrc_id: string;
  retention_policy: string;
  legal_hold: string;
  description: string;
  created_by: string;
  app_name: string;
  archival_type: string;
};

export type TargetConnectionsData = {
  id?: number;
  connection_name: string;
  connection_type?: string;
  description: string;
  bucket_name: string;
};

/**
 * Form Schema for create and edit source connection
 */
export const LegalHoldSchema = z.object({
  legalhold_name: z.string().min(1, 'Legal Hold Name is required'),
  Description: z.string().min(1, 'Description is required'),
  archive_name: z.any().optional(),
  user_id: z.string().optional(),
});

export const ApplyLegalHoldSchema = z.object({
  archive_id: z.string().min(1, 'Application is required'),
  policy_name: z.string().optional(),
});

export interface LegalHoldListItem {
  id: string;
  archive_name: string;
  legal_hold: boolean;
  legal_hold_name?: string;
  bucket_name?: string;
}

export type LegalHoldData = z.infer<typeof LegalHoldSchema>;
export type ApplyLegalHoldData = z.infer<typeof ApplyLegalHoldSchema>;

export interface Application {
  archive_name: string;
  database_engine: string;
  legal_hold: string;
  id: string;
  time_submitted: string;
  gxp: string | null;
}

export type S3Connection = {
  bucket_name: string;
};

// Define the validation schema for the SourceForm component
const hostnameSchema = z
  .string()
  .min(3, { message: 'Hostname must be at least 3 characters long' })
  .max(63, { message: 'Hostname must be at most 63 characters long' })
  .regex(/^[a-z0-9.-]+$/, { message: 'Hostname can only contain lowercase letters, numbers, hyphens, and periods' })
  .refine((value) => !value.startsWith('-') && !value.endsWith('-') && !value.startsWith('.') && !value.endsWith('.'), {
    message: 'Hostname cannot start or end with a hyphen or period',
  });

export const SourceFormSchema = z.object({
  connection_name: z
    .string()
    .min(1, { message: 'Connection name is required' })
    .max(15, { message: 'Connection name cannot be greater than 15 characters' })
    .regex(/^[a-zA-Z0-9\s+-_]+$/, {
      message: 'Special characters only + and - are allowed',
    }),
  database_engine: z.string().min(1, { message: 'Please select a database engine' }),
  hostname: hostnameSchema,
  port: z
    .string()
    .min(1, { message: 'Port is required' })
    .max(5, { message: 'Port must be at most 5 digits long' })
    .regex(/^[0-9]+$/, { message: 'Port must be a number' }),
  database: z.string().min(1, { message: 'Db name is required' }),
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: 'Special characters are not allowed',
    }),
});

export const JobFormSchema = z.object({
  archive_name: noSpecialCharactersOrSpaces,
  source_name: z.string().min(1, { message: 'Source connection is required' }),
  target_name: z.string().min(1, { message: 'Target connection is required' }),
  created_by: z.string(),
  description: z.string(),
  sgrc_id: z.string().min(1, { message: 'SGRC Id is required' }),
  app_id: z.string(),
  app_name: z.string().min(1, { message: 'App Name is required' }),
  archival_type: z.string().min(1, { message: 'Archival Type is required' }),
  retention_policy: z.string(),
  legal_hold: z.string(),
});

export const TargetFormSchema = z.object({
  connection_name: z.string().min(1, { message: 'Name is required' }),
  bucket_name: z.string().refine((name) => validS3BucketName(name), {
    message: 'Invalid S3 bucket name',
  }),
  description: z.string().min(1, { message: 'Description is required' }),
});

/**
 * Data type for Rentention Policy
 */
export type RetentionPolicy = {
  id?: number;
  policy_name: string;
  description: string;
  retention_type: 'retention_period' | 'exact_expiry_date';
  retention_period?: number;
  retention_period_unit?: 'days' | 'months' | 'years';
  exact_expiry_date?: Date;
  created_by: string;
  created_at?: Date;
  modified_at?: Date;
};

/**
 * Form Schema for create and edit retention policy
 */
export const RetetntionFormSchema = z
  .object({
    policy_name: noSpecialCharacters
      .min(1, { message: 'Name is required' })
      .max(120, { message: 'Name must be at most 120 characters' }),
    description: noSpecialCharacters.min(1, { message: 'Description is required' }),
    retention_type: z.enum(['retention_period', 'exact_expiry_date'], {
      message: 'Retention type is required',
    }),
    retention_period: z.coerce.number({ message: 'Retention period is required' }).optional(),
    retention_period_unit: z.enum(['days', 'months', 'years']).optional(),
    exact_expiry_date: z.coerce.date({ message: 'Expiry date is required' }).optional(),
    created_by: z.string().min(1, { message: 'Invalid request data' }),
  })
  .refine(
    (data) => {
      if (data.retention_type === 'retention_period' && !data.retention_period) {
        return false;
      }
      if (data.retention_type === 'exact_expiry_date' && !data.exact_expiry_date) {
        return false;
      }
      return true;
    },
    {
      message: 'Retention period or exact expiry date is required',
      path: ['retention_period', 'exact_expiry_date'],
    },
  )
  .refine(
    (data) => {
      if (data.retention_type === 'retention_period') {
        const retentionPeriod = data.retention_period!;
        const retentionPeriodUnit = data.retention_period_unit!;
        if (!retentionPeriodUnit) {
          return false;
        }
        if (data.retention_period_unit === 'days' && (retentionPeriod <= 0 || retentionPeriod > 365)) {
          return false;
        }
        if (data.retention_period_unit === 'months' && (retentionPeriod <= 0 || retentionPeriod > 12)) {
          return false;
        }
        if (data.retention_period_unit === 'years' && (retentionPeriod <= 0 || retentionPeriod > 100)) {
          return false;
        }
      }
      return true;
    },
    {
      message:
        'Invalid retention period, it should be between 1 and 365 for days, 1 and 12 for months, and 1 and 100 for years',
      path: ['retention_period'],
    },
  );

export type SourceConnectionsData = {
  id?: number;
  connection_name: string;
  description: string;
  database_engine: string;
  hostname: string;
  port: string;
  database: string;
  username: string;
  password: string;
};

export type ArchivalData = {
  id: string;
  app_name: string;
  completed_on: string;
  legal_hold: 'Yes' | 'No';
  archival_type: 'Structured' | 'Unstructured';
  gxp: 'Gxp' | 'Gxp Medium' | 'Gxp High' | 'Non-Gxp' | null;
  retention_policy: string;
  expiration_date: string;
};

export type JobData = ArchivalData & {
  end_time: any;
  start_time: any;
  duration: any;
};

export type JobDataList = {
  end_time: any;
  start_time: any;
  duration: any;
  job_name: any;
  archive_status: any;
  triggered_by: any;
  job_id: any;
};

export type JobRunData = {
  archive_id: string;
  worker_capacity: number;
  worker_type: string;
  archive_schedule: object;
};

export type S3ObjectList = {
  item_name: string;
  item_type: string;
  size: string;
  last_modified?: string;
  bucketName: string;
  s3_path: string;
};

export type S3Object = {
  Key: string;
  Size: string;
  LastModified: Date;
  file_type: string;
};

export type S3BucketObject = {
  folders: string[] | [];
  files: S3Object[] | [];
  s3_path: string;
};

export interface LegalHoldListItem {
  id: string;
  archive_name: string;
  legal_hold: boolean;
  legal_hold_name?: string;
  bucket_name?: string;
}

export interface RetentionPolicyListItem {
  id: string;
  archive_name: string;
  expiration_date?: string;
  retention_policy?: string;
  retention_type?: string;
  bucket_name?: string;
}
