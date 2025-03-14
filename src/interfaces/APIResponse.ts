export interface Response<T> {
  error_code: {
    code: number;
    message: string;
  };
  response: T;
}
