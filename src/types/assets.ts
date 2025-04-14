export interface Asset {
  id: string;
  assetId: string;
  address: string;
  unitId: string;
  unitDescription: string;
  apartmentNo: string;
  postalCode: string;
  tenantName: string;
  tenantEmail: string;
  tenantID: number;
  createdAt: number;
  updatedAt: number;
}

export interface AssetFilters {
  keyword?: string;
}

export interface PaginationParams {
  offset: number;
  limit: number;
}

export interface SortParams {
  field: keyof Asset;
  direction: 'asc' | 'desc';
}

export interface AssetListParams extends PaginationParams {
  filters?: AssetFilters;
  sort?: SortParams;
}

export interface ResponseWrapper<T> {
  error_code: { code: number; message: string };
  response: T;
}
