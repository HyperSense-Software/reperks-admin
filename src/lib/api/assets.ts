import {
  Asset,
  AssetFilters,
  AssetListParams,
  ResponseWrapper,
} from '@/types/assets';
import axiosInstance from '@/instance/axiosInstance';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const getAssets = async (
  params: AssetListParams,
): Promise<ResponseWrapper<Asset[]>> => {
  const { offset, limit, filters, sort } = params;

  const response = await axiosInstance.get<ResponseWrapper<Asset[]>>(
    `${API_URL}/v1/landlord/assets`,
    {
      params: {
        offset,
        limit,
        ...filters,
        order: `${sort?.field} ${sort?.direction}`,
      },
    },
  );

  return response.data;
};

export const getAssetsCount = async (params: {
  filters?: AssetFilters;
}): Promise<ResponseWrapper<number>> => {
  const { filters } = params;

  const response = await axiosInstance.get<ResponseWrapper<number>>(
    `${API_URL}/v1/landlord/assets/count`,
    {
      params: {
        ...filters,
      },
    },
  );

  return response.data;
};

export const getAssetById = async (id: string): Promise<Asset> => {
  const response = await axiosInstance.get<Asset>(
    `${API_URL}/v1/landlord/assets/${id}`,
  );
  return response.data;
};

export const createAsset = async (
  asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt' | 'tenantID'>,
): Promise<Asset> => {
  const response = await axiosInstance.post<Asset>(
    `${API_URL}/v1/landlord/assets`,
    asset,
  );
  return response.data;
};

export const updateAsset = async (
  id: string,
  asset: Partial<Asset>,
): Promise<Asset> => {
  const response = await axiosInstance.put<Asset>(
    `${API_URL}/v1/landlord/assets/${id}`,
    asset,
  );
  return response.data;
};

export const deleteAsset = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/v1/landlord/assets/${id}`);
};
