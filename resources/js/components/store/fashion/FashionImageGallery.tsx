import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FashionImageGalleryProps {
  images: string[];
  selectedImage?: number;
  onImageSelect?: (index: number) => void;
}

export default function FashionImageGallery({ images, selectedImage = 0, onImageSelect }: FashionImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(selectedImage);
  
  const handleImageSelect = (index: number) => {
    setActiveIndex(index);
    if (onImageSelect) {
      onImageSelect(index);
    }
  };
  
  useEffect(() => {
    setActiveIndex(selectedImage);
  }, [selectedImage]);
  
  if (images.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img 
          src={images[activeIndex]} 
          alt={`Product image ${activeIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/600x800/f5f5f5/666666?text=Image+Not+Found";
          }}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={() => handleImageSelect(activeIndex === 0 ? images.length - 1 : activeIndex - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 hover:bg-white transition-colors group"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-black group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => handleImageSelect(activeIndex === images.length - 1 ? 0 : activeIndex + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 hover:bg-white transition-colors group"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-black group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 text-sm font-light tracking-wide">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>
      
      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button 
              key={index}
              onClick={() => handleImageSelect(index)}
              className={`flex-shrink-0 aspect-square w-20 overflow-hidden border-2 transition-all duration-300 ${
                index === activeIndex 
                  ? 'border-black scale-105' 
                  : 'border-gray-200 hover:border-gray-400 hover:scale-105'
              }`}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/80x80/f5f5f5/666666?text=Thumb";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}