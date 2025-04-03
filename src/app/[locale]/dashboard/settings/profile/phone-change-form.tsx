'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';

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
import {
  sendUserAttributeVerificationCode,
  updateUserAttributes,
} from 'aws-amplify/auth';

export default function PhoneChangeForm({
  phone,
  setVerifyPhone,
}: {
  phone: string | null;
  setVerifyPhone: (value: boolean) => void;
}) {
  const t = useTranslations('dashboard.settings.profile.phoneNumber.form');
  const formSchema = z.object({
    phone: z
      .string()
      .min(1, t('validation.required'))
      .regex(/^\+[1-9]\d{1,14}$/, t('validation.format')),
  });
  type FormValues = z.infer<typeof formSchema>;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setNewPhone] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: phone ?? '',
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true);
      const { phone_number } = await updateUserAttributes({
        userAttributes: {
          phone_number: data.phone,
        },
      });

      if (!phone_number.isUpdated) {
        toast.error(t('error'));
        return;
      }

      await sendUserAttributeVerificationCode({
        userAttributeKey: 'phone_number',
      });
      setNewPhone(data.phone);
      setVerifyPhone(true);
      toast.success(t('success'));
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
        className="grid grid-cols-1 gap-4"
      >
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('phone.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('phone.placeholder')} {...field} />
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
            {isSubmitting ? t('submit.updating') : t('submit.update')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
