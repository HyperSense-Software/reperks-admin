import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      const token = session?.tokens?.accessToken.toString();
      // token =
      //   'eyJraWQiOiJrQTdlbDZRRjFtdjFrUlBVSWY5Z3lZRWRCTG15dGRzajNFOGE1dVBkVUNZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5M2Q0MTg5Mi1jMDExLTcwMjAtNzZjNS0wMjAwY2RjOTc0MDUiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbiIsImxhbmRsb3JkIiwic3VwZXJfYWRtaW4iLCJ0ZW5hbnQiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfVFRFY2M3SEtNIiwiY2xpZW50X2lkIjoiNWVtZ3J1ZGo2Zzg5Zms4dmZrYzFqMHZvNHQiLCJvcmlnaW5fanRpIjoiY2E0ZWI3NmMtYjNiNy00Y2I4LTljMWQtNTQ2MDg2ODRlM2Q0IiwiZXZlbnRfaWQiOiJiMTlmMWM2MC0yZTVjLTRhMTctOGVhMC1kNmZmNjFkNmZhODYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzQ0NzI5NzQ4LCJleHAiOjE3NDQ3MzMzNDgsImlhdCI6MTc0NDcyOTc0OCwianRpIjoiYzMwOGFhNjctMTg1ZC00Njc4LTgxYTUtYjZlMTkwMDY3YzAyIiwidXNlcm5hbWUiOiI5M2Q0MTg5Mi1jMDExLTcwMjAtNzZjNS0wMjAwY2RjOTc0MDUifQ.g5Ni0110A9iuegT4isNBHAcBWMcORbAwqMMzvAyW0Q76nKOtyO6MUhLYFAbvqzVlGuKujuXfTjiFF28S7LKg4Boy4FiEazVHq2Amc8U-1hrZFy0JFhg1JkIl332606g1k_1KW_Gjd8tfHzLvEZE2UlGCxlI_D8pesakESDPivnnf5Uz8ngRBPbHoy9CVGbJVOu-HveSOtka7VQ-Nw6xUg1H0Ky7jqNuH-bn5uifvHga8k87vcQBG3HFZVkb8SRGGdQdMFa3KNZrMmtFdPR8xJnJTLTKFjRmAAkFV5aW7Txk6NGx9AvHURq1-cdLemchnKV5z8jNdA6qHLTD2_RRE7A';
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

export default axiosInstance;
