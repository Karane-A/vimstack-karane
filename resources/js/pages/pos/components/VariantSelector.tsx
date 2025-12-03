import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/helpers';

interface VariantSelectorProps {
  product: any;
  open: boolean;
  onClose: () => void;
  onSelectVariant: (product: any, variant: any) => void;
}

function VariantSelector({ product, open, onClose, onSelectVariant }: VariantSelectorProps) {
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  // Reset selected options when dialog opens or product changes
  useEffect(() => {
    if (open && product && product.variants) {
      const initialOptions: Record<string, string> = {};
      
      // Check if variants is an array of objects with name and values
      if (Array.isArray(product.variants) && product.variants.length > 0 && product.variants[0]?.name) {
        product.variants.forEach((variant: any) => {
          if (variant?.values && variant.values.length > 0) {
            initialOptions[variant.name] = variant.values[0];
          }
        });
      }
      
      setSelectedOptions(initialOptions);
    }
  }, [product, open]);

  // Generate a unique variant ID based on selected options
  const generateVariantId = () => {
    return Object.values(selectedOptions).join('-');
  };

  // Generate a variant name based on selected options
  const generateVariantName = () => {
    return Object.entries(selectedOptions)
      .map(([name, value]) => `${name}: ${value}`)
      .join(', ');
  };

  // Check if the product has attribute-based variants
  const hasAttributeVariants = () => {
    return Array.isArray(product?.variants) && 
           product.variants.length > 0 && 
           product.variants[0]?.name !== undefined;
  };

  // Handle adding the selected variant to cart
  const handleAddToCart = () => {
    if (hasAttributeVariants()) {
      // Create a variant object from selected options
      const variant = {
        id: generateVariantId(),
        name: generateVariantName(),
        price: product.price // Use product price for attribute-based variants
      };
      onSelectVariant(product, variant);
    } else if (Array.isArray(product.variants) && product.variants.length > 0) {
      // Use the first variant if no specific one is selected
      onSelectVariant(product, product.variants[0]);
    }
  };

  // Handle option change
  const handleOptionChange = (variantName: string, value: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [variantName]: value
    });
  };

  if (!product) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('Select Variant')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">{t('No product selected.')}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Select {{name}} Variant', { name: product.name })}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {hasAttributeVariants() ? (
            // Attribute-based variants (like color: red, green)
            <div className="space-y-4">
              {product.variants.map((variant: any, index: number) => (
                <div key={index} className="space-y-2">
                  <Label>{variant.name}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {variant.values?.map((value: string, i: number) => (
                      <Button
                        key={i}
                        variant={selectedOptions[variant.name] === value ? "default" : "outline"}
                        onClick={() => handleOptionChange(variant.name, value)}
                        className="capitalize"
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  {t('Selected')}: {generateVariantName()}
                </p>
                <p className="text-sm font-medium">
                  {t('Price')}: {formatCurrency(parseFloat(product.price))}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">{t('No variants available for this product.')}</p>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>{t('Cancel')}</Button>
          <Button 
            onClick={handleAddToCart}
            disabled={!hasAttributeVariants() && (!Array.isArray(product?.variants) || product?.variants.length === 0)}
          >
            {t('Add to Cart')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VariantSelector;