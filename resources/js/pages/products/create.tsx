import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Upload, ChevronLeft, Package, DollarSign, Info, Layers, ListChecks } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { router, usePage, Head, Link } from '@inertiajs/react';
import MediaPicker from '@/components/MediaPicker';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { showToast } from '@/components/ui/toast-notification';

export default function CreateProduct() {
  const { t } = useTranslation();
  const { categories, taxes } = usePage().props as any;
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    specifications: '',
    details: '',
    price: '',
    sale_price: '',
    stock: 0,
    cover_image: '',
    images: '',
    category_id: '',
    tax_id: '',
    is_active: true,
    is_downloadable: false,
    downloadable_file: '',
  });
  const [customFields, setCustomFields] = useState([{ name: '', value: '' }]);
  const [variants, setVariants] = useState([{ name: '', values: [''] }]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    const productData = {
      ...formData,
      variants: variants.filter((v: any) => v.name.trim() !== ''),
      custom_fields: customFields.filter((f: any) => f.name.trim() !== '')
    };

    router.post(route('products.store'), productData, {
      onSuccess: () => showToast(t('Product created successfully'), 'success'),
      onError: () => showToast(t('Failed to create product'), 'error'),
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-[1200px] mx-auto pb-32">
      <Head title={t('Create Product')} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md py-4 -mx-4 px-4 rounded-b-2xl">
        <div className="flex items-center gap-4">
          <Link
            href={route('products.index')}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors bg-white"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">{t('Create New Product')}</h1>
            <p className="text-sm text-slate-500 hidden md:block">{t('Add a new item to your store inventory')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <Button variant="outline" className="rounded-xl h-11 px-4 md:px-6 font-bold flex-1 md:flex-none" onClick={() => router.visit(route('products.index'))}>
            {t('Cancel')}
          </Button>
          <Button variant="default" className="rounded-xl h-11 bg-indigo-600 hover:bg-indigo-700 font-bold px-4 md:px-8 shadow-lg shadow-indigo-100 flex-1 md:flex-none" onClick={handleSubmit}>
            <Save className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">{t('Save Product')}</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <div className="bg-white p-1 rounded-2xl border border-slate-200 mb-8 shadow-sm overflow-hidden">
          <TabsList className="bg-transparent gap-1 h-auto p-0 w-full justify-start">
            {[
              { id: 'general', label: t('General'), icon: Package },
              { id: 'pricing', label: t('Pricing'), icon: DollarSign },
              { id: 'inventory', label: t('Inventory'), icon: ListChecks },
              { id: 'content', label: t('Content'), icon: Info },
              { id: 'variants', label: t('Variants'), icon: Layers },
              { id: 'advanced', label: t('Advanced'), icon: Layers },
            ].map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-xl px-4 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-bold gap-2 text-slate-500 hover:text-slate-900 text-xs sm:text-sm whitespace-nowrap"
              >
                <tab.icon size={14} className="sm:size-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm min-h-[500px]">
          <TabsContent value="general" className="mt-0 outline-none space-y-10">
            <div className="max-w-3xl space-y-8">
              <section className="grid gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t('Product Name')} <span className="text-rose-500">*</span></Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('Enter product name')}
                      className="h-12 rounded-xl border-slate-200 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku" className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t('SKU')} <span className="text-rose-500">*</span></Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder={t('Product SKU')}
                      className="h-12 rounded-xl border-slate-200 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category_id" className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t('Category')} <span className="text-rose-500">*</span></Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => handleSelectChange('category_id', value)}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-slate-200">
                        <SelectValue placeholder={t('Select category')} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {categories?.map((category: any) => (
                          <SelectItem key={category.id} value={String(category.id)} className="rounded-lg">
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax_id" className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t('Product Tax')}</Label>
                    <Select
                      value={formData.tax_id}
                      onValueChange={(value) => handleSelectChange('tax_id', value)}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-slate-200">
                        <SelectValue placeholder={t('Select tax class')} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {taxes?.map((tax: any) => (
                          <SelectItem key={tax.id} value={String(tax.id)} className="rounded-lg">
                            {tax.name} ({tax.rate}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <Separator className="bg-slate-100" />

              <section className="grid gap-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t('Cover Image')} <span className="text-rose-500">*</span></Label>
                    <div className="bg-slate-50 rounded-2xl p-4 border-2 border-dashed border-slate-200 transition-colors hover:bg-slate-100">
                      <MediaPicker
                        value={formData.cover_image}
                        onChange={(value) => handleSelectChange('cover_image', value)}
                        placeholder={t('Choose cover...')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t('Gallery Images')}</Label>
                    <div className="bg-slate-50 rounded-2xl p-4 border-2 border-dashed border-slate-200 transition-colors hover:bg-slate-100">
                      <MediaPicker
                        value={formData.images}
                        onChange={(value) => handleSelectChange('images', value)}
                        multiple={true}
                        placeholder={t('Add images...')}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">{t('Product Display Status')}</h4>
                    <p className="text-sm text-slate-500">{t('Toggle whether this product is visible in your storefront')}</p>
                  </div>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="mt-0 outline-none space-y-8">
            <div className="max-w-2xl space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="price" className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t('Regular Price')} <span className="text-rose-500">*</span></Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 font-bold">$</div>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="h-14 pl-10 rounded-xl border-slate-200 text-lg font-black"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="sale_price" className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t('Sale Price')}</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 font-bold">$</div>
                    <Input
                      id="sale_price"
                      name="sale_price"
                      type="number"
                      step="0.01"
                      value={formData.sale_price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="h-14 pl-10 rounded-xl border-slate-200 text-lg font-black text-indigo-600"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Leave empty if not on sale')}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="mt-0 outline-none space-y-8">
            <div className="max-w-2xl space-y-8">
              <div className="space-y-3">
                <Label htmlFor="stock" className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t('Available Stock')} <span className="text-rose-500">*</span></Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="h-14 rounded-xl border-slate-200 text-lg font-black"
                />
              </div>

              <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-indigo-900">{t('Digital Product')}</h4>
                    <p className="text-sm text-indigo-700/70">{t('Is this a downloadable digital product?')}</p>
                  </div>
                  <Switch
                    checked={formData.is_downloadable}
                    onCheckedChange={(checked) => handleSwitchChange('is_downloadable', checked)}
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>

                {formData.is_downloadable && (
                  <div className="pt-4 border-t border-indigo-100">
                    <Label className="text-xs font-bold text-indigo-900 uppercase tracking-widest mb-3 block">{t('Source File')}</Label>
                    <MediaPicker
                      value={formData.downloadable_file}
                      onChange={(value) => handleSelectChange('downloadable_file', value)}
                      placeholder={t('Upload or select file...')}
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-0 outline-none space-y-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t('Product Description')}</Label>
                <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => handleSelectChange('description', value)}
                    placeholder={t('Write a compelling description...')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t('Technical Specifications')}</Label>
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                    <RichTextEditor
                      value={formData.specifications}
                      onChange={(value) => handleSelectChange('specifications', value)}
                      placeholder={t('Technical details, materials...')}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t('Additional Details')}</Label>
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                    <RichTextEditor
                      value={formData.details}
                      onChange={(value) => handleSelectChange('details', value)}
                      placeholder={t('Shipping info, care instructions...')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="variants" className="mt-0 outline-none space-y-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t('Product Variations')}</h3>
                <p className="text-sm text-slate-500">{t('Manage different sizes, colors, or options')}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold"
                onClick={() => setVariants([...variants, { name: '', values: [''] }])}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('Add Variant')}
              </Button>
            </div>

            <div className="grid gap-6">
              {variants.map((variant, index) => (
                <div key={index} className="bg-slate-50 rounded-[24px] p-6 border border-slate-200 relative group">
                  <button
                    type="button"
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-100 hover:text-rose-600 shadow-sm"
                    onClick={() => setVariants(variants.filter((_: any, i: number) => i !== index))}
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="grid gap-6">
                    <div className="max-w-md">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t('Variant Name')}</Label>
                      <Input
                        placeholder={t('e.g., Color, Size')}
                        value={variant.name}
                        onChange={(e) => {
                          const newVariants = [...variants];
                          newVariants[index].name = e.target.value;
                          setVariants(newVariants);
                        }}
                        className="h-11 rounded-xl border-slate-200"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t('Variant Values')}</Label>
                      <div className="flex flex-wrap gap-2">
                        {variant.values.map((value: string, valueIndex: number) => (
                          <div key={valueIndex} className="flex items-center gap-2">
                            <Input
                              placeholder={t('Value')}
                              value={value}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[index].values[valueIndex] = e.target.value;
                                setVariants(newVariants);
                              }}
                              className="h-10 rounded-xl border-slate-200 w-32"
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                          onClick={() => {
                            const newVariants = [...variants];
                            newVariants[index].values.push('');
                            setVariants(newVariants);
                          }}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-0 outline-none space-y-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t('Custom Metadata')}</h3>
                <p className="text-sm text-slate-500">{t('Add custom key-value pairs for additional information')}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold"
                onClick={() => setCustomFields([...customFields, { name: '', value: '' }])}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('Add Field')}
              </Button>
            </div>

            <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-200">
              <div className="space-y-4">
                {customFields.map((field, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <Input
                      placeholder={t('Field name')}
                      value={field.name}
                      onChange={(e) => {
                        const newFields = [...customFields];
                        newFields[index].name = e.target.value;
                        setCustomFields(newFields);
                      }}
                      className="h-11 rounded-xl border-slate-200 bg-white"
                    />
                    <Input
                      placeholder={t('Field value')}
                      value={field.value}
                      onChange={(e) => {
                        const newFields = [...customFields];
                        newFields[index].value = e.target.value;
                        setCustomFields(newFields);
                      }}
                      className="h-11 rounded-xl border-slate-200 bg-white"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-11 w-11 p-0 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      onClick={() => setCustomFields(customFields.filter((_: any, i: number) => i !== index))}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                {customFields.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-slate-400 font-bold">{t('No custom fields added yet')}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

CreateProduct.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;
