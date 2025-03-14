import { RootState } from '@/store';

export const appValueSelector = (state: RootState) => state.auth.value;
