import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Offer } from '@/types/offers';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createOffer, updateOffer } from '@/lib/api/offers';

interface OfferFormProps {
  open: boolean;
  offer: Offer | null;
  onClose: (refetch?: boolean) => void;
}

const offerFormSchema = z.object({
  offerName: z.string().min(1, 'Offer Name is required'),
  offerCategory: z.string().min(1, 'Offer Category is required'),
  offerRequirements: z.string().min(1, 'Offer Requirements are required'),
  offerReward: z.number().min(1, 'Offer Reward is required'),
  validFrom: z.number().min(1, 'Availability is required'),
  validTo: z.number().min(1, 'Availability is required'),
  offerDescription: z.string().optional(),
  offerThumbnail: z.string().optional(),
  offerDocuments: z.string().optional(),
  assetsList: z.array(z.string()).optional(),
  needProof: z.boolean().optional(),
});

type OfferFormValues = z.infer<typeof offerFormSchema>;

export default function OfferForm({ open, offer, onClose }: OfferFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!offer;

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      offerName: offer?.offerName || '',
      offerReward: offer?.offerReward || 0,
      validFrom: offer?.validFrom || 0,
      validTo: offer?.validTo || 0,
      offerCategory: offer?.offerCategory || '',
      offerRequirements: offer?.offerRequirements || '',
      offerDescription: offer?.offerDescription || '',
      offerThumbnail: offer?.offerThumbnail || '',
      offerDocuments: offer?.offerDocuments || '',
      assetsList: offer?.assetsList || [],
      needProof: offer?.needProof || false,
    },
  });

  const onSubmit = async (values: OfferFormValues) => {
    setIsSubmitting(true);

    try {
      if (isEditing && offer) {
        await updateOffer(offer.id, values);
        toast.success('Offer updated successfully');
      } else {
        await createOffer(values);
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
          <DialogTitle>
            {isEditing ? 'Edit Offer' : 'Add New Offer'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="offerName"
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

            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="address"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel>Address</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input placeholder="Enter address" {...field} />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}

            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="unitId"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel>Unit ID</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input placeholder="Enter unit ID" {...field} />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
