import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarsImageGalleryProps {
  images: string[];
  selectedImage: number;
  onImageSelect: (index: number) => void;
}

export default function CarsImageGallery({ images, selectedImage, onImageSelect }: CarsImageGalleryProps) {
  const nextImage = () => {
    onImageSelect((selectedImage + 1) % images.length);
  };

  const prevImage = () => {
    onImageSelect(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden border-2 border-gray-200">
        <img
          src={images[selectedImage]}
          alt={`Product image ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 text-sm font-bold">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`aspect-square bg-gray-100 overflow-hidden border-2 transition-colors ${
                selectedImage === index
                  ? 'border-red-600'
                  : 'border-gray-200 hover:border-red-600'
              }`}
            >
              <img
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}