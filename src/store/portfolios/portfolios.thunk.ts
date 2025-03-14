import { createAsyncThunk } from '@reduxjs/toolkit';
import { getPortfoliosFromAPI } from '@/services/portfolios';

export const getPortfolios = createAsyncThunk('getPortfolios', getPortfoliosFromAPI);
