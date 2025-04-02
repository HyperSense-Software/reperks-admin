import { RootState } from '@/store';

export const s3UploadStateSelector = (state: RootState) => state.s3Upload.url;
export const s3UploadUrlSelector = (state: RootState) => state.s3Upload.path;
export const s3UploadLoadingSelector = (state: RootState) =>
  state.s3Upload.loading;
export const s3UploadErrorSelector = (state: RootState) => state.s3Upload.error;
