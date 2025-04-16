import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      let token = session?.tokens?.accessToken.toString();
      token =
        'eyJraWQiOiJrQTdlbDZRRjFtdjFrUlBVSWY5Z3lZRWRCTG15dGRzajNFOGE1dVBkVUNZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5M2Q0MTg5Mi1jMDExLTcwMjAtNzZjNS0wMjAwY2RjOTc0MDUiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbiIsImxhbmRsb3JkIiwic3VwZXJfYWRtaW4iLCJ0ZW5hbnQiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfVFRFY2M3SEtNIiwiY2xpZW50X2lkIjoiNWVtZ3J1ZGo2Zzg5Zms4dmZrYzFqMHZvNHQiLCJvcmlnaW5fanRpIjoiM2RhZjZjNmItOTQ2MC00ZDA1LTg1MTAtYWM1NmI1NGEzNjExIiwiZXZlbnRfaWQiOiI1MTY4ZWVhNC0zMTc2LTQ3OTgtODcwMC0wZmM0MTIxYzkyMzMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzQ0ODAyNjk1LCJleHAiOjE3NDQ4MDYyOTUsImlhdCI6MTc0NDgwMjY5NSwianRpIjoiZmNkMzFlZjUtYjAyMi00NDc0LThjZGQtOWI3YmRiNGJkMzYzIiwidXNlcm5hbWUiOiI5M2Q0MTg5Mi1jMDExLTcwMjAtNzZjNS0wMjAwY2RjOTc0MDUifQ.LeH57-0wV8poSGFA9PeEz5KwAYkVnE_Y35QU_G8AXzq7R2fa4nEDbmXBRZ9ZdG2zQxUgz1JONGXW4bKavS1ypKiatbXUJRJTYIF_ECo12rM-G8Bvk5dEsNjUsjuu0-IUrfxDf1rJwrYTZ_3ie2Obp-T_xvHIhm-nz1_lMXDbT_SYRZYpM1A-ql5zHiDIEgu0CMih4Hy-xjQJ8p9RbZ0m2D3RDNz5GI3u0VIs0NpLdWGf5P9AQTVFF8gBDwP4vqqT-Oduaesf0lCKhseVt61YGGnuJIamozuYzxRN-FD5iUJvbIehHVunLqr8x8CPNJ2Zlzb4ulSZRqLWB60QveZLKg';
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
