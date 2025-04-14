'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'use-intl';

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

export default function PersonalInfoForm({
  initialData,
}: {
  initialData: IUser;
}) {
  const t = useTranslations('dashboard.settings.profile.personalInfo.form');
  const formSchema = z.object({
    companyName: z.string().min(1, t('validation.companyName.required')),
    firstName: z.string().min(1, t('validation.firstName.required')),
    lastName: z.string().min(1, t('validation.lastName.required')),
    city: z.string().min(1, t('validation.city.required')),
    address: z.string().min(1, t('validation.address.required')),
    postalCode: z.string().min(1, t('validation.postalCode.required')),
  });
  type FormValues = z.infer<typeof formSchema>;
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

  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true);
      const apiPath =
        process.env.NEXT_PUBLIC_API_BASE_URL +
        'v1/landlord/users/updateProfile';
      const response: AxiosResponse<Response<IUser>> = await axiosInstance.put(
        apiPath,
        data,
      );

      if (
        response.data.error_code.code === 0 &&
        response.data.error_code.message === 'Success'
      ) {
        toast.success(t('success'));
        form.reset(response.data.response);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('error'));
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
                <FormLabel>{t('companyName.label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('companyName.placeholder')}
                    {...field}
                  />
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
              <FormLabel>{t('firstName.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('firstName.placeholder')} {...field} />
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
              <FormLabel>{t('lastName.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('lastName.placeholder')} {...field} />
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
              <FormLabel>{t('city.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('city.placeholder')} {...field} />
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
              <FormLabel>{t('postalCode.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('postalCode.placeholder')} {...field} />
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
                <FormLabel>{t('address.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('address.placeholder')} {...field} />
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
            {isSubmitting ? t('submit.updating') : t('submit.update')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
