import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  adminCreatePortfolioFromAPI,
  adminDeletePortfolioByIdFromAPI,
  adminUpdatePortfolioFromAPI,
  getPortfolioFromAPI,
} from '@/services/portfolio';

export const getPortfolio = createAsyncThunk('getPortfolio', getPortfolioFromAPI);

export const adminCreatePortfolio = createAsyncThunk(
  'adminCreatePortfolio',
  adminCreatePortfolioFromAPI,
);

export const adminUpdatePortfolioById = createAsyncThunk(
  'adminUpdatePortfolioById',
  adminUpdatePortfolioFromAPI,
);

export const adminDeletePortfolioById = createAsyncThunk(
  'adminDeletePortfolioById',
  adminDeletePortfolioByIdFromAPI,
);
