import { Asset } from '@/types/assets';
import { Offer } from '@/types/offers';

export interface LandlordOffersAssets {
  id: number;
  offerId: number;
  assetId: number;
  offer?: Offer[];
  asset?: Asset[];
}
