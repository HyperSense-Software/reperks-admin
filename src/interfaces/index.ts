import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url?: string;
  disabled?: boolean;
  external?: boolean;
  isActive?: boolean;
  icon?: keyof typeof Icons | string;
  label: string; //for translation
  description?: string;
  items?: {
    title: string;
    url: string;
  }[];
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
