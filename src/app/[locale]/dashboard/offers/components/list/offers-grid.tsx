'use client';

import { useState, useEffect, useCallback } from 'react';
import { PlusIcon } from 'lucide-react';
import { Offer, OfferFilters } from '@/types/offers';
import OfferTable from './offer-table';
import OfferFiltersComponent from './offer-filters';
import { Button } from '@/components/ui/button';
import { getOffers, getOffersCount } from '@/lib/api/offers';
import { useTranslations } from 'next-intl';
import { PerPage } from '@/utils/utils';
import { PaginationParams, SortParams } from '@/types/assets';

interface OffersGridProps {
  openForm: (id: number) => void;
  dialogOpenStatus: number;
  setDialogOpenStatus: (status: number) => void;
  setSelectedOffer: (offer: Offer | null) => void;
}

export default function OffersGrid({
  setSelectedOffer,
  dialogOpenStatus,
  setDialogOpenStatus,
}: OffersGridProps) {
  const t = useTranslations('dashboard.offers');

  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<PaginationParams>({
    offset: 0,
    limit: PerPage,
  });
  const [filters, setFilters] = useState<OfferFilters>({});
  const [sort, setSort] = useState<SortParams>({
    field: 'createdAt',
    direction: 'desc',
  });

  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getOffers({
        offset: pagination.offset,
        limit: pagination.limit,
        filters,
        sort,
      });

      const totalResponse = await getOffersCount({
        filters,
      });

      setOffers(response.response);
      setTotal(totalResponse.response);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, pagination.limit, pagination.offset]);
  useEffect(() => {
    fetchOffers();
  }, [pagination.offset, pagination.limit, filters, sort, fetchOffers]);

  const handlePageChange = (offset: number) => {
    setPagination((prev) => ({ ...prev, offset }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination({ offset: 0, limit });
  };

  const handleFilterChange = useCallback((newFilters: OfferFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, offset: 0 }));
  }, []);

  const handleSortChange = (field: keyof Offer, direction: 'asc' | 'desc') => {
    setSort({ field, direction });
  };

  const openOfferForm = (offer: Offer | null) => {
    setSelectedOffer(offer);
    setDialogOpenStatus(1);
  };

  return (
    <>
      <div className="mb-6 grid grid-cols-2 items-center justify-between">
        <h1 className="text-2xl font-bold"> {t('title')}</h1>
        <Button onClick={() => openOfferForm(null)} className={'ml-auto w-fit'}>
          <PlusIcon className="mr-2 h-4 w-4" />
          {t('table.add.label')}
        </Button>
      </div>

      <OfferFiltersComponent
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <OfferTable
        offers={offers}
        isLoading={isLoading}
        pagination={pagination}
        total={total}
        sort={sort}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onEditClick={openOfferForm}
        onRefresh={fetchOffers}
      />
    </>
  );
}
