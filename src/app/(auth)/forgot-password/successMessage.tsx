import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SuccessMessage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Request submitted</CardTitle>
        <CardDescription className="text-center">
          The request has been submitted successfully. <br />
          Please check your email for further instructions.
        </CardDescription>
      </CardHeader>
      <CardContent className={'text-center'}>
        <Button>
          <Link href={'/'}>Go back to homepage</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
