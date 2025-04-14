import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Asset, PaginationParams, SortParams } from '@/types/assets';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import { deleteAsset } from '@/lib/api/assets';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Pagination from '@/components/pagination/pagination.view';

interface AssetTableProps {
  assets: Asset[];
  isLoading: boolean;
  pagination: PaginationParams;
  total: number;
  sort: SortParams;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortChange: (field: keyof Asset, direction: 'asc' | 'desc') => void;
  onEditClick: (asset: Asset) => void;
  onRefresh: () => void;
}

export default function AssetTable({
  assets,
  isLoading,
  pagination,
  total,
  sort,
  onPageChange,
  onLimitChange,
  onSortChange,
  onEditClick,
  onRefresh,
}: AssetTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

  const handleSort = (field: keyof Asset) => {
    const direction =
      sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange(field, direction);
  };

  const handleDeleteClick = (asset: Asset) => {
    setAssetToDelete(asset);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assetToDelete) return;

    try {
      await deleteAsset(assetToDelete.id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete asset:', error);
    } finally {
      setDeleteDialogOpen(false);
      setAssetToDelete(null);
    }
  };

  const renderSortIndicator = (field: keyof Asset) => {
    return (
      <ArrowUpDown
        className={`ml-2 h-4 w-4 ${sort.field === field ? 'opacity-100' : 'opacity-50'}`}
      />
    );
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('assetId')}
              >
                <div className={'flex'}>
                  Asset ID {renderSortIndicator('assetId')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('address')}
              >
                <div className={'flex'}>
                  Address {renderSortIndicator('address')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('unitId')}
              >
                <div className={'flex'}>
                  Unit ID {renderSortIndicator('unitId')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('unitDescription')}
              >
                <div className={'flex'}>
                  Unit Description {renderSortIndicator('unitDescription')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('apartmentNo')}
              >
                <div className={'flex'}>
                  Apartment # {renderSortIndicator('apartmentNo')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('tenantName')}
              >
                <div className={'flex'}>
                  Tenant {renderSortIndicator('tenantName')}
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  No assets found
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.assetId}</TableCell>
                  <TableCell>{asset.address}</TableCell>
                  <TableCell>{asset.unitId}</TableCell>
                  <TableCell>{asset.unitDescription}</TableCell>
                  <TableCell>{asset.apartmentNo}</TableCell>
                  <TableCell>{asset.tenantName}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditClick(asset)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(asset)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        totalItems={total}
        itemsPerPage={pagination.limit}
        currentPage={Math.ceil(pagination.offset / pagination.limit) + 1}
        handlePageChange={(offset) => {
          console.log(offset);
          onPageChange(offset);
          // dispatch(setPortfolioFilterOffset(offset));
        }}
        handlePageSizeChange={(value) => {
          console.log(value);

          onLimitChange(value);
          // dispatch(setPortfolioFilterLimit(value));
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              asset and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
