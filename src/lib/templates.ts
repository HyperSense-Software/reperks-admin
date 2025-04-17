import { Offer } from '@/types/offers';

export const Templates: { name: string; values: Partial<Offer> }[] = [
  {
    name: 'Template 1',
    values: {
      offerName: 'Offer Name',
      offerReward: 34.56,
      needProof: true,
    },
  },
  {
    name: 'Template 2',
    values: {
      offerName: 'Offer Name 2',
      offerReward: 12,
      offerRequirements: 'Offer requirements',
      needProof: true,
    },
  },
];
