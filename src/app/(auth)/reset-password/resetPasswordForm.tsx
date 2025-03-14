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

const formSchema = z
  .object({
    newPassword: z
      .string()
      .regex(
        new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`])\S{8,99}$/,
        ),
        'Password requirements: Minimum length at least 8 characters, Contains at least 1 number, Contains at least 1 special character, Contains at least 1 uppercase letter, Contains at least 1 lowercase letter',
      ),
    repeatNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.repeatNewPassword, {
    message: 'Passwords must match',
    path: ['repeatNewPassword'], // This specifies which field the error is associated with
  });

function ResetPasswordForm({ email, code }: { email: string; code: string }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isVisibleRepeat, setIsVisibleRepeat] = useState(false);
  const toggleVisibilityRepeat = () => setIsVisibleRepeat(!isVisibleRepeat);

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
      toast.success('Success');
      router.push(`/login`);
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
            <CardTitle className="text-2xl">Change password</CardTitle>
            <CardDescription>Set you new password.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type={isVisible ? 'text' : 'password'}
                          placeholder="New Password"
                          {...field}
                        />
                        <button type="button" className={'block'} onClick={toggleVisibility}>
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
                name="repeatNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat New Password</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type={isVisibleRepeat ? 'text' : 'password'}
                          placeholder="Repeat new Password"
                          {...field}
                        />
                        <button type="button" className={'block'} onClick={toggleVisibilityRepeat}>
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
            <Button className="w-full">Sign in</Button>
            <div className="mt-4 text-center text-sm">
              <p>Already have an account?</p>
              <Link href={'/login'} className="underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}

export default memo(ResetPasswordForm);
