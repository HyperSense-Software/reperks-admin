import Image, { StaticImageData } from 'next/image';
import { cn, mediaBreakPoints } from '@/lib/utils';
import { ReactNode } from 'react';

export type ResponsiveImageProps = {
  name?: string;
  type?: string;
  imageUrl: StaticImageData | string;
  srcSet?: string;
  srcSetArray?: string[];
  className?: string;
  children?: ReactNode;
  priority?: boolean;
  coverImg?: boolean;
  width?: number;
  height?: number;
};

export const ResponsiveImage = ({
  name = 'image',
  imageUrl,
  coverImg = true,
  srcSet = '',
  priority = false,
  srcSetArray = [],
  className = '',
  width = 0,
  height = 0,
}: ResponsiveImageProps) => {
  const combinedClassName = cn(
    'w-full h-auto',
    className ? className : '',
    'flex  justify-center',
  );
  const srcSetMedia = mediaBreakPoints;
  let oneSource = false;
  let multipleSource = false;
  if (
    typeof srcSetArray !== 'undefined' &&
    srcSetArray.length === srcSetMedia.length &&
    srcSetArray.length > 0
  ) {
    multipleSource = true;
  } else if (
    typeof srcSet !== 'undefined' &&
    srcSet &&
    !Array.isArray(srcSet)
  ) {
    oneSource = true;
  }
  const simpleImg = !oneSource && !multipleSource && imageUrl;
  const coverImgClass = `${coverImg ? 'object-cover' : ''}`;

  return (
    <>
      {simpleImg && (
        <Image
          src={imageUrl as string}
          alt={name || 'image'}
          width={width}
          height={height}
          sizes="100vw"
          priority={priority ? priority : false}
          className={cn(coverImgClass, combinedClassName)}
        />
      )}
      {!simpleImg && (
        <picture className={combinedClassName}>
          {oneSource && <source srcSet={srcSet} />}
          {multipleSource &&
            Array.isArray(srcSetArray) &&
            srcSetArray.map((srcSetItem: string, index: number) => (
              <source
                key={'pict-' + index}
                srcSet={srcSetItem}
                media={srcSetMedia[index]}
              />
            ))}
          <Image
            src={imageUrl as string}
            alt={name || 'image'}
            width={width}
            height={height}
            sizes="100vw"
            priority={priority ? priority : false}
            className={coverImgClass}
          />
        </picture>
      )}
    </>
  );
};
