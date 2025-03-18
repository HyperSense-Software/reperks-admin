import { createAsyncThunk } from '@reduxjs/toolkit';
import { preSignedUrl } from '@/services/s3';

export const uploadS3 = createAsyncThunk('setUpload', preSignedUrl);
