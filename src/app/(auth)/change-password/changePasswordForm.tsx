'use client';
import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
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

import { useRouter } from 'next/navigation';
import { fetchAuthSession, confirmSignIn } from '@aws-amplify/auth';

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

export const authChangePasswordFormSchema = z
  .object({
    challengeResponse: z
      .string()
      .regex(
        new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`])\S{8,99}$/,
        ),
        {
          message:
            'Password requirements: \n' +
            'Minimum length at least 8 characters \n' +
            'Contains at least 1 number \n' +
            'Contains at least 1 special character\n' +
            'Contains at least 1 uppercase letter\n' +
            'Contains at least 1 lowercase letter\n',
        },
      ),
    repeatChallengeResponse: z.string(),
  })
  .refine((data) => data.challengeResponse === data.repeatChallengeResponse, {
    message: 'Passwords must match',
    path: ['repeatChallengeResponse'], // This specifies which field the error is associated with
  });

function ChangePasswordForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isVisibleRepeat, setIsVisibleRepeat] = useState(false);
  const toggleVisibilityRepeat = () => setIsVisibleRepeat(!isVisibleRepeat);

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
          router.push('/dashboard');
        }
      })
      .catch((error: Error) => {
        dispatch(TOGGLE_LOADER(false));
        toast.error(JSON.stringify(error.message));
      });
  };

  const activateAccount = async (data: z.infer<typeof authChangePasswordFormSchema>) => {
    try {
      const response = await confirmSignIn({
        challengeResponse: data.challengeResponse,
      });

      if (response.isSignedIn && response.nextStep.signInStep === 'DONE') {
        await fetchCurrentUser();
        toast.success('Success');
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

  const clientAction = async (formData: z.infer<typeof authChangePasswordFormSchema>) => {
    const changeData = {
      challengeResponse: formData.challengeResponse,
      repeatChallengeResponse: formData.repeatChallengeResponse,
    };

    dispatch(TOGGLE_LOADER(true));
    await activateAccount(changeData);
  };

  return (
    <Form {...form}>
      <Card className="w-full max-w-sm">
        <form onSubmit={form.handleSubmit(clientAction)} className="space-y-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Setup Password</CardTitle>
            <CardDescription>Setup your account password.</CardDescription>
          </CardHeader>
          <CardContent className="grid">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="challengeResponse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type={isVisible ? 'text' : 'password'}
                          placeholder="New password"
                          {...field}
                        />
                        <button type="button" onClick={toggleVisibility}>
                          {isVisible ? (
                            <EyeOff className="absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
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
                name="repeatChallengeResponse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat Password</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type={isVisibleRepeat ? 'text' : 'password'}
                          placeholder="New password"
                          {...field}
                        />
                        <button type="button" onClick={toggleVisibilityRepeat}>
                          {isVisibleRepeat ? (
                            <EyeOff className="absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className={'flex-col'}>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}

export default memo(ChangePasswordForm);
