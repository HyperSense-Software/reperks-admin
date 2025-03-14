'use client';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchAuthSession, signIn } from 'aws-amplify/auth';
import { authCognitoState } from '@/models';
import { TOGGLE_LOADER } from '@/store/app/app.actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z
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
});

export function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

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
      console.error(error);
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
          router.push('/dashboard');
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
        router.push('/dashboard');
      }
    });
  }, [router]);

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
            router.push(`/change-password`);
            break;
          case 'RESET_PASSWORD':
            router.push(`/forgot-password`);
            break;
          case 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE':
          case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
            router.push('/confirmCode?verify=totp');
            break;
          case 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP':
          case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
            router.push('/confirmCode?verify=sms');
            break;
          case 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION':
            router.push('/selectionMFA');
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
      console.error(error);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        toast.error(JSON.stringify(errorMessage));
      }
    }
  };

  return (
    <Form {...form}>
      <Card className="w-full max-w-sm">
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
          <CardHeader>
            <CardTitle className="text-center text-2xl">Login</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input placeholder="Email Address" {...field} />
                        <Mail className="absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type={isVisible ? 'text' : 'password'}
                          placeholder="Password"
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
          </CardContent>
          <CardFooter className={'flex-col'}>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <div className="mt-4 text-center text-sm">
              <p>Already have an account?</p>
              <Link href={'/forgot-password'} className="underline">
                Forgot your password?
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}
