'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  createTranslator,
  Messages,
  NestedKeyOf,
  useLocale,
  useTranslations,
} from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import {
  updateUserAttributes,
  sendUserAttributeVerificationCode,
} from 'aws-amplify/auth';

const setFormSchema = (
  t: ReturnType<typeof createTranslator<Messages, NestedKeyOf<Messages>>>,
) => {
  const FormSchema = z.object({
    phone: z.string().min(11, {
      message: t('form.validation.phone'),
    }),
  });
  return FormSchema;
};

const AddPhoneComponent = () => {
  const locale = useLocale();
  const router = useRouter();

  const t = useTranslations('dashboard.mfa.sms.addPhone');

  const FormSchema = setFormSchema(t);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
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
      setPhone(data.phone);
      toast.success(t('messages.added', { phone }));
      router.push(`/${locale}/dashboard/2FA/confirm-code?confirm=sms`);
    } catch (err: unknown) {
      console.error(err);

      toast.error(JSON.stringify(err));
    }
  };
  const [phone, setPhone] = useState('');

  return (
    <div className="flex flex-col content-center justify-center gap-8 self-center">
      <Card className={`w-dvw max-w-[744px]`}>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <CardContent className="items-center gap-2.5">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="max-w-sm gap-1.5">
                    <FormLabel className={`font-medium`}>
                      {t('form.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="phone"
                        id="phone"
                        placeholder={t('form.placeholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <Separator className={'my-6'} />
            <CardContent className="flex flex-row justify-end gap-6">
              <Button asChild type="button" variant={'outline'}>
                <Link href={`/${locale}/dashboard/settings/security`}>
                  {t('cancel')}
                </Link>
              </Button>
              <Button
                type="submit"
                className={form.getValues('phone') !== '' ? `` : `bg-gray-400`}
              >
                {t('continue')}
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddPhoneComponent;
