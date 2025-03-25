'use client';
import React, { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

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

import { resetPassword } from 'aws-amplify/auth';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TOGGLE_LOADER } from '@/store/app/app.actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SuccessMessage } from '@/app/[locale]/(auth)/forgot-password/successMessage';
import { authRecoverCognitoState } from '@/interfaces';
import { useTranslations } from 'use-intl';

function ForgotPasswordForm() {
  const t = useTranslations('auth.forgot-password');
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();

  const formSchema = z.object({
    email: z.string().email({
      message: t('form-schema.email'),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  // Send confirmation code to user's email or phone number
  const clientRecoverPassword = async (data: authRecoverCognitoState) => {
    try {
      const response = await resetPassword({ username: data.username });

      if (
        response.nextStep.resetPasswordStep ===
        'CONFIRM_RESET_PASSWORD_WITH_CODE'
      ) {
        setSubmitted(true);
        dispatch(TOGGLE_LOADER(false));
        toast.success(t('submit.success'));
      }
    } catch (error: unknown) {
      dispatch(TOGGLE_LOADER(false));
      console.error(error);
      if (error instanceof Error) {
        toast.error(JSON.stringify(error.message));
      }
    }
  };

  const clientAction = async (formData: z.infer<typeof formSchema>) => {
    const recoverData = {
      username: formData.email,
    };

    dispatch(TOGGLE_LOADER(true));
    await clientRecoverPassword(recoverData);
  };

  return submitted ? (
    <SuccessMessage />
  ) : (
    <Form {...form}>
      <Card className="w-full max-w-sm border-none bg-transparent shadow-none">
        <form onSubmit={form.handleSubmit(clientAction)} className="space-y-8">
          <CardHeader className={'mb-6 gap-2 px-0'}>
            <CardTitle className="text-left text-2xl text-zinc-950">
              {t('form.title')}
            </CardTitle>
            <div className="text-left text-sm text-zinc-500">
              {t('form.description')}
            </div>
          </CardHeader>

          <CardContent className="mb-6 grid gap-2 px-0">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    {/*<FormLabel>{t('form.email.label')}</FormLabel>*/}
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          placeholder={t('form.email.placeholder')}
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
          </CardContent>
          <CardFooter className={'flex-col px-0'}>
            <Button
              type="submit"
              className="w-full cursor-pointer bg-zinc-900 font-medium text-zinc-50 hover:bg-zinc-700"
            >
              {t('form.submit')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}

export default memo(ForgotPasswordForm);
