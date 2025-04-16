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
import { Offer, PaginationParams, SortParams } from '@/types/offers';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';

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
import { deleteOffer } from '@/lib/api/offers';
import { useTranslations } from 'next-intl';

interface OfferTableProps {
  offers: Offer[];
  isLoading: boolean;
  pagination: PaginationParams;
  total: number;
  sort: SortParams;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortChange: (field: keyof Offer, direction: 'asc' | 'desc') => void;
  onEditClick: (offer: Offer) => void;
  onRefresh: () => void;
}

export default function OfferTable({
  offers = [],
  isLoading,
  pagination,
  total,
  sort,
  onPageChange,
  onLimitChange,
  onSortChange,
  onEditClick,
  onRefresh,
}: OfferTableProps) {
  const t = useTranslations('dashboard.offers.table');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);

  const setID = (id: number) => {
    return id.toString().padStart(5, '0');
  };

  const setValidInterval = (item: Offer) => {
    const startDate = new Date(item.validFrom * 1000);
    const day = startDate.getDate();
    const month = startDate.getMonth() + 1; // Months are zero-based
    const year = startDate.getFullYear();

    const endDate = new Date(item.validTo * 1000);
    const day2 = endDate.getDate();
    const month2 = endDate.getMonth() + 1; // Months are zero-based
    const year2 = endDate.getFullYear();
    return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year} - 
    ${day2.toString().padStart(2, '0')}.${month2.toString().padStart(2, '0')}.${year2}`;
  };
  const handleSort = (field: keyof Offer) => {
    const direction =
      sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange(field, direction);
  };

  const handleDeleteClick = (offer: Offer) => {
    setOfferToDelete(offer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!offerToDelete) return;

    try {
      await deleteOffer(offerToDelete.id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete offer:', error);
    } finally {
      setDeleteDialogOpen(false);
      setOfferToDelete(null);
    }
  };

  const renderSortIndicator = (field: keyof Offer) => {
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
                onClick={() => handleSort('id')}
              >
                <div className={'flex'}>ID {renderSortIndicator('id')}</div>
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('offerName')}
              >
                <div className={'flex'}>
                  {t('fields.name')} {renderSortIndicator('offerName')}
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('offerCategory')}
              >
                <div className={'flex'}>
                  {t('fields.category')} {renderSortIndicator('offerCategory')}
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('offerReward')}
              >
                <div className={'flex'}>
                  {t('fields.reward')} {renderSortIndicator('offerReward')}
                </div>
              </TableHead>

              <TableHead>
                <div className={'flex'}>{t('fields.valid')}</div>
              </TableHead>

              <TableHead>{t('fields.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : offers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  No offers found
                </TableCell>
              </TableRow>
            ) : (
              offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>{setID(offer.id)}</TableCell>
                  <TableCell>{offer.offerName}</TableCell>
                  <TableCell>{offer.offerCategory}</TableCell>
                  <TableCell>{offer.offerReward}</TableCell>
                  <TableCell>{setValidInterval(offer)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditClick(offer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(offer)}
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
            <AlertDialogTitle>{t('delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              {t('delete.label')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
