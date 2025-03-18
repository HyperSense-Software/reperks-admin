import axios, { AxiosProgressEvent, AxiosResponse } from 'axios';

import { Response } from '@/interfaces/APIResponse';
import axiosInstance from '@/instance/axiosInstance';

export interface PresignedUrlParam {
  key: string;
  type: string;
  size: number;
  file: File;
}

export interface PresignedUrlResponse {
  url: string;
  fields: {
    key: string;
  };
}

export const preSignedUrl = async (
  params: PresignedUrlParam,
): Promise<PresignedUrlResponse | unknown> => {
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
    const response: AxiosResponse<Response<PresignedUrlResponse>> =
      await axiosInstance.post(apiPath, {
        ...data,
      });

    if (
      response.data.error_code.code === 0 &&
      response.data.error_code.message === 'Success'
    ) {
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
