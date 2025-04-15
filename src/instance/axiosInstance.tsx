import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      const token = session?.tokens?.accessToken.toString();
      // const token =
      //   'eyJraWQiOiJrQTdlbDZRRjFtdjFrUlBVSWY5Z3lZRWRCTG15dGRzajNFOGE1dVBkVUNZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5M2Q0MTg5Mi1jMDExLTcwMjAtNzZjNS0wMjAwY2RjOTc0MDUiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbiIsImxhbmRsb3JkIiwic3VwZXJfYWRtaW4iLCJ0ZW5hbnQiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfVFRFY2M3SEtNIiwiY2xpZW50X2lkIjoiNWVtZ3J1ZGo2Zzg5Zms4dmZrYzFqMHZvNHQiLCJvcmlnaW5fanRpIjoiMzg1YmQxYzktZDVlYS00YWM5LTk3YzAtM2ViM2ZlMmUyOWRkIiwiZXZlbnRfaWQiOiI0ZjcxODA1Ny04MThiLTRmMmYtOGM4OS02ZmY3OTllM2FiNmEiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzQ0NzI1ODU5LCJleHAiOjE3NDQ3Mjk0NTksImlhdCI6MTc0NDcyNTg1OSwianRpIjoiNmM3ZGQ0ZDQtNzMxNi00MTI0LTlhYzEtZWE3ZmE2MTg5NjQ1IiwidXNlcm5hbWUiOiI5M2Q0MTg5Mi1jMDExLTcwMjAtNzZjNS0wMjAwY2RjOTc0MDUifQ.eKZhsPph5zqlKI_-BM-PiBs1w2u-PcEV14m6dRElRRPapOsyxcaxbPCohY6fdoi0GBglqG2LgUMLgaZyk9RVA1VhlVGCiqNuwM0iwI9svFmoiaACuykH8jAGoEtSBb05ZD7IMSnSQzFb-ezSvnalSn-pI7Fk4Vz7-YuZY3p-461m2x7k1GEpPtbELG3XBQLVMTuh4o3x9ipX9R71LBeEckBH7A0L9ckPp-HHDJBsIeNOk0hXfK47n2STVNAr7-aS583tVXOi5aYqP6kbx8w4FaZ0-7_7Igq-_HnYS-xwbPWDmTE3GX7mbSyJqw7WXs9TwAzJNx6Jhi5GEQ9EWCDb4A';
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
