'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { IUser } from '@/models/user.interface';
import { AxiosResponse } from 'axios';
import { Response } from '@/interfaces/APIResponse';
import axiosInstance from '@/instance/axiosInstance';

// Define form schema with Zod
const formSchema = z.object({
  address: z.string().min(1, 'Billing address is required'),
  iban: z.string().min(1, 'IBAN is required'),
  bic: z.string().min(1, 'BIC is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function BillingInfoForm({
  initialData,
}: {
  initialData: IUser;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: initialData.billingInformation?.address ?? '',
      iban: initialData.billingInformation?.iban ?? '',
      bic: initialData.billingInformation?.bic ?? '',
    },
  });

  // useEffect(() => {
  //   form.reset(initialData);
  // }, [initialData, form.reset, form]);

  // Handle form submission
  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true);

      try {
        const apiPath =
          process.env.NEXT_PUBLIC_API_BASE_URL +
          'v1/landlord/users/updateBillingInformation';
        const response: AxiosResponse<Response<IUser>> =
          await axiosInstance.put(apiPath, {
            billingInformation: { ...data },
          });

        if (
          response.data.error_code.code === 0 &&
          response.data.error_code.message === 'Success'
        ) {
          toast.success('Your billing information has been updated.');
          form.reset(response.data.response);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to update your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4"
      >
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billing address</FormLabel>
              <FormControl>
                <Input placeholder="Billing address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="iban"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IBAN</FormLabel>
              <FormControl>
                <Input placeholder="IBAN" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BIC</FormLabel>
              <FormControl>
                <Input placeholder="BIC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update info'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
