import React from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface WatchesImageGalleryProps {
  images: string[];
  selectedImage: number;
  onImageSelect: (index: number) => void;
}

export default function WatchesImageGallery({ images, selectedImage, onImageSelect }: WatchesImageGalleryProps) {
  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden bg-slate-50 border border-slate-200">
        <img
          src={getImageUrl(images[selectedImage] || images[0])}
          alt="Watch"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/f8fafc/64748b?text=Watch+Image';
          }}
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`aspect-square overflow-hidden border-2 transition-all duration-300 ${
                selectedImage === index
                  ? 'border-amber-500'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <img
                src={getImageUrl(image)}
                alt={`Watch ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/150x150/f8fafc/64748b?text=Watch+${index + 1}`;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}