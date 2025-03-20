import { AuthState } from '@/interfaces';

export const authInitialState: { value: AuthState } = {
  value: {
    isAuth: false,
    name: '',
    email: '',
    role: '',
    token: '',
  },
};
