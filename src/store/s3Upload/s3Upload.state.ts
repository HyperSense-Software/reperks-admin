export interface s3UploadState {
  url: string;
  path: string;
  loading: boolean;
  error: unknown;
}

export const s3UploadInitialState: s3UploadState = {
  url: '',
  path: '',
  loading: false,
  error: {},
};
