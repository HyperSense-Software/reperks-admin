import { PaginationParams, SortParams } from '@/types/assets';
import { LandlordOffersAssets } from '@/types/landlord-offers-assets';

export interface Offer {
  id: number;
  offerName: string;
  offerCategory: string;
  offerDescription?: string;
  offerRequirements: string;
  offerThumbnail?: string;
  offerDocuments?: string;
  needProof?: boolean;
  assetsList?: number[];
  offerReward: number;
  validFrom: number;
  validTo: number;
  createdAt: number;
  updatedAt: number;
  assets?: LandlordOffersAssets[];
}

export interface OfferFilters {
  keyword?: string;
}

export interface OfferListParams extends PaginationParams {
  filters?: OfferFilters;
  sort?: SortParams;
}
