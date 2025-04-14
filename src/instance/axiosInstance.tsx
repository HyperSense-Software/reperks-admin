import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      //const session = await fetchAuthSession({ forceRefresh: true });
      //const token = session?.tokens?.accessToken.toString();
      const token =
        'eyJraWQiOiJrQTdlbDZRRjFtdjFrUlBVSWY5Z3lZRWRCTG15dGRzajNFOGE1dVBkVUNZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5M2Q0MTg5Mi1jMDExLTcwMjAtNzZjNS0wMjAwY2RjOTc0MDUiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbiIsImxhbmRsb3JkIiwic3VwZXJfYWRtaW4iLCJ0ZW5hbnQiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfVFRFY2M3SEtNIiwiY2xpZW50X2lkIjoiNWVtZ3J1ZGo2Zzg5Zms4dmZrYzFqMHZvNHQiLCJvcmlnaW5fanRpIjoiZmU5MjVkYjMtZTBiNy00M2ViLWE0MGQtYmY4ZGQyMTRiNmY2IiwiZXZlbnRfaWQiOiIzOTlmNTIwMC02ODFhLTQ4MmYtYjQzMS02NjM1MWYzNTI2MGMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzQ0NjIwOTgxLCJleHAiOjE3NDQ2MjQ2NTMsImlhdCI6MTc0NDYyMTA1MywianRpIjoiNmZhMjdkYzgtZDI3Ny00ZTQ4LWIwYzctM2M2MjA4ZjU3OGExIiwidXNlcm5hbWUiOiI5M2Q0MTg5Mi1jMDExLTcwMjAtNzZjNS0wMjAwY2RjOTc0MDUifQ.XLxcBTNV5eNiTeTVqTVBEsBuHeD3yVdlVR4ug-asJb3y-DzDw3SQn14Lu1Vn4FFbYkED5s5G_9MS_KvERCrvs9-Vakm0tj5GDp8XNpkwCo6QVQYei4z5DFv6vMsV8NFK71cBVYkq3JfM2zF-r0Tc8tzE48QXmp80kJnaBbyuah-zkNYsQIuVZr7cPJ4j3ha8fbh_JbvjX6B6j0nz7W6fNdhEB2gfwiW2mX7lkhcmoPUHFYKFg2Us1FUjfrdzcpTb3BGT2ebCYJ72yvO0hMiW3ciNU03BJNCxcfli7xRCCLXY5GLdpBb_P-aLSYdK6hbJWZg2514O3X2saGkVh1ZjAg';
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
