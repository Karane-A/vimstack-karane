import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Phone, Layout, MapPin } from 'lucide-react';

export default function ContactSection({ data, setData, errors, handleInputChange }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <Layout className="h-5 w-5 mr-2 text-muted-foreground" />
          <h3 className="text-base font-medium">Contact Layout</h3>
        </div>
        <Separator className="my-2" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label htmlFor="contact_layout">Layout Style</Label>
            <select
              id="contact_layout"
              name="contact_layout"
              value={data.contact_layout || 'split'}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="split">Split (Form + Info)</option>
              <option value="full-width">Full Width Form</option>
              <option value="centered">Centered Content</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="contact_background_color">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="contact_background_color"
                name="contact_background_color"
                type="color"
                value={data.contact_background_color || '#f9fafb'}
                onChange={handleInputChange}
                className="w-16 h-10 p-1"
              />
              <Input
                name="contact_background_color"
                value={data.contact_background_color || '#f9fafb'}
                onChange={handleInputChange}
                placeholder="#f9fafb"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
          <h3 className="text-base font-medium">Contact Information</h3>
        </div>
        <Separator className="my-2" />
        
        <div className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              value={data.contact_email}
              onChange={handleInputChange}
              placeholder="contact@yourcompany.com"
            />
            {errors.contact_email && (
              <p className="text-red-600 text-sm">{errors.contact_email}</p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="contact_phone">Contact Phone</Label>
            <Input
              id="contact_phone"
              name="contact_phone"
              value={data.contact_phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
            />
            {errors.contact_phone && (
              <p className="text-red-600 text-sm">{errors.contact_phone}</p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="contact_address">Contact Address</Label>
            <Input
              id="contact_address"
              name="contact_address"
              value={data.contact_address}
              onChange={handleInputChange}
              placeholder="City, State"
            />
            {errors.contact_address && (
              <p className="text-red-600 text-sm">{errors.contact_address}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
          <h3 className="text-base font-medium">Map Settings</h3>
        </div>
        <Separator className="my-2" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="contact_show_map">Show Map</Label>
              <Switch
                id="contact_show_map"
                name="contact_show_map"
                checked={data.contact_show_map || false}
                onCheckedChange={(checked) => setData('contact_show_map', checked)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Display a map in the contact section
            </p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="contact_map_location">Map Location</Label>
            <Input
              id="contact_map_location"
              name="contact_map_location"
              value={data.contact_map_location || ''}
              onChange={handleInputChange}
              placeholder="San Francisco, CA"
              disabled={!data.contact_show_map}
            />
          </div>
        </div>
      </div>
    </div>
  );
}