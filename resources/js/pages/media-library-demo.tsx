import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { Upload, Search, X, Plus, Info, Copy, Download, MoreHorizontal, Image as ImageIcon, Calendar, HardDrive, BarChart3 } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

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

export default function MediaLibraryDemo() {
  const { t } = useTranslation();
  const { csrf_token } = usePage().props as any;
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedMediaInfo, setSelectedMediaInfo] = useState<MediaItem | null>(null);
  const itemsPerPage = 12;

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
      
      // Debug: Log first media item to check URLs
      if (data && data.length > 0) {
        console.log('Media loaded:', data.length, 'items');
        console.log('First item URLs:', {
          url: data[0].url,
          thumb_url: data[0].thumb_url,
          resolved_url: getImageUrl(data[0].url),
          resolved_thumb: getImageUrl(data[0].thumb_url || data[0].url)
        });
      }
      
      setMedia(data);
      setFilteredMedia(data);
    } catch (error) {
      console.error('Failed to load media:', error);
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);



  useEffect(() => {
    const filtered = media.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.file_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedia(filtered);
    setCurrentPage(1);
  }, [searchTerm, media]);



  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files[]', file);
    });
    
    try {
      const response = await fetch(route('api.media.batch'), {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
        headers: {
          'X-CSRF-TOKEN': csrf_token,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setMedia(prev => [...result.data, ...prev]);
        toast.success(result.message);
        
        // Show individual errors if any
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach((error: string) => {
            toast.error(error);
          });
        }
      } else {
        // Show individual errors if available, otherwise show main message
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach((error: string) => {
            toast.error(error);
          });
        } else {
          toast.error(result.message || 'Failed to upload files');
        }
      }
    } catch (error) {
      toast.error('Error uploading files');
    }
    
    setUploading(false);
    setIsUploadModalOpen(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const deleteMedia = async (id: number) => {
    try {
      const response = await fetch(route('api.media.destroy', id), {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'X-CSRF-TOKEN': csrf_token,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      
      if (response.ok) {
        setMedia(prev => prev.filter(item => item.id !== id));
        toast.success('Media deleted successfully');
      } else {
        toast.error('Failed to delete media');
      }
    } catch (error) {
      toast.error('Error deleting media');
    }
  };

  const handleCopyLink = (url: string) => {
    // Normalize URL - remove double slashes and ensure it starts with /
    let normalizedUrl = url.replace(/\/+/g, '/');
    if (!normalizedUrl.startsWith('/')) {
      normalizedUrl = '/' + normalizedUrl;
    }
    // Get full URL for copying
    const fullUrl = getImageUrl(normalizedUrl);
    navigator.clipboard.writeText(fullUrl);
    toast.success('Image URL copied to clipboard');
  };
  
  const normalizeUrl = (url: string): string => {
    // Remove double slashes and ensure it starts with /
    let normalized = url.replace(/\/+/g, '/');
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }
    return normalized;
  };

  const handleDownload = (id: number, filename: string) => {
    const link = document.createElement('a');
    link.href = route('api.media.download', id);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started');
  };

  const handleShowInfo = (item: MediaItem) => {
    setSelectedMediaInfo(item);
    setInfoModalOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMedia = filteredMedia.slice(startIndex, startIndex + itemsPerPage);

  const breadcrumbs = [
    { title: t('Dashboard'), href: '/dashboard' },
    { title: 'Media Library' }
  ];

  const pageActions = [
    {
      label: t('Upload Media'),
      icon: <Plus className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => setIsUploadModalOpen(true)
    }
  ];

  return (
    <PageTemplate 
      title={t('Media Library')} 
      url="/media-library"
      breadcrumbs={breadcrumbs}
      actions={pageActions}
    >
      <div className="space-y-6">

        {/* Search and Stats Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Section */}
              <div className="flex-1">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t('Search media files...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {searchTerm && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('Showing results for "{{term}}"', { term: searchTerm })}
                  </p>
                )}
              </div>
              
              {/* Stats Section */}
              <div className="flex gap-6 items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <ImageIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{filteredMedia.length} {t('Files')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-500/10 rounded-md">
                    <HardDrive className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold">
                    {formatFileSize(filteredMedia.reduce((acc, item) => acc + item.size, 0))}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/10 rounded-md">
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold">
                    {filteredMedia.filter(item => item.mime_type.startsWith('image/')).length} {t('Images')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Grid */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('Loading media...')}</p>
              </div>
            ) : currentMedia.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('No media files found')}</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? t('No results found for "{{term}}"', { term: searchTerm }) : t('Get started by uploading your first media file')}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setIsUploadModalOpen(true)}
                    size="lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('Upload Media')}
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {currentMedia.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
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
                        
                        {/* Overlay with Actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
                        
                        {/* Action Dropdown */}
                        <div className="absolute top-2 right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 bg-background/95 hover:bg-background shadow-md"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => handleShowInfo(item)}>
                                <Info className="h-4 w-4 mr-2" />
                                {t('View Info')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopyLink(item.url)}>
                                <Copy className="h-4 w-4 mr-2" />
                                {t('Copy Link')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownload(item.id, item.file_name)}>
                                <Download className="h-4 w-4 mr-2" />
                                {t('Download')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => deleteMedia(item.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <X className="h-4 w-4 mr-2" />
                                {t('Delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        {/* File Type Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs bg-background/95">
                            {item.mime_type.split('/')[1].toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="p-3 space-y-2">
                        <div>
                          <h3 className="text-sm font-medium truncate" title={item.name}>
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <HardDrive className="h-3 w-3" />
                            {formatFileSize(item.size)}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
                    <div className="text-sm text-muted-foreground">
                      {t('Showing')} <span className="font-semibold">{startIndex + 1}</span> {t('to')} <span className="font-semibold">{Math.min(startIndex + itemsPerPage, filteredMedia.length)}</span> {t('of')} <span className="font-semibold">{filteredMedia.length}</span> {t('files')}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      >
                        {t('Previous')}
                      </Button>
                      
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              className="w-10 h-8"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      >
                        {t('Next')}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Upload Modal */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t('Upload Media Files')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className={`transition-all duration-200 ${
                  dragActive ? 'scale-110' : ''
                }`}>
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className={`h-8 w-8 transition-colors ${
                      dragActive ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {dragActive ? t('Drop files here') : t('Upload your files')}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {t('Drag and drop your files here, or click to browse')}
                  </p>
                  
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload-modal"
                  />
                  
                  <Button
                    type="button"
                    onClick={() => document.getElementById('file-upload-modal')?.click()}
                    disabled={uploading}
                    size="lg"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('Uploading...')}
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('Choose Files')}
                      </>
                    )}
                  </Button>
                </div>
                
                {dragActive && (
                  <div className="absolute inset-0 bg-blue-500/10 rounded-xl" />
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Info Modal */}
        <Dialog open={infoModalOpen} onOpenChange={setInfoModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                {t('Media Information')}
              </DialogTitle>
            </DialogHeader>
            
            {selectedMediaInfo && (
              <div className="space-y-6">
                {/* Image Preview */}
                <div className="flex justify-center bg-gray-50 rounded-lg p-4">
                  <img
                    src={getImageUrl(selectedMediaInfo.thumb_url || selectedMediaInfo.url)}
                    alt={selectedMediaInfo.name}
                    className="max-w-full h-48 object-contain rounded-md shadow-sm"
                    onError={(e) => {
                      const fallbackUrl = getImageUrl(selectedMediaInfo.url);
                      if (e.currentTarget.src !== fallbackUrl) {
                        e.currentTarget.src = fallbackUrl;
                      }
                    }}
                  />
                </div>
                
                {/* File Details */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-muted-foreground">{t('File Name')}</span>
                      <span className="text-sm text-right max-w-xs truncate" title={selectedMediaInfo.file_name}>
                        {selectedMediaInfo.file_name}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">{t('File Type')}</span>
                      <Badge variant="secondary">{selectedMediaInfo.mime_type}</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">{t('File Size')}</span>
                      <span className="text-sm">{formatFileSize(selectedMediaInfo.size)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">{t('Uploaded')}</span>
                      <span className="text-sm">{formatDate(selectedMediaInfo.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <span className="text-sm font-medium text-muted-foreground block mb-2">{t('URL')}</span>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <code className="text-xs text-muted-foreground flex-1 truncate">
                        {normalizeUrl(selectedMediaInfo.url)}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyLink(selectedMediaInfo.url)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleCopyLink(selectedMediaInfo.url)}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {t('Copy Link')}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload(selectedMediaInfo.id, selectedMediaInfo.file_name)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('Download')}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTemplate>
  );
}