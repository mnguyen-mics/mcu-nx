export interface PublicJobExecutionResource {
  id: string;
  status: JobExecutionPublicStatus;
  creation_date: number;
  start_date?: number;
  duration?: number;
  organisation_id?: string;
  user_id?: string;
  debug?: string;
  num_tasks?: number;
  completed_tasks?: number;
  erroneous_tasks?: number;
  external_model_name: ExternalModelName;
}

export type JobExecutionPublicStatus = 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';

export type ExternalModelName =
  | 'PUBLIC_EXPORT'
  | 'PUBLIC_CATALOG'
  | 'PUBLIC_DATAMART'
  | 'PUBLIC_AUDIENCE_SEGMENT'
  | 'PUBLIC_DOCUMENT_IMPORT'
  | 'PUBLIC_MODEL_LEARNING_JOB'
  | 'PUBLIC_DATAMART_REPLICATION'
  | 'PUBLIC_REFERENCE_TABLE'
  | 'PUBLIC_INTEGRATION_BATCH';
