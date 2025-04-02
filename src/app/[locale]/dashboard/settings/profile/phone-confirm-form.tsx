'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import {
  confirmUserAttribute,
  sendUserAttributeVerificationCode,
  updateUserAttributes,
} from 'aws-amplify/auth';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

type FormValues = z.infer<typeof formSchema>;

const PhoneConfirmCodeComponent = ({
  phone,
  setVerifyPhone,
}: {
  phone: string | null;
  setVerifyPhone: (value: boolean) => void;
}) => {
  const [resendCode, setResendCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  });

  const resentCode = async () => {
    setResendCode(true);
    try {
      await sendUserAttributeVerificationCode({
        userAttributeKey: 'phone_number',
      });
      setVerifyPhone(false);
    } catch (err: unknown) {
      toast.error(JSON.stringify(err));
    } finally {
      setResendCode(false);
    }
  };

  const removePhoneNumber = async () => {
    setIsRemoving(true);
    try {
      await updateUserAttributes({
        userAttributes: {
          phone_number: '',
        },
      });
      toast.success('Phone number removed successfully');
      setVerifyPhone(false);
    } catch (err: unknown) {
      console.log(err);
      toast.error('Failed to remove phone number');
    } finally {
      setIsRemoving(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await confirmUserAttribute({
        userAttributeKey: 'phone_number',
        confirmationCode: data.code,
      });
      setVerifyPhone(false);
    } catch (err: unknown) {
      toast.error(JSON.stringify(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4"
      >
        <p>
          Enter the verification code sent to your phone:{' '}
          <small>({phone})</small>
        </p>

        <Controller
          control={form.control}
          name="code"
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        <div className="flex justify-between gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={resendCode}
              onClick={resentCode}
            >
              Resend
              {resendCode ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : null}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={removePhoneNumber}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Remove Phone
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Verify Code'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PhoneConfirmCodeComponent;
