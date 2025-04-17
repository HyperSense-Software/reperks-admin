import { z } from 'zod';
import { ContractTypes } from '@/types/contracts';

export const ContractTypesValues = Object.values(ContractTypes).map((item) =>
  item.toString(),
);

export const offerFormSchema = z.object({
  step1: z.object({
    offerName: z.string().min(1, 'Offer name is required'),
    offerCategory: z
      .string({
        required_error: 'Offer category is required',
      })
      .refine((value) => ContractTypesValues.includes(value), {
        message: 'Invalid offer category',
      }),
    offerReward: z
      .string({
        required_error: 'Offer reward is required',
      })
      .refine(
        (value) => {
          if (!value) return false;

          return value.match(/^\d+(\.\d+)?$/);
        },
        { message: 'Offer reward must be a positive number' },
      ),
    offerDescription: z.string().min(1, 'Offer description is required'),
    offerThumbnail: z.string().optional(),
    storageFolder: z.string().optional(),
  }),
  step2: z.object({
    // validFrom: z.number().min(1, 'Valid from date is required'),
    validRange: z.string().min(10, 'Valid range is required'),
    offerRequirements: z.string().optional(),
    offerDocuments: z.string().optional(),
    needProof: z.boolean(),
  }),
  step3: z.object({
    assetsList: z.array(z.number()).optional(),
    askPermission: z.boolean(),
  }),
});
export type OfferFormValues = z.infer<typeof offerFormSchema>;

export const fieldsOffer = [
  [
    'step1.offerName',
    'step1.offerCategory',
    'step1.offerReward',
    'step1.offerDescription',
    'step1.offerThumbnail',
    'step1.storageFolder',
  ],
  [
    'step2.validRange',
    'step2.offerRequirements',
    'step2.offerDocuments',
    'step2.needProof',
  ],
  ['step3.assetsList', 'step3.askPermission'],
];
export type OfferFieldsName =
  | 'step1.offerName'
  | 'step1.offerCategory'
  | 'step1.offerReward'
  | 'step1.offerDescription'
  | 'step1.offerThumbnail'
  | 'step1.storageFolder'
  | 'step2.validRange'
  | 'step2.offerRequirements'
  | 'step2.offerDocuments'
  | 'step3.askPermission'
  | 'step2.needProof';
