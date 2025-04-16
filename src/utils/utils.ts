import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuid } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PerPage = 10;
export const formatDate = 'dd.MM.yyyy';

export const uuidTopic = (prefix: string) => {
  const uid = uuid();
  let env: string = process.env.NODE_ENV ?? 'development';
  if (env === 'localhost') env = 'development';
  return [prefix, env, uid].join('_');
};

export const tempFilePrefix = 'temp/';
