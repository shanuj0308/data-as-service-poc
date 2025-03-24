import { BASE_URL } from './secret';

export const ArchivedDataConstant = {
  ID: 'id',
  ARCHIVE_NAME: 'app_name',
  TIME_SUBMITTED: 'completed_on',
  LEGAL_HOLD: 'legal_hold',
  DATABASE_ENGINE: 'archival_type',
  GXP: 'gxp',
  RETENTION_POLICY: 'retention_policy',
  EXPIRATION_DATE: 'expiration_date'
};

export const WebendpointConstant = {
  BASE_URL: BASE_URL,
  ARCHIVE_DATA_LISTING_URL: 'archive/api/list',
  EXECUTE_QUERY_API: 'archive/api/query',
  GET_COLUMNS_API: 'archive/api/get_columns',
  GET_TABLES_API: 'archive/api/get_tables',
  GET_SCHEMAS_API: 'archive/api/get_schemas',
};

export const connectionDataColumns = {
  ID: 'id',
  CONNECTION_NAME: 'connection_name',
  DESCRIPTION: 'description',
  DATABASE_ENGINE: 'database_engine',
};

export const jobTableConstants = {
  JOB_NAME: 'job_name',
  ARCHIVE_STATUS: 'archive_status',
  START_TIME: 'start_time',
  END_TIME: 'end_time',
  JOB_ID: 'job_id',
  DURATION: 'duration',
  TRIGGERED_BY: 'triggered_by',
}