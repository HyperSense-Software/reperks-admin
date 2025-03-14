import { AuthState } from '@/models';

export const authInitialState: { value: AuthState } = {
  value: {
    isAuth: false,
    name: '',
    email: '',
    role: '',
    token: '',
  },
};
