import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import { canvasPreview } from './canvasPreview';
import { useDebounceEffect } from './useDebounceEffect';

import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '../ui/button';
import { useAppDispatch } from '@/store';
import { v4 as uuidv4 } from 'uuid';
import { uploadS3 } from '@/store/s3Upload/s3Upload.thunk';
import { CropImageProps } from './imageCropper.props';
/* eslint-disable @next/next/no-img-element */
// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export const CropImage = ({ file, folder, onUploadHandler }: CropImageProps) => {
  const dispatch = useAppDispatch();

  const [imgSrc, setImgSrc] = useState('');
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  // const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
  const blobUrlRef = useRef('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [
    scale,
    // setScale
  ] = useState(1);
  const [
    rotate,
    // setRotate
  ] = useState(0);
  const [
    aspect,
    // setAspect
  ] = useState<number | undefined>(16 / 9);
  // const fileUploadInput = useRef<any>(null);

  function onSelectFile(file: File | string) {
    if (file) {
      const blob = file as Blob;
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(blob);
    }
  }

  useEffect(() => {
    if (file) {
      onSelectFile(file);
    }
  }, [file]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  const uploadCoverImg = async (file: File, blob: string) => {
    // dispatch(TOGGLE_LOADER(true));
    const params = {
      key: file.name,
      type: file.type,
      size: file.size,
      file: file,
    };

    dispatch(uploadS3(params));
    onUploadHandler(blob);
    console.log('done');

    // dispatch(TOGGLE_LOADER(false));
  };

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: 'image/png',
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);

    const base64Image = previewCanvas.toDataURL('image/png');

    const imageName = 'tmp/portfolios-assets/' + folder + '/' + uuidv4() + '.png';
    const imageBlob = previewCanvas.toDataURL('image/png');
    const nBlob = dataURItoBlob(base64Image);
    const imageFile = new File([nBlob], imageName, { type: 'image/png' });

    uploadCoverImg(imageFile, imageBlob);
  }
  function dataURItoBlob(dataURI: string) {
    console.log('dataURI', dataURI);

    const byteString = atob(dataURI.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
      }
    },
    100,
    [completedCrop, scale, rotate],
  );

  // function handleToggleAspectClick() {
  //   if (aspect) {
  //     setAspect(undefined);
  //   } else {
  //     setAspect(16 / 9);
  //
  //     if (imgRef.current) {
  //       const { width, height } = imgRef.current;
  //       const newCrop = centerAspectCrop(width, height, 16 / 9);
  //       setCrop(newCrop);
  //       // Updates the preview
  //       setCompletedCrop(convertToPixelCrop(newCrop, width, height));
  //     }
  //   }
  // }

  return (
    <div className="App">
      <div className="grid gap-6 sm:grid-cols-2">
        {!!imgSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}

        {!!completedCrop && (
          <>
            <div>
              <canvas
                ref={previewCanvasRef}
                className="aspect-auto"
                style={{
                  objectFit: 'contain',
                  border: '1px solid gray',
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>
          </>
        )}
      </div>
      <Button className="m-4" type="submit" onClick={onDownloadCropClick}>
        Save changes
      </Button>
    </div>
  );
};
