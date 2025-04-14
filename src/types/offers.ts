export interface Offer {
  id: number;
  offerName: string;
  offerCategory: string;
  offerDescription?: string;
  offerRequirements: string;
  offerThumbnail?: string;
  offerDocuments?: string;
  needProof?: boolean;
  assetsList?: string[];
  offerReward: number;
  validFrom: number;
  validTo: number;
  createdAt: number;
  updatedAt: number;
}

export interface OfferFilters {
  keyword?: string;
}

export interface PaginationParams {
  offset: number;
  limit: number;
}

export interface SortParams {
  field: keyof Offer;
  direction: 'asc' | 'desc';
}

export interface OfferListParams extends PaginationParams {
  filters?: OfferFilters;
  sort?: SortParams;
}

export interface ResponseWrapper<T> {
  error_code: { code: number; message: string };
  response: T;
}
