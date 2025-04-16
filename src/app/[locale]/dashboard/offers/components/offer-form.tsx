import { useState } from 'react';
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
} from './offer-form-schema';
import { format } from 'date-fns';
import OfferFormStep1 from '@/app/[locale]/dashboard/offers/components/offer-form-step1';
import OfferFormStep2 from '@/app/[locale]/dashboard/offers/components/offer-form-step2';
import { formatDate } from '@/utils/utils';
import { DateRange } from 'react-day-picker';

interface OfferFormProps {
  open: boolean;
  offer: Offer | null;
  onClose: (refetch?: boolean) => void;
}

export default function OfferForm({ open, offer, onClose }: OfferFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        assetsList: offer?.assetsList || [],
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
    let currentStep = stepNo + 1;
    if (type === 'prev') {
      currentStep = stepNo >= 1 ? stepNo - 1 : stepNo;
    }
    if (currentStep !== stepNo) setStepNo(currentStep);
  };

  const onSubmit = async (values: OfferFormValues) => {
    setIsSubmitting(true);

    try {
      const updatedValues = {
        ...values.step1,
        ...values.step3,
        validFrom: 0,
        validTo: 0,
        offerReward: parseFloat(values.step1.offerReward),
        offerRequirements: values.step2.offerRequirements || '',
        offerDocuments: values.step2.offerDocuments || '',
        needProof: values.step2.needProof || false,
      };

      if (date?.from && date?.to) {
        updatedValues.validFrom = Math.floor(date.from.getTime() / 1000);
        updatedValues.validTo = Math.floor(date.to.getTime() / 1000);
      } else {
        toast.error('Please select the date range');
        return;
      }

      const temp = parseFloat(values.step1.offerReward);
      console.log(temp);
      if (isNaN(temp)) {
        toast.error('Offer reward must be a number');
      }
      updatedValues.offerReward = temp;

      if (isEditing && offer) {
        await updateOffer(offer.id, updatedValues);
        toast.success('Offer updated successfully');
      } else {
        await createOffer(updatedValues);
        toast.success('Offer created successfully');
      }

      onClose(true);
    } catch (error) {
      console.error('Failed to save offer:', error);
      toast.error(
        `Failed to ${isEditing ? 'update' : 'create'} offer. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
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
          </DialogTitle>
          <DialogDescription className="text-foreground-muted justify-start self-stretch text-sm leading-tight font-normal">
            Please fill in the form in order to create your offer.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {stepNo === 0 && <OfferFormStep1 form={form} />}
            {stepNo === 1 && (
              <OfferFormStep2 form={form} date={date} setRange={setRange} />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => changeStep('prev')}
                disabled={isSubmitting}
              >
                Previous
              </Button>
              {stepNo}
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
