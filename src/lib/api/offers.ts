import { Offer, OfferFilters, OfferListParams } from '@/types/offers';
import axiosInstance from '@/instance/axiosInstance';
import { ResponseWrapper } from '@/types/assets';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getOffers = async (
  params: OfferListParams,
): Promise<ResponseWrapper<Offer[]>> => {
  const { offset, limit, filters, sort } = params;

  const response = await axiosInstance.get<ResponseWrapper<Offer[]>>(
    `${API_URL}/v1/landlord/offers`,
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

export const getOffersCount = async (params: {
  filters?: OfferFilters;
}): Promise<ResponseWrapper<number>> => {
  const { filters } = params;

  const response = await axiosInstance.get<ResponseWrapper<number>>(
    `${API_URL}/v1/landlord/offers/count`,
    {
      params: {
        ...filters,
      },
    },
  );

  return response.data;
};

export const getOfferById = async (id: number): Promise<Offer> => {
  const response = await axiosInstance.get<Offer>(
    `${API_URL}/v1/landlord/offers/${id}`,
  );
  return response.data;
};

export const createOffer = async (
  offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Offer> => {
  const response = await axiosInstance.post<Offer>(
    `${API_URL}/v1/landlord/offers`,
    offer,
  );
  return response.data;
};

export const updateOffer = async (
  id: number,
  offer: Partial<Offer>,
): Promise<Offer> => {
  // try {
  const response = await axiosInstance.put<Offer>(
    `${API_URL}/v1/landlord/offers/${id}`,
    offer,
  );
  return response.data;
};

export const deleteOffer = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/v1/landlord/offers/${id}`);
};
