import axios, { AxiosProgressEvent, AxiosResponse } from 'axios';
import {
  Portfolio,
  PortfolioIdParam,
  // PortfolioParams,
  PreAsignedUrlParam,
  PreAsignedUrlResponse,
} from '@/interfaces/Portfolio';
import { PortfolioSearchInterface } from '@/constants/portfolio.constants';
import { Response } from '@/interfaces/APIResponse';
import axiosInstance from '@/instance/axiosInstance';

export const getPortfolioFromAPI = async (
  params: PortfolioSearchInterface,
): Promise<Portfolio | unknown> => {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('Missing API_BASE_URL');
  }

  const baseAPIPath = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiPath = baseAPIPath + `/admin/portfolios/${params.id}`;
  try {
    const response: AxiosResponse<Response<Portfolio>> = await axiosInstance.get(apiPath, {
      params: params,
    });

    if (response.data.error_code.code === 0 && response.data.error_code.message === 'Success') {
      return response.data.response;
    }

    return null;
  } catch (err: unknown) {
    console.log('Error - getPortfolioFromAPI: ', err);
    return err;
  }
};

export const adminCreatePortfolioFromAPI = async (
  params: Partial<Portfolio>,
): Promise<Portfolio | unknown> => {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('Missing API_BASE_URL');
  }

  const baseAPIPath = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiPath = baseAPIPath + '/admin/portfolios';
  try {
    const response: AxiosResponse<Response<Portfolio>> = await axiosInstance.post(apiPath, {
      ...params,
    });

    if (response.data.error_code.code === 0 && response.data.error_code.message === 'Success') {
      return response.data.response;
    }

    return null;
  } catch (err: unknown) {
    console.log('Error - getPortfolioFromAPI: ', err);
    return err;
  }
};

export const adminUpdatePortfolioFromAPI = async (
  params: Partial<Portfolio>,
): Promise<Portfolio | unknown> => {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('Missing API_BASE_URL');
  }

  const baseAPIPath = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiPath = baseAPIPath + `/admin/portfolios/${params.id}`;
  try {
    const response: AxiosResponse<Response<Portfolio>> = await axiosInstance.put(apiPath, {
      ...params,
    });

    if (response.data.error_code.code === 0 && response.data.error_code.message === 'Success') {
      return response.data.response;
    }

    return null;
  } catch (err: unknown) {
    console.log('Error - getPortfolioFromAPI: ', err);
    return err;
  }
};

export const adminDeletePortfolioByIdFromAPI = async (
  params: PortfolioIdParam,
): Promise<string | unknown> => {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('Missing API_BASE_URL');
  }

  const baseAPIPath = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiPath = baseAPIPath + `/admin/portfolios/${params.id}`;
  try {
    const response: AxiosResponse<Response<string>> = await axiosInstance.delete(apiPath, {
      data: {
        ...params,
      },
    });

    if (response.data.error_code.code === 0 && response.data.error_code.message === 'Success') {
      return response.data.response;
    }

    return null;
  } catch (err: unknown) {
    console.log('Error - adminDeletePortfolioByIdFromAPI: ', err);
    return err;
  }
};

export const preSignedUrl = async (
  params: PreAsignedUrlParam,
): Promise<PreAsignedUrlResponse | unknown> => {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('Missing API_BASE_URL');
  }

  const baseAPIPath = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiPath = baseAPIPath + '/s3/presignedURL';
  try {
    const data = {
      key: params.key,
      type: params.type,
      size: params.size,
    };
    const response: AxiosResponse<Response<PreAsignedUrlResponse>> = await axiosInstance.post(
      apiPath,
      {
        ...data,
      },
    );

    if (response.data.error_code.code === 0 && response.data.error_code.message === 'Success') {
      const s3Response = response.data.response;
      const uploadUrl = s3Response.url;
      const fields = s3Response.fields;
      const file = params.file;
      await uploadToS3({ uploadUrl, file, fields });
      return response.data.response;
    }

    return null;
  } catch (err: unknown) {
    console.log('Error - preSignedUrl: ', err);
    return err;
  }
};

// export const uploadFileAWSS3 = (fileuploadurl: any, file: any) => {
//   return new Promise<unknown>((resolve) => {
//     const httpOptions = {
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Content-Type': file.type,
//         Accept: 'application/json, text/plain, */*',
//       },
//     };
//     axiosInstance
//       .put(fileuploadurl, file, httpOptions)
//       .then((response) => {
//         resolve(response);
//       })
//       .catch((err) => {
//         console.log('Error - uploadFileAWSS3: ', err);
//       });
//   });
// };

export const uploadToS3 = async ({
  uploadUrl,
  file,
  fields = {},
  onProgressChange = () => {},
}: {
  uploadUrl: string;
  file: File;
  fields?: Record<string, string>;
  onProgressChange?: (progress: number) => void;
}) => {
  const formData = new FormData();

  Object.keys(fields).forEach((key) => {
    formData.append(key, fields[key]);
  });
  formData.append('Content-Type', file.type);
  formData.append('file', file, file?.name);

  const parseProgress = (progressEvent: AxiosProgressEvent) => {
    let progressPercentage;
    if (progressEvent.total) {
      progressPercentage = (progressEvent.loaded / progressEvent?.total) * 100;
    } else {
      progressPercentage = progressEvent.loaded * 100;
    }

    onProgressChange(progressPercentage);
  };

  try {
    const httpOptions = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': file.type,
        Accept: 'application/json, text/plain, */*',
      },
    };
    const res = await axios.post(uploadUrl, formData, {
      onUploadProgress: parseProgress,
      ...httpOptions,
    });
    console.log('res', res);
    return res.status === 204;
  } catch (error) {
    return error;
  }
};
