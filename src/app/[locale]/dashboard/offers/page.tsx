'use client';

import { useState } from 'react';

import { Offer } from '@/types/offers';

import OffersGrid from '@/app/[locale]/dashboard/offers/components/list/offers-grid';
import OfferForm from '@/app/[locale]/dashboard/offers/components/edit/offer-form';

export default function OffersPage() {
  //1=open, 0=close, -1=close+refetch
  const [dialogOpenStatus, setDialogOpenStatus] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const openForm = (id: number) => {
    console.log('openForm', id);
  };

  return (
    <div className="container mx-auto py-8">
      <OffersGrid
        openForm={openForm}
        setSelectedOffer={setSelectedOffer}
        dialogOpenStatus={dialogOpenStatus}
        setDialogOpenStatus={setDialogOpenStatus}
      />
      {dialogOpenStatus}
      {dialogOpenStatus == 1 && (
        <OfferForm
          offer={selectedOffer}
          onClose={(status = 0) => setDialogOpenStatus(status)}
        />
      )}
    </div>
  );
}
