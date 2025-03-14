import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { s3UploadInitialState, s3UploadState } from './s3Upload.state';
import { uploadS3 } from './s3Upload.thunk';
import { PreAsignedUrlResponse } from '@/interfaces/Portfolio';

export const s3UploadSlice = createSlice({
  name: 's3Upload',
  initialState: s3UploadInitialState,
  reducers: {
    setUpload: (state: s3UploadState, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        uploadS3.fulfilled,
        (state: s3UploadState, action: PayloadAction<PreAsignedUrlResponse | unknown>) => {
          const payload = action.payload as PreAsignedUrlResponse;

          state.url = payload.url + payload.fields.key;
          state.path = payload.fields.key;
          state.loading = false;
        },
      )
      .addCase(uploadS3.pending, (state: s3UploadState) => {
        state.loading = true;
      })
      .addCase(uploadS3.rejected, (state: s3UploadState, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.error = action.payload;
      });
  }, // Add extra reducers here for Async Await .replace('tmp/', '')
});

export default s3UploadSlice.reducer;
