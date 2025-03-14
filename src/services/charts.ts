import { AxiosResponse } from 'axios';
import { Response } from '@/interfaces/APIResponse';
import axiosInstance from '@/instance/axiosInstance';
import { BarChartParams, BarChartProps, PieChartProps } from '@/interfaces/charts/charts';

export const adminGetPieChartData = async (): Promise<PieChartProps[] | unknown> => {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('Missing API_BASE_URL');
  }

  const baseAPIPath = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiPath = baseAPIPath + '/admin/charts/getPieChartData';
  try {
    const response: AxiosResponse<Response<Partial<PieChartProps[]>>> =
      await axiosInstance.get(apiPath);

    if (response.data.error_code.code === 0 && response.data.error_code.message === 'Success') {
      return response.data.response;
    }

    return null;
  } catch (err: unknown) {
    console.log('Error - adminGetPieChartData: ', err);
    return err;
  }
};

export const adminGetBarChartYears = async (): Promise<string[] | unknown> => {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('Missing API_BASE_URL');
  }

  const baseAPIPath = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiPath = baseAPIPath + '/admin/charts/getBarChartYears';
  try {
    const response: AxiosResponse<Response<string[]>> = await axiosInstance.get(apiPath);

    if (response.data.error_code.code === 0 && response.data.error_code.message === 'Success') {
      return response.data.response;
    }

    return null;
  } catch (err: unknown) {
    console.log('Error - adminGetBarChartYears: ', err);
    return err;
  }
};

export const adminGetBarChartData = async (
  params: BarChartParams,
): Promise<BarChartProps[] | unknown> => {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('Missing API_BASE_URL');
  }

  const baseAPIPath = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiPath = baseAPIPath + '/admin/charts/getBarChartData';
  try {
    const response: AxiosResponse<Response<Partial<BarChartProps>>> = await axiosInstance.get(
      apiPath,
      {
        params: params,
      },
    );

    if (response.data.error_code.code === 0 && response.data.error_code.message === 'Success') {
      return response.data.response;
    }

    return null;
  } catch (err: unknown) {
    console.log('Error - adminGetBarChartData: ', err);
    return err;
  }
};
