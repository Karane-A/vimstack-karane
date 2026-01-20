import React, { useState } from 'react';
import {
  ArrowLeft, Save, Plus, Trash2, Upload, ChevronLeft, Package,
  DollarSign, Info, Layers, ListChecks, Zap, Image as ImageIcon, Filter
} from 'lucide-react';
import { Popup } from 'antd-mobile';
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
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-50/50 pb-32">
      <Head title={t('Create Product')} />

      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 py-3 md:px-8 md:py-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4 font-sans">
            <Link
              href={route('products.index')}
              className="w-9 h-9 md:w-11 md:h-11 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all bg-white shadow-sm hover:shadow transition-all active:scale-95"
            >
              <ChevronLeft size={18} className="text-slate-600 md:size-5" />
            </Link>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">{t('Create Product')}</h1>
              <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest hidden md:block mt-0.5">{t('New Inventory Item')}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="rounded-xl h-11 px-6 font-bold text-slate-500 hover:bg-slate-100" onClick={() => router.visit(route('products.index'))}>
              {t('Cancel')}
            </Button>
            <Button variant="default" className="rounded-xl h-11 bg-slate-900 hover:bg-black text-white font-bold px-8 shadow-lg shadow-slate-200 transition-all active:scale-95" onClick={handleSubmit}>
              <Save size={18} className="mr-2" /> {t('Save Product')}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <Tabs defaultValue="general" className="w-full space-y-6 md:space-y-10">
          {/* Scrollable Tabs Wrapper */}
          <div className="sticky top-[60px] md:top-[92px] z-20 -mx-4 px-4 py-2 bg-slate-50/50 backdrop-blur-sm overflow-x-auto no-scrollbar">
            <TabsList className="bg-white/50 p-1 rounded-2xl border border-slate-200/60 shadow-sm w-fit inline-flex h-auto gap-1">
              {[
                { id: 'general', label: t('General'), icon: Package },
                { id: 'pricing', label: t('Pricing'), icon: DollarSign },
                { id: 'inventory', label: t('Stock'), icon: ListChecks },
                { id: 'content', label: t('Description'), icon: Info },
                { id: 'variants', label: t('Variants'), icon: Layers },
              ].map(tab => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-xl px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-100 transition-all font-bold gap-2 text-slate-500 hover:text-slate-900 text-xs sm:text-sm whitespace-nowrap"
                >
                  <tab.icon size={14} />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="space-y-6">
            <TabsContent value="general" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 md:p-10 shadow-sm space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t('Product Title')} <span className="text-rose-500">*</span></Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t('e.g. Wireless Noise Cancelling Headphones')}
                          className="h-14 rounded-2xl border-slate-200 focus:ring-indigo-600 focus:border-indigo-600 font-medium text-base md:text-lg px-5 shadow-sm bg-slate-50/30"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="category_id" className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t('Category')} <span className="text-rose-500">*</span></Label>

                          {/* Desktop View: Standard Select */}
                          <div className="hidden md:block">
                            <Select
                              value={formData.category_id}
                              onValueChange={(value) => handleSelectChange('category_id', value)}
                            >
                              <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/30 px-5 shadow-sm">
                                <SelectValue placeholder={t('Select Category')} />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                {categories?.map((category: any) => (
                                  <SelectItem key={category.id} value={String(category.id)} className="rounded-xl py-3 cursor-pointer">
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Mobile View: Bottom Sheet Selection */}
                          <div className="md:hidden">
                            <Button
                              variant="outline"
                              onClick={() => setIsCategoryPopupOpen(true)}
                              className="w-full h-14 rounded-2xl border-slate-200 bg-slate-50/30 px-5 flex items-center justify-between text-slate-600 shadow-sm"
                            >
                              <span className={cn(formData.category_id ? "text-slate-900" : "text-slate-400")}>
                                {formData.category_id
                                  ? categories?.find((c: any) => String(c.id) === formData.category_id)?.name
                                  : t('Select Category')}
                              </span>
                              <Filter size={16} className="text-slate-400" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="sku" className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t('Product SKU')}</Label>
                          <Input
                            id="sku"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            placeholder={t('WNC-2024-BLK')}
                            className="h-14 rounded-2xl border-slate-200 bg-slate-50/30 px-5 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <ImageIcon size={16} />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">{t('Product Visuals')}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t('Display Cover')}</Label>
                        <MediaPicker
                          value={formData.cover_image}
                          onChange={(value) => handleSelectChange('cover_image', value)}
                          placeholder={t('Select Main Image')}
                        />
                        <p className="text-[10px] text-slate-400 px-1 font-medium italic">{t('High quality JPEG/PNG recommended')}</p>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t('Photo Gallery')}</Label>
                        <MediaPicker
                          value={formData.images}
                          onChange={(value) => handleSelectChange('images', value)}
                          multiple={true}
                          placeholder={t('Add Multi-view Photos')}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 shadow-sm space-y-6">
                    <h4 className="font-bold text-slate-900">{t('Product Visibility')}</h4>
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-slate-700">{t('Active on Store')}</span>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t('Publicly Visible')}</p>
                      </div>
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 shadow-sm space-y-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                      <Zap size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900">{t('Need Help?')}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed px-4">{t('Use our detailed story tab to write compelling descriptions.')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 md:p-10 shadow-sm max-w-3xl">
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <DollarSign size={16} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{t('Pricing Strategy')}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                      <Label htmlFor="price" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t('Base Price')} <span className="text-rose-500">*</span></Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 text-xl font-black">$</div>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="h-16 pl-10 rounded-2xl border-slate-200 text-xl font-black bg-white shadow-sm focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                      <Label htmlFor="sale_price" className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] px-1">{t('Sale Price')}</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-primary/40 text-xl font-black">$</div>
                        <Input
                          id="sale_price"
                          name="sale_price"
                          type="number"
                          step="0.01"
                          value={formData.sale_price}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="h-16 pl-10 rounded-2xl border-primary/20 text-xl font-black text-primary bg-white shadow-sm focus:ring-primary/20"
                        />
                      </div>
                      <p className="text-[10px] font-bold text-primary/60 uppercase tracking-wider px-1">{t('Leave empty for regular price')}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">{t('Applicable Tax')}</h4>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t('Select tax percentage for this item')}</p>
                    </div>
                    <Select
                      value={formData.tax_id}
                      onValueChange={(value) => handleSelectChange('tax_id', value)}
                    >
                      <SelectTrigger className="h-12 w-full md:w-64 rounded-xl border-slate-200 bg-white">
                        <SelectValue placeholder={t('No Tax Applied')} />
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
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 md:p-10 shadow-sm space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                      <ListChecks size={16} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{t('Stock Control')}</h3>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="stock" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t('Initial Quantity Available')}</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      className="h-14 rounded-2xl border-slate-200 text-xl font-black bg-slate-50/30"
                    />
                    <p className="text-[10px] text-slate-400 font-medium px-1 italic">{t('Set to 0 to mark as Sold Out instantly')}</p>
                  </div>
                </div>

                <div className="bg-indigo-900 rounded-[32px] p-8 md:p-10 shadow-soft-indigo space-y-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 rounded-full -translate-y-16 translate-x-16 opacity-50 blur-2xl"></div>

                  <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-1">
                      <h4 className="font-bold text-xl">{t('Digital Delivery')}</h4>
                      <p className="text-sm text-indigo-300/80">{t('Sell downloadable files')}</p>
                    </div>
                    <Switch
                      checked={formData.is_downloadable}
                      onCheckedChange={(checked) => handleSwitchChange('is_downloadable', checked)}
                      className="data-[state=checked]:bg-white data-[state=checked]:text-indigo-900"
                    />
                  </div>

                  {formData.is_downloadable && (
                    <div className="pt-6 border-t border-white/10 space-y-4 relative z-10">
                      <Label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">{t('Select File')}</Label>
                      <div className="bg-white/10 rounded-2xl p-1">
                        <MediaPicker
                          value={formData.downloadable_file}
                          onChange={(value) => handleSelectChange('downloadable_file', value)}
                          placeholder={t('Upload PDF, ZIP, etc.')}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-white rounded-[40px] border border-slate-200/60 p-6 md:p-10 shadow-sm space-y-8 max-w-4xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Info size={16} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{t('Product Description')}</h3>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t('Description')}</Label>
                  <div className="bg-slate-50/50 rounded-2xl border border-slate-200/60 overflow-hidden shadow-inner">
                    <RichTextEditor
                      value={formData.description}
                      onChange={(value) => handleSelectChange('description', value)}
                      placeholder={t('Write a detailed product description...')}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 px-1 font-medium italic">{t('Include features, benefits, and specifications')}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="variants" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-white rounded-[40px] border border-slate-200/60 p-8 md:p-12 shadow-sm space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('Dynamic Options')}</h3>
                    <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">{t('Sizes, Colors, Materials')}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold h-12 px-6 shadow-sm shadow-indigo-50 shrink-0"
                    onClick={() => setVariants([...variants, { name: '', values: [''] }])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('New Option Group')}
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {variants.map((variant, index) => (
                    <div key={index} className="bg-slate-50/50 rounded-[32px] p-6 md:p-8 border border-slate-200/60 relative group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/20">
                      <button
                        type="button"
                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white hover:border-transparent shadow-lg active:scale-90"
                        onClick={() => setVariants(variants.filter((_: any, i: number) => i !== index))}
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('Option Name')}</Label>
                          <Input
                            placeholder={t('e.g. Size or Material')}
                            value={variant.name}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[index].name = e.target.value;
                              setVariants(newVariants);
                            }}
                            className="h-12 rounded-xl border-slate-200 bg-white"
                          />
                        </div>

                        <div className="space-y-4">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('Available Choices')}</Label>
                          <div className="flex flex-wrap gap-2">
                            {variant.values.map((value: string, valueIndex: number) => (
                              <div key={valueIndex} className="relative">
                                <Input
                                  placeholder={t('Value')}
                                  value={value}
                                  onChange={(e) => {
                                    const newVariants = [...variants];
                                    newVariants[index].values[valueIndex] = e.target.value;
                                    setVariants(newVariants);
                                  }}
                                  className="h-11 rounded-xl border-slate-200 w-32 bg-white pl-3 pr-8"
                                />
                                {variant.values.length > 1 && (
                                  <button
                                    onClick={() => {
                                      const newVariants = [...variants];
                                      newVariants[index].values.splice(valueIndex, 1);
                                      setVariants(newVariants);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-11 w-11 p-0 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50"
                              onClick={() => {
                                const newVariants = [...variants];
                                newVariants[index].values.push('');
                                setVariants(newVariants);
                              }}
                            >
                              <Plus size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>


          </div>
        </Tabs>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-[72px] left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 p-4 z-40">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="rounded-2xl h-14 font-bold text-slate-500 uppercase tracking-widest text-[10px] flex-1"
            onClick={() => router.visit(route('products.index'))}
          >
            {t('Discard')}
          </Button>
          <Button
            variant="default"
            className="rounded-2xl h-14 bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-[0.15em] text-[10px] flex-[2] shadow-xl shadow-slate-200 active:scale-95 transition-all"
            onClick={handleSubmit}
          >
            <Save size={16} className="mr-2" /> {t('Create Product')}
          </Button>
        </div>
      </div>
      {/* Category Selection Popup for Mobile */}
      <Popup
        visible={isCategoryPopupOpen}
        onClose={() => setIsCategoryPopupOpen(false)}
        position='bottom'
        bodyStyle={{
          height: '60vh',
          borderRadius: '32px 32px 0 0',
        }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />
          <h2 className="text-xl font-bold text-slate-900 mb-4">{t('Select Category')}</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {categories?.map((category: any) => (
              <button
                key={category.id}
                className={cn(
                  "w-full p-4 rounded-2xl text-left font-bold transition-all",
                  formData.category_id === String(category.id) ? "bg-primary text-white" : "bg-slate-50 text-slate-600"
                )}
                onClick={() => {
                  handleSelectChange('category_id', String(category.id));
                  setIsCategoryPopupOpen(false);
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </Popup>
    </div>
  );
}

CreateProduct.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;
