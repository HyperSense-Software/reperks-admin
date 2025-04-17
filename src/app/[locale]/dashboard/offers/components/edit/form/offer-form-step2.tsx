import { UseFormReturn } from 'react-hook-form';
import { cn } from '@udecode/cn';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { formatDate } from '@/utils/utils';
import { DateRange } from 'react-day-picker';

export default function OfferFormStep2({
  form,
  date,
  setRange,
}: {
  form: UseFormReturn<any>;
  date: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 px-6')}>
      <div className={'grid gap-4'}>
        <FormField
          control={form.control}
          name="step2.validRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timeframe</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                      'w-full justify-between text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, formatDate)} -{' '}
                          {format(date.to, formatDate)}
                        </>
                      ) : (
                        format(date.from, formatDate)
                      )
                    ) : (
                      <span>Select the time period</span>
                    )}

                    <CalendarIcon className={'ml-auto'} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setRange}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
              <FormControl>
                <Input {...field} className={'hidden'}></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="step2.offerRequirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Requirements</FormLabel>
            <FormControl>
              <Textarea placeholder="Offer requirements" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="step2.offerDocuments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other documents</FormLabel>
            <FormControl>
              <Textarea placeholder="Other documents" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="step2.needProof"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Need Proof</FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
