export interface CropImageProps {
  file: File | string;
  folder: string;
  onUploadHandler: (blob: string) => void;
}
