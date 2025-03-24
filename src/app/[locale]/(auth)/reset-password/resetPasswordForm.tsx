'use client';
import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useRouter } from 'next/navigation';
import { confirmResetPassword } from 'aws-amplify/auth';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TOGGLE_LOADER } from '@/store/app/app.actions';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

function ResetPasswordForm({ email, code }: { email: string; code: string }) {
  const locale = useLocale();
  const t = useTranslations('auth.reset-password');

  const router = useRouter();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isVisibleRepeat, setIsVisibleRepeat] = useState(false);
  const toggleVisibilityRepeat = () => setIsVisibleRepeat(!isVisibleRepeat);

  const formSchema = z
    .object({
      newPassword: z
        .string()
        .regex(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`])\S{8,99}$/,
          ),
          t('formSchema.password'),
        ),
      repeatNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.repeatNewPassword, {
      message: t('formSchema.passwordMatch'),
      path: ['repeatNewPassword'], // This specifies which field the error is associated with
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      repeatNewPassword: '',
    },
  });

  const resetPassword = async (data: { newPassword: string }) => {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: data.newPassword,
      });

      dispatch(TOGGLE_LOADER(false));
      toast.success(t('submit.password.success'));
      router.push(`/${locale}/login`);
    } catch (error: unknown) {
      dispatch(TOGGLE_LOADER(false));
      console.error(error);
      if (error instanceof Error) toast.error(JSON.stringify(error.message));
    }
  };

  const clientAction = async (formData: z.infer<typeof formSchema>) => {
    const resetData = {
      newPassword: formData.newPassword,
    };

    dispatch(TOGGLE_LOADER(true));
    await resetPassword(resetData);
  };

  return (
    <Form {...form}>
      <Card className="w-full max-w-sm">
        <form onSubmit={form.handleSubmit(clientAction)}>
          <CardHeader>
            <CardTitle className="text-2xl">{t('form.title')}</CardTitle>
            <CardDescription>{t('form.description')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 py-6">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.password.label')}</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type={isVisible ? 'text' : 'password'}
                          placeholder={t('form.password.placeholder')}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={toggleVisibility}
                          className={'absolute top-0 right-0 m-2.5 block'}
                        >
                          {isVisible ? (
                            <EyeOff className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <Eye className="text-muted-foreground h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>

                    <FormMessage className={'whitespace-pre'} />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="repeatNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.passwordRepeat.label')}</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type={isVisibleRepeat ? 'text' : 'password'}
                          placeholder={t('form.passwordRepeat.placeholder')}
                          {...field}
                        />
                        <button
                          type="button"
                          className={'block'}
                          onClick={toggleVisibilityRepeat}
                        >
                          {isVisibleRepeat ? (
                            <EyeOff className="text-muted-foreground absolute top-0 right-0 m-2.5 h-4 w-4" />
                          ) : (
                            <Eye className="text-muted-foreground absolute top-0 right-0 m-2.5 h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className={'whitespace-pre'} />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className={'flex-col'}>
            <Button className="w-full">{t('form.submit.label')}</Button>
            <div className="mt-4 text-center text-sm">
              <p>{t('form.login.label')}</p>
              <Link href={`${locale}/login`} className="underline">
                {t('form.login.cta')}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}

export default memo(ResetPasswordForm);
