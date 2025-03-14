import { RootState } from '@/store';

export const appLoadingSelector = (state: RootState) => state.app.isLoading;
