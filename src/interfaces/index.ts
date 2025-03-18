import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons | string;
  label?: string;
  description?: string;
}

export interface authRecoverCognitoState {
  username: string;
}

export interface authCognitoState {
  email: string;
  password: string;
}

export interface AuthState {
  isAuth: boolean;
  name: string;
  email: string;
  role: string;
  token: string;
}

export interface AppState {
  isLoading: boolean;
}
