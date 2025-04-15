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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createOffer, updateOffer } from '@/lib/api/offers';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@udecode/cn';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon } from 'lucide-react';
import {
  ContractTypesValues,
  fieldsOffer,
  OfferFieldsName,
  offerFormSchema,
  OfferFormValues,
} from './offer-form-schema';
import { DateRange } from 'react-day-picker';

interface OfferFormProps {
  open: boolean;
  offer: Offer | null;
  onClose: (refetch?: boolean) => void;
}

const formatDate = 'dd.MM.yyyy';
export default function OfferForm({ open, offer, onClose }: OfferFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepNo, setStepNo] = useState(0);
  const [date, setDate] = useState<DateRange | undefined>();
  const isEditing = !!offer;

  const validFrom = offer?.validFrom
    ? format(new Date(offer.validFrom * 1000), formatDate)
    : '';
  const validTo = offer?.validTo
    ? format(new Date(offer.validTo * 1000), formatDate)
    : '';

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

  const prevStep = async () => {
    if (![0, 1, 2].includes(stepNo)) return;
    const fieldsToValidate = fieldsOffer[stepNo];
    if ([0, 1].includes(stepNo)) {
      const output = await form.trigger(fieldsToValidate as OfferFieldsName[], {
        shouldFocus: true,
      });
      if (!output) return;
    }

    const currentStep = stepNo >= 1 ? stepNo - 1 : stepNo;
    if (currentStep !== stepNo) setStepNo(currentStep);
  };

  const nextStep = async () => {
    if (![0, 1, 2].includes(stepNo)) return;
    const fieldsToValidate = fieldsOffer[stepNo];
    if ([0, 1].includes(stepNo)) {
      const output = await form.trigger(fieldsToValidate as OfferFieldsName[], {
        shouldFocus: true,
      });
      if (!output) return;
    }

    const currentStep = stepNo + 1;
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
            <div
              className={cn(
                'grid-cols-1 gap-4',
                stepNo == 0 ? 'grid' : 'hidden',
              )}
            >
              <FormField
                control={form.control}
                name="step1.offerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter offer Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="step1.offerCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className={'w-full'}>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={'w-full'}>
                        {ContractTypesValues.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="step1.offerReward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward</FormLabel>
                    <FormControl>
                      <Input placeholder="Reward" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="step1.offerDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Offer description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div
              className={cn(
                'grid-cols-1 gap-4',
                stepNo == 1 ? 'grid' : 'hidden',
              )}
            >
              <div className={'grid gap-4'}>
                <FormField
                  control={form.control}
                  name="step2.validRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeframe</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={'outline'}
                            className={cn(
                              'w-full justify-between text-left font-normal',
                              !date && 'text-muted-foreground',
                            )}
                          >
                            {date?.from ? (
                              date.to ? (
                                <>
                                  {format(date.from, formatDate)} -{' '}
                                  {format(date.to, formatDate)}
                                </>
                              ) : (
                                format(date.from, formatDate)
                              )
                            ) : (
                              <span>Select the time period</span>
                            )}

                            <CalendarIcon className={'ml-auto'} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={(range) => setRange(range)}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormControl>
                        <Input {...field} className={'hidden'}></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="step2.offerRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Offer requirements" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="step2.offerDocuments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other documents</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Other documents" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="step2.needProof"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Need Proof</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
              {stepNo}
              <Button
                className={stepNo === 2 ? 'hidden' : ''}
                type="button"
                onClick={nextStep}
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
