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
  companyName: z.string().min(1, 'Company name is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function PersonalInfoForm({
  initialData,
}: {
  initialData: IUser;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: initialData.companyName ?? '',
      firstName: initialData.firstName ?? '',
      lastName: initialData.lastName ?? '',
      city: initialData.city ?? '',
      address: initialData.address ?? '',
      postalCode: initialData.postalCode ?? '',
    },
  });

  // Handle form submission
  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true);

      try {
        const apiPath =
          process.env.NEXT_PUBLIC_API_BASE_URL +
          'v1/landlord/users/updateProfile';
        const response: AxiosResponse<Response<IUser>> =
          await axiosInstance.put(apiPath, {
            ...data,
          });

        if (
          response.data.error_code.code === 0 &&
          response.data.error_code.message === 'Success'
        ) {
          toast.success('Your personal information has been updated.');
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
        className="grid grid-cols-2 gap-4"
      >
        <div className={'col-span-2'}>
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company name</FormLabel>
                <FormControl>
                  <Input placeholder="Company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="First name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
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
              <FormLabel>Postal code</FormLabel>
              <FormControl>
                <Input placeholder="Postal code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={'col-span-2'}>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-2 flex justify-end">
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
