'use client';
import { memo, useState } from 'react';
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

import { authRecoverCognitoState } from '@/models';
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
import { SuccessMessage } from '@/app/(auth)/forgot-password/successMessage';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();

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

      if (response.nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        setSubmitted(true);
        dispatch(TOGGLE_LOADER(false));
        toast.success('Success');
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
      <Card className="w-full max-w-sm">
        <form onSubmit={form.handleSubmit(clientAction)} className="space-y-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Forgot password</CardTitle>
            <CardDescription>
              Forgot your password? Don&apos;t worry, it happens to the best of us.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid">
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

export default memo(ForgotPasswordForm);
