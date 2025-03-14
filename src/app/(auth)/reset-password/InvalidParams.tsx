import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function InvalidParams() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Invalid link</CardTitle>
        <CardDescription>The link you are trying to use is invalid.</CardDescription>
      </CardHeader>
      <CardContent className={'text-center'}>
        <Button>
          <Link href={'/'}>Go back to homepage</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
