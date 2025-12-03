import { useState, useEffect } from 'react';

interface ImagePreviewProps {
  src: string | File | null;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ImagePreview({ src, alt = 'Image', className = 'h-16 w-20 rounded-md object-cover shadow-sm', width, height }: ImagePreviewProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  useEffect(() => {
    if (!src) {
      setImageSrc(null);
      return;
    }
    
    // If src is a string (URL), use it directly
    if (typeof src === 'string') {
      setImageSrc(src);
      return;
    }
    
    // If src is a File object, create a preview URL
    if (src instanceof File) {
      const objectUrl = URL.createObjectURL(src);
      setImageSrc(objectUrl);
      
      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [src]);
  
  if (!imageSrc) {
    return null;
  }
  
  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className}
      width={width}
      height={height}
    />
  );
}