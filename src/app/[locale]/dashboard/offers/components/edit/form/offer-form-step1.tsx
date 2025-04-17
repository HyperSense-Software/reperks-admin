import { cn } from '@udecode/cn';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ContractTypesValues } from './offer-form-schema';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { File } from 'lucide-react';
import { useCallback, useState } from 'react';
import { preSignedUrl, PresignedUrlResponse } from '@/services/s3';
import { tempFilePrefix, uuidTopic } from '@/utils/utils';
import * as React from 'react';

export default function OfferFormStep1({ form }: { form: UseFormReturn<any> }) {
  const storageFolder = form.getValues('step1.storageFolder')
    ? form.getValues('step1.storageFolder')
    : 'offers/' + uuidTopic('storage');
  form.setValue('step1.storageFolder', storageFolder);

  const thumbnailUrl = form.getValues('step1.offerThumbnail');
  const fileName = thumbnailUrl ? thumbnailUrl.trim().split('/').pop() : '';

  const [thumbnailName, setThumbnailName] = useState<string>(fileName || '');
  const [uploadFileErr, setUploadFileErr] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const prevFileName = thumbnailName;
    try {
      const fileName =
        tempFilePrefix + storageFolder + '/' + acceptedFiles[0].name;
      const s3File = await preSignedUrl({
        key: fileName,
        type: acceptedFiles[0].type,
        size: acceptedFiles[0].size,
        file: acceptedFiles[0],
      });
      const resp = s3File as PresignedUrlResponse;

      if (resp) {
        const newFile = resp.fields?.key || '';
        setThumbnailName(newFile.split('/').pop() || '');
        form.setValue('step1.offerThumbnail', newFile);
      }
    } catch (e) {
      console.log(e);
      const errMsg = e as Error;
      setUploadFileErr(errMsg.message || 'File upload failed');
      setThumbnailName(prevFileName);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { 'image/*': [] },
    maxSize: 1024 * 1024 * 5, // 5 MB
  });

  const deleteFile = useCallback(() => {
    setThumbnailName('');
    form.setValue('step1.offerThumbnail', '');
  }, []);

  return (
    <div className={cn('grid grid-cols-1 gap-4 px-6')}>
      <FormField
        control={form.control}
        name="step1.offerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Offer Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter offer Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="step1.offerCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl className={'w-full'}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className={'w-full'}>
                {ContractTypesValues.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="step1.offerReward"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reward</FormLabel>
            <FormControl>
              <Input placeholder="Reward" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="step1.offerDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Offer description</FormLabel>
            <FormControl>
              <Textarea placeholder="Offer description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="step1.offerThumbnail"
        render={() => (
          <FormItem>
            <section
              className={cn(
                'w-full cursor-pointer rounded-md border border-dashed border-zinc-200 p-6',
                uploadFileErr ? 'border-red-500' : '',
                thumbnailName && 'hidden',
              )}
            >
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <File className={'mx-auto mb-2 stroke-gray-200'}></File>
                <div className={'grid grid-rows-1 gap-1'}>
                  <p className={'text-center text-sm font-medium'}>
                    Upload offer thumbnail image
                  </p>
                  <p className={'text-center text-sm font-normal'}>
                    Please upload the offer thumbnail image.
                  </p>
                </div>
              </div>
            </section>

            <p
              data-slot="form-message"
              className={cn(
                'text-destructive text-sm',
                uploadFileErr ? 'block' : 'hidden',
              )}
            >
              {uploadFileErr}
            </p>
          </FormItem>
        )}
      />
      <div
        className={cn(
          'inline-flex items-center justify-start gap-2 self-stretch rounded-lg bg-neutral-100 p-3 outline outline-1 outline-offset-[-1px] outline-slate-200',
          !thumbnailName && 'hidden',
        )}
      >
        <div className="flex flex-1 items-center justify-start gap-2">
          <span className={'cursor-pointer'} onClick={deleteFile}>
            &times;
          </span>
          <File className={'stroke-gray-200'}></File>
          <div className="text-typography-text-secondary justify-start text-sm leading-tight font-semibold">
            {thumbnailName}
          </div>
        </div>
      </div>
    </div>
  );
}
