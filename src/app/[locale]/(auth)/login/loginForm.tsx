'use client';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { z } from 'zod';
import { fetchAuthSession, signIn } from 'aws-amplify/auth';
import { useLocale } from 'next-intl';
import Link from 'next/link';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { TOGGLE_LOADER } from '@/store/app/app.actions';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslations } from 'use-intl';
import { authCognitoState } from '@/interfaces';

export function LoginForm() {
  const locale = useLocale();
  const t = useTranslations('auth.login');
  const router = useRouter();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const formSchema = z.object({
    email: z.string().email({
      message: t('validation.email.invalid'),
    }),
    password: z
      .string()
      .regex(
        new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`])\S{8,99}$/,
        ),
        {
          message:
            `${t('validation.password.requirements')}\n` +
            `${t('validation.password.minLength')}\n` +
            `${t('validation.password.number')}\n` +
            `${t('validation.password.specialChar')}\n` +
            `${t('validation.password.uppercase')}\n` +
            `${t('validation.password.lowercase')}`,
        },
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const loginData = {
      email: values.email,
      password: values.password,
    };
    dispatch(TOGGLE_LOADER(true));

    try {
      await clientSignIn(loginData);
    } catch (error: unknown) {
      dispatch(TOGGLE_LOADER(false));
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        toast.error(JSON.stringify(errorMessage));
      }
    }
  };

  const fetchCurrentUser = async () => {
    fetchAuthSession()
      .then((session) => {
        if (session.tokens) {
          dispatch(TOGGLE_LOADER(false));
          router.push(`/${locale}/dashboard`);
        }
      })
      .catch((error: Error) => {
        dispatch(TOGGLE_LOADER(false));
        toast.error(JSON.stringify(error.message));
      });
  };

  useEffect(() => {
    fetchAuthSession().then((session) => {
      if (session.tokens) {
        router.push(`/${locale}/dashboard`);
      }
    });
  }, [locale, router]);

  const clientSignIn = async (data: authCognitoState) => {
    try {
      const username = data.email;
      const password = data.password;
      const response = await signIn({ username, password });

      if (response.isSignedIn) {
        await fetchCurrentUser();
      } else {
        switch (response.nextStep.signInStep) {
          case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
            router.push(`/${locale}/change-password`);
            break;
          case 'RESET_PASSWORD':
            router.push(`/${locale}/forgot-password`);
            break;
          case 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE':
          case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
            router.push(`/${locale}/confirm-code?verify=totp`);
            break;
          case 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP':
          case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
            router.push(`/${locale}/confirm-code?verify=sms`);
            break;
          case 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION':
            router.push(`/${locale}/selectionMFA`);
            break;
          case 'CONFIRM_SIGN_UP':
          case 'DONE':
            // code block
            break;
          default:
          // code block
        }

        dispatch(TOGGLE_LOADER(false));
      }
    } catch (error: unknown) {
      dispatch(TOGGLE_LOADER(false));
      console.log(error);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        toast.error(JSON.stringify(errorMessage));
      }
    }
  };

  return (
    <Form {...form}>
      <Card className="w-full max-w-sm border-none bg-transparent shadow-none">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-9"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }
          }}
        >
          <CardHeader className={'mb-6 gap-2 px-0'}>
            <CardTitle className="text-left text-2xl text-zinc-950">
              {t('title')}
            </CardTitle>
            <div className="text-left text-sm text-zinc-500">
              {t('description')}
            </div>
          </CardHeader>

          <CardContent className="mb-6 grid gap-2 px-0">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    {/*<FormLabel>{t('email.label')}</FormLabel>*/}
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          autoComplete={'email'}
                          placeholder={t('email.placeholder')}
                          {...field}
                        />
                        <Mail className="text-muted-foreground absolute top-0 right-0 m-2.5 h-4 w-4" />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    {/*<FormLabel>{t('password.label')}</FormLabel>*/}
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          autoComplete={'password'}
                          type={isVisible ? 'text' : 'password'}
                          placeholder={t('password.placeholder')}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={toggleVisibility}
                          className={'absolute top-0 right-0 m-2.5'}
                        >
                          {isVisible ? (
                            <EyeOff className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <Eye className="text-muted-foreground h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="text-right">
              <Link
                href={`/${locale}/forgot-password`}
                className="text-sm font-bold text-zinc-900"
              >
                {t('forgotPassword')}
              </Link>
            </div>
          </CardContent>

          <CardFooter className={'flex-col px-0'}>
            <Button
              type="submit"
              className="w-full cursor-pointer bg-zinc-900 font-medium text-zinc-50 hover:bg-zinc-700"
            >
              {t('submit')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}
