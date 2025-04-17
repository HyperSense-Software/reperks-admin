import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Offer } from '@/types/offers';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createOffer, updateOffer } from '@/lib/api/offers';
import { cn } from '@udecode/cn';

import {
  fieldsOffer,
  OfferFieldsName,
  offerFormSchema,
  OfferFormValues,
} from './form/offer-form-schema';
import { format } from 'date-fns';
import OfferFormStep1 from './form/offer-form-step1';
import OfferFormStep2 from './form/offer-form-step2';
import { formatDate } from '@/utils/utils';
import { DateRange } from 'react-day-picker';
import { Asset, toastError } from '@/types/assets';
import OfferFormStep3 from './form/offer-form-step3';
import { getAssets } from '@/lib/api/assets';

interface OfferFormProps {
  offer: Offer | null;
  onClose: (status?: number) => void;
}

export default function OfferForm({ offer, onClose }: OfferFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stepNo, setStepNo] = useState(0);
  const isEditing = !!offer;

  const validFrom = offer?.validFrom
    ? format(new Date(offer.validFrom * 1000), formatDate)
    : '';
  const validTo = offer?.validTo
    ? format(new Date(offer.validTo * 1000), formatDate)
    : '';
  const startRange = offer
    ? {
        from: new Date(offer.validFrom * 1000),
        to: new Date(offer.validTo * 1000),
      }
    : undefined;

  const [date, setDate] = useState<DateRange | undefined>(startRange);

  const setRange = (range: DateRange | undefined) => {
    if (!range) return;
    setDate(range);
    if (range.to && range.from) {
      const validFrom = range?.from ? format(range.from, formatDate) : '';
      const validTo = range?.to ? format(range.to, formatDate) : '';
      const validRange = validFrom ? `${validFrom} - ${validTo}` : '';
      form.setValue('step2.validRange', validRange);
      form.trigger('step2.validRange');
    }
  };

  const defaultAssets = offer?.assets?.map((item) => item.assetId) || [];

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      step1: {
        offerName: offer?.offerName || '',
        offerReward: offer?.offerReward.toString() || '',
        offerDescription: offer?.offerDescription || '',
        offerThumbnail: offer?.offerThumbnail || '',
        offerCategory: offer?.offerCategory || '',
      },
      step2: {
        validRange: validFrom ? `${validFrom} - ${validTo}` : '',
        offerRequirements: offer?.offerRequirements || '',
        offerDocuments: offer?.offerDocuments || '',
        needProof: offer?.needProof || false,
      },
      step3: {
        assetsList: defaultAssets,
      },
    },
    mode: 'all',
  });

  const changeStep = async (type = 'next') => {
    if (![0, 1, 2].includes(stepNo)) return;
    const fieldsToValidate = fieldsOffer[stepNo];
    if ([0, 1].includes(stepNo)) {
      const output = await form.trigger(fieldsToValidate as OfferFieldsName[], {
        shouldFocus: true,
      });
      if (!output) return;
    }
    const currentStep =
      type === 'prev' ? (stepNo >= 1 ? stepNo - 1 : stepNo) : stepNo + 1;
    if (currentStep !== stepNo) setStepNo(currentStep);
  };

  const onSubmit = async (values: Partial<OfferFormValues>) => {
    setIsSubmitting(true);

    try {
      if (
        !values.step1?.offerName ||
        !values.step1?.offerCategory ||
        !values.step1?.offerReward ||
        values.step1?.offerReward === '0'
      ) {
        toast.error('Offer is incompleted');
        return;
      }

      const offerRewardValue = parseFloat(values.step1.offerReward);
      if (isNaN(offerRewardValue)) {
        toast.error('Offer reward must be a number');
      }

      const updatedValues = {
        ...values.step1,
        validFrom: 0,
        validTo: 0,
        offerReward: offerRewardValue,
        offerRequirements: values.step2?.offerRequirements || '',
        offerDocuments: values.step2?.offerDocuments || '',
        needProof: values.step2?.needProof || false,
        assetsList: values.step3?.assetsList || [],
      };

      if (date?.from && date?.to) {
        updatedValues.validFrom = Math.floor(date.from.getTime() / 1000);
        updatedValues.validTo = Math.floor(date.to.getTime() / 1000);
      } else {
        toast.error('Please select the date range');
        return;
      }

      if (isEditing && offer) {
        await updateOffer(offer.id, updatedValues);
        toast.success('Offer updated successfully');
      } else {
        await createOffer(updatedValues);
        toast.success('Offer created successfully');
      }

      onClose(-1);
    } catch (error) {
      toastError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchAssets = useCallback(async () => {
    try {
      const response = await getAssets({
        offset: 0,
        limit: 1000,
        sort: {
          field: 'createdAt',
          direction: 'desc',
        },
      });
      setAssets(response.response);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    } finally {
    }
  }, []);
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose(0)}>
      <DialogContent className="top-[60px] translate-y-0 sm:max-w-[500px]">
        <DialogHeader>
          <div>
            <div className="inline-flex h-5 items-center justify-start gap-0.5 self-stretch py-2">
              <button
                className={cn(
                  'relative h-1.5 w-4 rounded-[100px]',
                  stepNo === 0 ? 'bg-zinc-950' : 'bg-gray-200',
                )}
              />
              <button
                className={cn(
                  'relative h-1.5 w-4 rounded-[100px]',
                  stepNo === 1 ? 'bg-zinc-950' : 'bg-gray-200',
                )}
              />
              <button
                className={cn(
                  'relative h-1.5 w-4 rounded-[100px]',
                  stepNo === 2 ? 'bg-zinc-950' : 'bg-gray-200',
                )}
              />
            </div>
          </div>
          <DialogTitle>
            {isEditing ? 'Edit Offer' : 'Create new offer'}
            {stepNo === 2 ? '- Assign assets' : ''}
          </DialogTitle>
          <DialogDescription className="text-foreground-muted justify-start self-stretch text-sm leading-tight font-normal">
            {stepNo === 2
              ? 'Double check if the information suits you needs and select your recipients.'
              : '' + 'Please fill in the form in order to create your offer.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {stepNo === 0 && <OfferFormStep1 form={form} />}
            {stepNo === 1 && (
              <OfferFormStep2 form={form} date={date} setRange={setRange} />
            )}
            {stepNo === 2 && <OfferFormStep3 assets={assets} form={form} />}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => changeStep('prev')}
                disabled={isSubmitting}
              >
                Previous
              </Button>

              <Button
                className={stepNo === 2 ? 'hidden' : ''}
                type="button"
                onClick={() => changeStep()}
                disabled={isSubmitting}
              >
                Next
              </Button>
              <Button
                className={stepNo === 2 ? '' : 'hidden'}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : isEditing
                    ? 'Update offer'
                    : 'Create offer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
