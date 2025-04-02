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
import {
  sendUserAttributeVerificationCode,
  updateUserAttributes,
} from 'aws-amplify/auth';
import { useTranslations } from 'next-intl';

// Define form schema with Zod
const formSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^\+[1-9]\d{1,14}$/,
      'Please enter a valid phone number with country code (e.g., +12345678901)',
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function PhoneChangeForm({
  phone,
  setVerifyPhone,
}: {
  phone: string | null;
  setVerifyPhone: (value: boolean) => void;
}) {
  const t = useTranslations('dashboard.mfa.sms.addPhone');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setNewPhone] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: phone ?? '',
    },
  });

  // Handle form submission
  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true);

      try {
        const { phone_number } = await updateUserAttributes({
          userAttributes: {
            phone_number: data.phone,
          },
        });

        if (!phone_number.isUpdated) {
          toast.error(t('messages.not-updated'));
        }

        await sendUserAttributeVerificationCode({
          userAttributeKey: 'phone_number',
        });
        setNewPhone(data.phone);
        setVerifyPhone(true);
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input placeholder="Phone number goes here" {...field} />
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
