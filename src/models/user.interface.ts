import { Nullable } from '@udecode/utils';

export interface IUser {
  id: number;
  cognitoId: string;
  email: string;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  companyName: Nullable<string>;
  userGroup: string;
  userStatus: string;
  lang: 'en' | 'de';
  land: Nullable<string>;
  city: Nullable<string>;
  address: Nullable<string>;
  postalCode: Nullable<string>;
  houseHolderSize: Nullable<string>;
  profileCompleted: 0;
  billingInformation: Nullable<{
    address: string;
    iban: string;
    bic: string;
  }>;
  createdAt: number;
  updatedAt: number;
}
