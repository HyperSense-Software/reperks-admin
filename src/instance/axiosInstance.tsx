import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      const token = session?.tokens?.accessToken.toString();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error fetching the token', error);
    }
    return config;
  },
  (error) => {
    console.log('error', error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    // If the response is successful (status code 2xx), return the response data
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      const errorResponse = error.response.data;
      if (errorResponse.error_code && errorResponse.error_code.message) {
        throw new Error(errorResponse.error_code.message);
      }
    }
    throw error;
  },
);
export default axiosInstance;
