import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Asset } from '@/types/assets';
import { createAsset, updateAsset } from '@/lib/api/assets';
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

interface AssetFormProps {
  open: boolean;
  asset: Asset | null;
  onClose: (refetch?: boolean) => void;
}

const assetFormSchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  address: z.string().min(1, 'Address is required'),
  unitId: z.string().min(1, 'Unit ID is required'),
  unitDescription: z.string().min(1, 'Unit description is required'),
  apartmentNo: z.string().min(1, 'Apartment number is required'),
  tenantName: z.string().min(1, 'Tenant name is required'),
  tenantEmail: z.string().min(1, 'Tenant email is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

export default function AssetForm({ open, asset, onClose }: AssetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!asset;

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      assetId: asset?.assetId || '',
      address: asset?.address || '',
      unitId: asset?.unitId || '',
      unitDescription: asset?.unitDescription || '',
      apartmentNo: asset?.apartmentNo || '',
      tenantName: asset?.tenantName || '',
      tenantEmail: asset?.tenantEmail || '',
      postalCode: asset?.postalCode || '',
    },
  });

  const onSubmit = async (values: AssetFormValues) => {
    setIsSubmitting(true);

    try {
      if (isEditing && asset) {
        await updateAsset(asset.id, values);
        toast.success('Asset updated successfully');
      } else {
        await createAsset(values);
        toast.success('Asset created successfully');
      }

      onClose(true);
    } catch (error) {
      console.error('Failed to save asset:', error);
      toast.error(
        `Failed to ${isEditing ? 'update' : 'create'} asset. Please try again.`,
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
            {isEditing ? 'Edit Asset' : 'Add New Asset'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter asset ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter unit ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unitDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter unit description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apartmentNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apartment Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter apartment number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tenantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tenant name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tenantEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tenant email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Postal code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
