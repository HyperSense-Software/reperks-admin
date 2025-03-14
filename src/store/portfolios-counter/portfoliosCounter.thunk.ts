import { createAsyncThunk } from '@reduxjs/toolkit';
import { getPortfoliosCounterFromAPI } from '@/services/portfolios';

export const getPortfoliosCounter = createAsyncThunk(
  'getPortfoliosCounter',
  getPortfoliosCounterFromAPI,
);
