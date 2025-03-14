import { z } from 'zod';

export interface authRegisterCognitoState {
  email: string;
  password: string;
  name: string;
}

export interface authRecoverCognitoState {
  username: string;
}

export interface authActivateCognitoState {
  confirmationCode: string;
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

export const loginSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Adresa de email este invalida',
    })
    .min(10, {
      message: 'Adresa de email trebuie sa contina cel putin 10 caractere',
    })
    .max(100, {
      message: 'Adresa de email trebuie sa contina cel mult 100 de caractere',
    }),
  password: z
    .string()
    .min(6, {
      message: 'Parola trebuie sa contina cel putin 6 caractere',
    })
    .max(30, {
      message: 'Parola trebuie sa contina cel mult 30 de caractere',
    }),
});

// type loginSchemaType = z.infer<typeof loginSchema>;

export const recoverSchema = z.object({
  username: z
    .string()
    .email({
      message: 'Adresa de email este invalida',
    })
    .min(10, {
      message: 'Adresa de email trebuie sa contina cel putin 10 caractere',
    })
    .max(100, {
      message: 'Adresa de email trebuie sa contina cel mult 100 de caractere',
    }),
});

export const activateSchema = z.object({
  confirmationCode: z.string(),
  username: z.string().email({
    message: 'Adresa de email este invalida',
  }),
});

export const confirmationCodeSchema = z.object({
  confirmationCode: z.string(),
});

// type recoverSchemaType = z.infer<typeof recoverSchema>;

export const registerSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Adresa de email este invalida',
    })
    .min(10, {
      message: 'Adresa de email trebuie sa contina cel putin 10 caractere',
    })
    .max(100, {
      message: 'Adresa de email trebuie sa contina cel mult 100 de caractere',
    }),
  password: z
    .string()
    .min(6, {
      message: 'Parola trebuie sa contina cel putin 6 caractere',
    })
    .max(30, {
      message: 'Parola trebuie sa contina cel mult 30 de caractere',
    }),
  name: z
    .string()
    .min(6, {
      message: 'Numele trebuie sa contina cel putin 4 caractere',
    })
    .max(30, {
      message: 'Numele trebuie sa contina cel mult 30 de caractere',
    }),
});

// type registerSchemaType = z.infer<typeof registerSchema>;
