'use client';
import React, { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useRouter } from 'next/navigation';
import { fetchAuthSession, confirmSignIn } from '@aws-amplify/auth';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TOGGLE_LOADER } from '@/store/app/app.actions';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLocale, useTranslations } from 'next-intl';

// export const authChangePasswordFormSchema = z
//   .object({
//     challengeResponse: z
//       .string()
//       .regex(
//         new RegExp(
//           /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`])\S{8,99}$/,
//         ),
//         {
//           message:
//             'Password requirements: \n' +
//             'Minimum length at least 8 characters \n' +
//             'Contains at least 1 number \n' +
//             'Contains at least 1 special character\n' +
//             'Contains at least 1 uppercase letter\n' +
//             'Contains at least 1 lowercase letter\n',
//         },
//       ),
//     repeatChallengeResponse: z.string(),
//   })
//   .refine((data) => data.challengeResponse === data.repeatChallengeResponse, {
//     message: 'Passwords must match',
//     path: ['repeatChallengeResponse'], // This specifies which field the error is associated with
//   });

function ChangePasswordForm() {
  const locale = useLocale();
  const t = useTranslations('auth.change-password');
  const router = useRouter();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isVisibleRepeat, setIsVisibleRepeat] = useState(false);
  const toggleVisibilityRepeat = () => setIsVisibleRepeat(!isVisibleRepeat);

  const authChangePasswordFormSchema = z
    .object({
      challengeResponse: z
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
      repeatChallengeResponse: z.string(),
    })
    .refine((data) => data.challengeResponse === data.repeatChallengeResponse, {
      message: `${t('validation.password.match')}`,
      path: ['repeatChallengeResponse'], // This specifies which field the error is associated with
    });

  const form = useForm<z.infer<typeof authChangePasswordFormSchema>>({
    resolver: zodResolver(authChangePasswordFormSchema),
    defaultValues: {
      challengeResponse: '',
      repeatChallengeResponse: '',
    },
  });

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

  const activateAccount = async (
    data: z.infer<typeof authChangePasswordFormSchema>,
  ) => {
    try {
      const response = await confirmSignIn({
        challengeResponse: data.challengeResponse,
      });

      if (response.isSignedIn && response.nextStep.signInStep === 'DONE') {
        await fetchCurrentUser();
        toast.success(t('submit.success'));
      } else {
        toast.error(JSON.stringify(response.nextStep.signInStep));
      }
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        toast.error(JSON.stringify(errorMessage));
      }
    }
    dispatch(TOGGLE_LOADER(false));
  };

  const clientAction = async (
    formData: z.infer<typeof authChangePasswordFormSchema>,
  ) => {
    const changeData = {
      challengeResponse: formData.challengeResponse,
      repeatChallengeResponse: formData.repeatChallengeResponse,
    };

    dispatch(TOGGLE_LOADER(true));
    await activateAccount(changeData);
  };

  return (
    <Form {...form}>
      <Card className="w-full max-w-sm border-none bg-transparent shadow-none">
        <form onSubmit={form.handleSubmit(clientAction)} className="space-y-8">
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
                name="challengeResponse"
                render={({ field }) => (
                  <FormItem>
                    {/*<FormLabel>{t('form.password.label')}</FormLabel>*/}
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type={isVisible ? 'text' : 'password'}
                          placeholder={t('form.password.placeholder')}
                          autoComplete={'new-password'}
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

                    <FormMessage className={'text-left whitespace-pre'} />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="repeatChallengeResponse"
                render={({ field }) => (
                  <FormItem>
                    {/*<FormLabel>{t('form.passwordRepeat.label')}</FormLabel>*/}
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type={isVisibleRepeat ? 'text' : 'password'}
                          placeholder={t('form.passwordRepeat.placeholder')}
                          autoComplete={'new-password'}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={toggleVisibilityRepeat}
                          className={'absolute top-0 right-0 m-2.5'}
                        >
                          {isVisibleRepeat ? (
                            <EyeOff className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <Eye className="text-muted-foreground h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>

                    <FormMessage className={'text-left whitespace-pre'} />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className={'flex-col px-0'}>
            <Button
              type="submit"
              className="w-full cursor-pointer bg-zinc-900 font-medium text-zinc-50 hover:bg-zinc-700"
            >
              {t('form.submit.button')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}

export default memo(ChangePasswordForm);
