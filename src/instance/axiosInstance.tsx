import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession();
      const token = session?.tokens?.accessToken.toString();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error fetching the token', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
