'use client';

import { useState, useEffect } from 'react';
import { PlusIcon } from 'lucide-react';

import {
  Offer,
  OfferFilters,
  PaginationParams,
  SortParams,
} from '@/types/offers';

import OfferTable from './components/offer-table';
import OfferFiltersComponent from './components/offer-filters';
import OfferForm from './components/offer-form';
import { Button } from '@/components/ui/button';
import { getOffers, getOffersCount } from '@/lib/api/offers';
import { useTranslations } from 'next-intl';

export default function OffersPage() {
  const t = useTranslations('dashboard.offers');

  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<PaginationParams>({
    offset: 0,
    limit: 2,
  });
  const [filters, setFilters] = useState<OfferFilters>({});
  const [sort, setSort] = useState<SortParams>({
    field: 'createdAt',
    direction: 'desc',
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const fetchOffers = async () => {
    setIsLoading(true);
    console.log(filters, 'fetch');
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
  };

  useEffect(() => {
    console.log(filters);
    fetchOffers();
  }, [pagination.offset, pagination.limit, filters, sort]);

  const handlePageChange = (offset: number) => {
    setPagination((prev) => ({ ...prev, offset }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination({ offset: 0, limit });
  };

  const handleFilterChange = (newFilters: OfferFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, offset: 0 }));
  };

  const handleSortChange = (field: keyof Offer, direction: 'asc' | 'desc') => {
    setSort({ field, direction });
  };

  const handleAddClick = () => {
    setSelectedOffer(null);
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsAddDialogOpen(true);
  };

  const handleFormClose = (refetch: boolean = false) => {
    setIsAddDialogOpen(false);
    if (refetch) {
      fetchOffers();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button onClick={handleAddClick}>
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
        onEditClick={handleEditClick}
        onRefresh={fetchOffers}
      />

      {isAddDialogOpen && (
        <OfferForm
          open={isAddDialogOpen}
          offer={selectedOffer}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
