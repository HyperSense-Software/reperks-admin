'use client';

import { useState, useEffect, useCallback } from 'react';
import { PlusIcon } from 'lucide-react';

import {
  Asset,
  AssetFilters,
  PaginationParams,
  SortParams,
} from '@/types/assets';
import { getAssets, getAssetsCount } from '@/lib/api/assets';
import AssetTable from './components/asset-table';
import AssetFiltersComponent from './components/asset-filters';
import AssetForm from './components/asset-form';
import { Button } from '@/components/ui/button';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<PaginationParams>({
    offset: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState<AssetFilters>({});
  const [sort, setSort] = useState<SortParams>({
    field: 'assetId',
    direction: 'asc',
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAssets({
        offset: pagination.offset,
        limit: pagination.limit,
        filters,
        sort,
      });

      const totalResponse = await getAssetsCount({
        filters,
      });

      setAssets(response.response);
      setTotal(totalResponse.response);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [pagination.offset, pagination.limit, filters, sort, fetchAssets]);

  const handlePageChange = (offset: number) => {
    setPagination((prev) => ({ ...prev, offset }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination({ offset: 0, limit });
  };

  const handleFilterChange = (newFilters: AssetFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, offset: 0 }));
  };

  const handleSortChange = (field: keyof Asset, direction: 'asc' | 'desc') => {
    setSort({ field, direction });
  };

  const handleAddClick = () => {
    setSelectedAsset(null);
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsAddDialogOpen(true);
  };

  const handleFormClose = (refetch: boolean = false) => {
    setIsAddDialogOpen(false);
    if (refetch) {
      fetchAssets();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assets</h1>
        <Button onClick={handleAddClick}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      </div>

      <AssetFiltersComponent
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <AssetTable
        assets={assets}
        isLoading={isLoading}
        pagination={pagination}
        total={total}
        sort={sort}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onEditClick={handleEditClick}
        onRefresh={fetchAssets}
      />

      {isAddDialogOpen && (
        <AssetForm
          open={isAddDialogOpen}
          asset={selectedAsset}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
