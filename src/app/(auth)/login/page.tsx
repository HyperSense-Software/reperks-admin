import { Metadata } from 'next';
import React from 'react';
import { LoginForm } from './loginForm';

export const metadata: Metadata = {
  title: {
    absolute: '',
    default: 'Login',
  },
  description: 'Login',
};

export default function Login() {
  return <LoginForm></LoginForm>;
}
