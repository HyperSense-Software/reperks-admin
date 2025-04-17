import { cn } from '@udecode/cn';
import { UseFormReturn } from 'react-hook-form';

import * as React from 'react';
import { Asset } from '@/types/assets';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

export default function OfferFormStep3({
  form,
  assets,
}: {
  form: UseFormReturn<any>;
  assets: Asset[];
}) {
  const temp = form.getValues('step3.assetsList');
  console.log('temp', temp);
  const [openAssetsList, setOpenAssetsList] = React.useState(false);
  const [selectedAssets, setSelectedAssets] = React.useState(temp);

  const listChange = (value: number) => {
    let newVal = [];
    if (!selectedAssets.includes(value)) {
      newVal = [...selectedAssets, value];
    } else {
      newVal = selectedAssets.filter((item: number) => item !== value);
    }
    setSelectedAssets(newVal);
    form.setValue('step3.assetsList', newVal);
  };

  const selectAll = (checked: boolean) => {
    if (checked) {
      const allAssets = assets.map((item) => item.id);
      setSelectedAssets(allAssets);
      form.setValue('step3.assetsList', allAssets);
    } else {
      setSelectedAssets([]);
      form.setValue('step3.assetsList', []);
    }
  };

  return (
    <div className={cn('grid grid-cols-1 gap-4')}>
      <div>
        <div className="inline-flex w-full flex-col items-start justify-start gap-2 self-stretch">
          <div className="flex flex-col items-start justify-start gap-1 self-stretch">
            <div
              data-show-asterisk="false"
              data-size="sm"
              className="flex flex-col items-start justify-start gap-1 self-stretch"
            >
              <div className="inline-flex items-start justify-start gap-1 self-stretch">
                <div className="justify-start text-sm leading-tight font-medium">
                  Select the addresses you want to send the offer to
                </div>
              </div>
            </div>

            <div className={'relative w-full'}>
              <div
                onClick={(event) => {
                  setOpenAssetsList(!openAssetsList);
                  event.preventDefault();
                  event.stopPropagation();
                }}
                className={cn(
                  'flex min-h-9 w-full cursor-pointer items-center ' +
                    'justify-between gap-2 self-stretch overflow-hidden rounded-md border' +
                    ' border-gray-400 px-3 py-2.5',
                )}
              >
                <div className="flex flex-1 items-center justify-start gap-0.5 text-sm leading-tight">
                  Select addresses
                </div>
                <span className={'ml-auto'}>
                  <ChevronDown className="h-3 w-3 stroke-gray-400" />
                </span>
              </div>
              <ul
                className={cn(
                  'absolute w-full flex-col gap-2 rounded border border-gray-400 bg-white px-3 py-2.5',
                  openAssetsList ? 'flex' : 'hidden',
                )}
              >
                {assets.map((item) => (
                  <li
                    onClick={() => {
                      listChange(item.id);
                      setOpenAssetsList(false);
                    }}
                    className={cn(
                      'justify-start text-sm leading-tight',
                      selectedAssets.includes(item.id)
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer',
                    )}
                    key={item.id}
                  >
                    {item.id + '-' + item.address}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-1 self-stretch">
            {selectedAssets.length > 0 &&
              selectedAssets.map((item: string) => {
                const asset = assets.find((asset) => asset.id === +item);
                if (!asset) return null;
                return (
                  <div
                    key={item}
                    className="inline-flex items-center justify-start gap-2 self-stretch rounded-lg bg-neutral-100 p-3 outline outline-1 outline-offset-[-1px] outline-slate-200"
                  >
                    <div className="text-typography-text-secondary justify-start text-sm leading-tight font-semibold">
                      {asset?.id + '/' + asset?.address}
                    </div>
                    <span
                      className={'ml-auto cursor-pointer'}
                      onClick={() => {
                        listChange(asset!.id);
                      }}
                    >
                      &times;
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className={'mt-4 flex w-full items-center justify-start gap-2'}>
          <div className="inline-flex items-center justify-start gap-2 self-stretch">
            <Checkbox
              className={'cursor-pointer'}
              onCheckedChange={selectAll}
            />{' '}
            <div className="justify-start text-sm leading-tight font-medium">
              Send this offer to all my tenants
            </div>
          </div>
        </div>

        <div className={'mt-4 flex w-full items-center justify-start gap-2'}>
          <div className="inline-flex items-center justify-start gap-2 self-stretch">
            <FormField
              control={form.control}
              name="step3.askPermission"
              render={({ field }) => (
                <FormItem className="inline-flex items-center justify-start gap-2 self-stretch">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="inline items-center justify-start gap-2 self-stretch">
                    <span className="text-sm leading-tight font-medium">
                      Ask tenants for permission to access their{' '}
                    </span>
                    <span className="text-sm leading-tight font-bold">
                      address
                    </span>
                    <span className="text-sm leading-tight font-medium">
                      ,{' '}
                    </span>
                    <span className="text-sm leading-tight font-bold">
                      name
                    </span>
                    <span className="text-sm leading-tight font-medium">
                      {' '}
                      and{' '}
                    </span>
                    <span className="text-sm leading-tight font-bold">
                      email address*
                    </span>
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
