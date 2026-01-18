import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/custom-toast';
import { usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { Search, Image as ImageIcon, Check } from 'lucide-react';

interface MediaItem {
  id: number;
  name: string;
  file_name: string;
  url: string;
  thumb_url: string;
  size: number;
  mime_type: string;
  created_at: string;
}

interface MediaLibraryButtonProps {
  onSelect: (url: string) => void;
  buttonText?: string;
  selectedUrl?: string;
}

export default function MediaLibraryButton({ 
  onSelect, 
  buttonText = "Browse Media",
  selectedUrl 
}: MediaLibraryButtonProps) {
  const { csrf_token } = usePage().props as any;
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(route('api.media.index'), {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMedia(data);
    } catch (error) {
      console.error('Failed to load media:', error);
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    fetchMedia();
  };

  const handleSelect = (url: string) => {
    // Convert full URL to relative path for storage
    const getRelativePath = (fullUrl: string) => {
      if (!fullUrl.startsWith('http')) {
        return fullUrl; // Already relative
      }
      
      // Extract the path after the domain
      try {
        const urlObj = new URL(fullUrl);
        let pathname = urlObj.pathname;
        
        // Remove any project path prefix to get clean /storage/media path
        if (pathname.includes('/storage/media/')) {
          const storageIndex = pathname.indexOf('/storage/media/');
          pathname = pathname.substring(storageIndex);
        }
        
        return pathname;
      } catch {
        return fullUrl;
      }
    };
    
    onSelect(getRelativePath(url));
    setIsOpen(false);
    toast.success('Image selected successfully');
  };

  const filteredMedia = media.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={handleOpen}>
        <ImageIcon className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Select Image from Media Library
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Media Grid */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading media...</p>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No images found' : 'No media files available'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredMedia.map((item) => (
                    <div
                      key={item.id}
                      className={`group relative bg-card border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 ${
                        selectedUrl === item.url ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleSelect(item.url)}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square bg-muted">
                        <img
                          src={getImageUrl(item.thumb_url || item.url)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const fallbackUrl = getImageUrl(item.url);
                            if (e.currentTarget.src !== fallbackUrl) {
                              e.currentTarget.src = fallbackUrl;
                            }
                          }}
                        />
                        
                        {/* Selected Indicator */}
                        {selectedUrl === item.url && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary text-white rounded-full p-2">
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
                        
                        {/* File Type Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs bg-background/95">
                            {item.mime_type.split('/')[1].toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="p-3">
                        <h3 className="text-sm font-medium truncate" title={item.name}>
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.round(item.size / 1024)} KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}