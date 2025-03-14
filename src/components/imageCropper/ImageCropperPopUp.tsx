import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CropImage } from './imageCropper';

export interface CropImageProps {
  isOpen: boolean;
  file: File | string;
  folder: string | undefined;
  oncloseHandler: (isOpen: boolean) => void;
  onUploadDoneHandler: (blob: string) => void;
}

export const PopupImageCrop = ({
  folder,
  isOpen = false,
  oncloseHandler,
  file,
  onUploadDoneHandler,
}: CropImageProps) => {
  function onclose() {
    oncloseHandler(false);
  }

  function onUploadDone(blob: string) {
    onUploadDoneHandler(blob);
    oncloseHandler(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onclose}>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <CropImage file={file ?? ''} folder={folder ?? ''} onUploadHandler={onUploadDone} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
