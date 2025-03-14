import { createAsyncThunk } from '@reduxjs/toolkit';
import { preSignedUrl } from '@/services/portfolio';

export const uploadS3 = createAsyncThunk('setUpload', preSignedUrl);
