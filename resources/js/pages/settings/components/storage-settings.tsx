import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Save, HardDrive } from 'lucide-react';
import { SettingsSection } from '@/components/settings-section';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';

type StorageType = 'local' | 'aws_s3' | 'wasabi';

interface StorageSettings {
  storageType: StorageType;
  // Local Storage
  allowedFileTypes: string;
  maxUploadSize: string;
  // AWS S3
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsDefaultRegion: string;
  awsBucket: string;
  awsUrl: string;
  awsEndpoint: string;
  // Wasabi
  wasabiAccessKey: string;
  wasabiSecretKey: string;
  wasabiRegion: string;
  wasabiBucket: string;
  wasabiUrl: string;
  wasabiRoot: string;
}

interface StorageSettingsProps {
  settings?: Record<string, string>;
}

export default function StorageSettings({ settings = {} }: StorageSettingsProps) {
  const { t } = useTranslation();
  
  const fileExtensions = {
    '3dmf': '3dmf',
'3dm': '3dm',
'avi': 'avi',
'ai': 'ai',
'bin': 'bin',
'bmp': 'bmp',
'cab': 'cab',
'c': 'c',
'c++': 'c++',
'class': 'class',
'css': 'css',
'csv': 'csv',
'cdr': 'cdr',
'doc': 'doc',
'dot': 'dot',
'docx': 'docx',
'dwg': 'dwg',
'eps': 'eps',
'exe': 'exe',
'gif': 'gif',
'gz': 'gz',
'gtar': 'gtar',
'flv': 'flv',
'fh4': 'fh4',
'fh5': 'fh5',
'fhc': 'fhc',
'help': 'help',
'hlp': 'hlp',
'html': 'html',
'htm': 'htm',
'ico': 'ico',
'imap': 'imap',
'inf': 'inf',
'jpe': 'jpe',
'jpeg': 'jpeg',
'jpg': 'jpg',
'js': 'js',
'java': 'java',
'latex': 'latex',
'log': 'log',
'm3u': 'm3u',
'midi': 'midi',
'mid': 'mid',
'mov': 'mov',
'mp4': 'mp4',
'mp3': 'mp3',
'mpeg': 'mpeg',
'mpg': 'mpg',
'mp2': 'mp2',
'ogg': 'ogg',
'phtml': 'phtml',
'php': 'php',
'pdf': 'pdf',
'pgp': 'pgp',
'png': 'png',
'pps': 'pps',
'ppt': 'ppt',
'ppz': 'ppz',
'pot': 'pot',
'ps': 'ps',
'qt': 'qt',
'qd3d': 'qd3d',
'qd3': 'qd3',
'qxd': 'qxd',
'rar': 'rar',
'ra': 'ra',
'ram': 'ram',
'rm': 'rm',
'rtf': 'rtf',
'spr': 'spr',
'sprite': 'sprite',
'stream': 'stream',
'swf': 'swf',
'svg': 'svg',
'sgml': 'sgml',
'sgm': 'sgm',
'tar': 'tar',
'tiff': 'tiff',
'tif': 'tif',
'tgz': 'tgz',
'tex': 'tex',
'txt': 'txt',
'vob': 'vob',
'wav': 'wav',
'wrl': 'wrl',
'xla': 'xla',
'xls': 'xls',
'xlc': 'xlc',
'xml': 'xml',
'zip': 'zip',
'json': 'json',
'webp': 'webp'
  };
  
  const [storageSettings, setStorageSettings] = useState<StorageSettings>({
    storageType: (settings.storage_type as StorageType) || 'local',
    allowedFileTypes: settings.storage_file_types || 'jpg,png,webp,gif',
    maxUploadSize: settings.storage_max_upload_size || '2048',
    awsAccessKeyId: settings.aws_access_key_id || '',
    awsSecretAccessKey: settings.aws_secret_access_key || '',
    awsDefaultRegion: settings.aws_default_region || 'us-east-1',
    awsBucket: settings.aws_bucket || '',
    awsUrl: settings.aws_url || '',
    awsEndpoint: settings.aws_endpoint || '',
    wasabiAccessKey: settings.wasabi_access_key || '',
    wasabiSecretKey: settings.wasabi_secret_key || '',
    wasabiRegion: settings.wasabi_region || 'us-east-1',
    wasabiBucket: settings.wasabi_bucket || '',
    wasabiUrl: settings.wasabi_url || '',
    wasabiRoot: settings.wasabi_root || ''
  });

  const handleSettingChange = (field: keyof StorageSettings, value: string) => {
    setStorageSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileTypeChange = (extension: string, checked: boolean) => {
    const currentTypes = storageSettings.allowedFileTypes.split(',').filter(type => type.trim());
    let newTypes;
    
    if (checked) {
      newTypes = [...currentTypes, extension];
    } else {
      newTypes = currentTypes.filter(type => type !== extension);
    }
    
    setStorageSettings(prev => ({
      ...prev,
      allowedFileTypes: newTypes.join(',')
    }));
  };

  const submitStorageSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: any = {
      storage_type: storageSettings.storageType,
      allowedFileTypes: storageSettings.allowedFileTypes,
      maxUploadSize: storageSettings.maxUploadSize,
    };

    if (storageSettings.storageType === 'aws_s3') {
      formData.awsAccessKeyId = storageSettings.awsAccessKeyId;
      formData.awsSecretAccessKey = storageSettings.awsSecretAccessKey;
      formData.awsDefaultRegion = storageSettings.awsDefaultRegion;
      formData.awsBucket = storageSettings.awsBucket;
      formData.awsUrl = storageSettings.awsUrl;
      formData.awsEndpoint = storageSettings.awsEndpoint;
    }

    if (storageSettings.storageType === 'wasabi') {
      formData.wasabiAccessKey = storageSettings.wasabiAccessKey;
      formData.wasabiSecretKey = storageSettings.wasabiSecretKey;
      formData.wasabiRegion = storageSettings.wasabiRegion;
      formData.wasabiBucket = storageSettings.wasabiBucket;
      formData.wasabiUrl = storageSettings.wasabiUrl;
      formData.wasabiRoot = storageSettings.wasabiRoot;
    }
    
    router.post(route('settings.storage.update'), formData, {
      preserveScroll: true,
      onError: (errors) => {
        const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to update storage settings');
        toast.error(errorMessage);
      }
    });
  };

  const renderFileTypeSelector = () => (
    <div className="space-y-2">
      <Label>{t("Allowed File Types")}</Label>
      <div className="grid grid-cols-4 gap-2 p-4 border rounded-md max-h-48 overflow-y-auto">
        {Object.keys(fileExtensions).map((ext) => (
          <div key={ext} className="flex items-center space-x-2">
            <Checkbox
              id={ext}
              checked={storageSettings.allowedFileTypes.split(',').includes(ext)}
              onCheckedChange={(checked) => handleFileTypeChange(ext, checked as boolean)}
            />
            <Label htmlFor={ext} className="text-sm font-normal">{ext}</Label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLocalStorageFields = () => (
    <div className="space-y-6">
      {renderFileTypeSelector()}
      
      <div className="space-y-2">
        <Label htmlFor="maxUploadSize">{t("Max Upload Size (KB)")}</Label>
        <Input
          id="maxUploadSize"
          type="number"
          value={storageSettings.maxUploadSize}
          onChange={(e) => handleSettingChange('maxUploadSize', e.target.value)}
          placeholder="2048"
        />
      </div>
    </div>
  );

  const renderAwsS3Fields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="awsAccessKeyId">{t("AWS Access Key ID")}</Label>
          <Input
            id="awsAccessKeyId"
            value={storageSettings.awsAccessKeyId}
            onChange={(e) => handleSettingChange('awsAccessKeyId', e.target.value)}
            placeholder="AKIAIOSFODNN7EXAMPLE"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="awsSecretAccessKey">{t("AWS Secret Access Key")}</Label>
          <Input
            id="awsSecretAccessKey"
            type="password"
            value={storageSettings.awsSecretAccessKey}
            onChange={(e) => handleSettingChange('awsSecretAccessKey', e.target.value)}
            placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="awsDefaultRegion">{t("AWS Default Region")}</Label>
          <Input
            id="awsDefaultRegion"
            value={storageSettings.awsDefaultRegion}
            onChange={(e) => handleSettingChange('awsDefaultRegion', e.target.value)}
            placeholder="us-east-1"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="awsBucket">{t("AWS Bucket")}</Label>
          <Input
            id="awsBucket"
            value={storageSettings.awsBucket}
            onChange={(e) => handleSettingChange('awsBucket', e.target.value)}
            placeholder="my-bucket-name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="awsUrl">{t("AWS URL")}</Label>
          <Input
            id="awsUrl"
            value={storageSettings.awsUrl}
            onChange={(e) => handleSettingChange('awsUrl', e.target.value)}
            placeholder="https://s3.amazonaws.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="awsEndpoint">{t("AWS Endpoint")}</Label>
          <Input
            id="awsEndpoint"
            value={storageSettings.awsEndpoint}
            onChange={(e) => handleSettingChange('awsEndpoint', e.target.value)}
            placeholder="https://s3.us-east-1.amazonaws.com"
          />
        </div>
      </div>
      
      <div className="space-y-6">
        {renderFileTypeSelector()}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
          <div className="space-y-2">
            <Label htmlFor="awsMaxUploadSize">{t("Max Upload Size (KB)")}</Label>
            <Input
              id="awsMaxUploadSize"
              type="number"
              value={storageSettings.maxUploadSize}
              onChange={(e) => handleSettingChange('maxUploadSize', e.target.value)}
              placeholder="2048"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderWasabiFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="wasabiAccessKey">{t("Wasabi Access Key")}</Label>
          <Input
            id="wasabiAccessKey"
            value={storageSettings.wasabiAccessKey}
            onChange={(e) => handleSettingChange('wasabiAccessKey', e.target.value)}
            placeholder="AKIAIOSFODNN7EXAMPLE"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wasabiSecretKey">{t("Wasabi Secret Key")}</Label>
          <Input
            id="wasabiSecretKey"
            type="password"
            value={storageSettings.wasabiSecretKey}
            onChange={(e) => handleSettingChange('wasabiSecretKey', e.target.value)}
            placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wasabiRegion">{t("Wasabi Region")}</Label>
          <Input
            id="wasabiRegion"
            value={storageSettings.wasabiRegion}
            onChange={(e) => handleSettingChange('wasabiRegion', e.target.value)}
            placeholder="us-east-1"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wasabiBucket">{t("Wasabi Bucket")}</Label>
          <Input
            id="wasabiBucket"
            value={storageSettings.wasabiBucket}
            onChange={(e) => handleSettingChange('wasabiBucket', e.target.value)}
            placeholder="my-wasabi-bucket"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wasabiUrl">{t("Wasabi URL")}</Label>
          <Input
            id="wasabiUrl"
            value={storageSettings.wasabiUrl}
            onChange={(e) => handleSettingChange('wasabiUrl', e.target.value)}
            placeholder="https://s3.wasabisys.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wasabiRoot">{t("Wasabi Root")}</Label>
          <Input
            id="wasabiRoot"
            value={storageSettings.wasabiRoot}
            onChange={(e) => handleSettingChange('wasabiRoot', e.target.value)}
            placeholder="/"
          />
        </div>
      </div>
      
      <div className="space-y-6">
        {renderFileTypeSelector()}
        <div className="space-y-2">
          <Label htmlFor="wasabiMaxUploadSize">{t("Max Upload Size (KB)")}</Label>
          <Input
            id="wasabiMaxUploadSize"
            type="number"
            value={storageSettings.maxUploadSize}
            onChange={(e) => handleSettingChange('maxUploadSize', e.target.value)}
            placeholder="2048"
          />
        </div>
      </div>
    </div>
  );

  return (
    <SettingsSection
      title={t("Storage Settings")}
      description={t("Configure file storage settings for your application")}
      action={
        <Button type="submit" form="storage-settings-form" size="sm">
          <Save className="h-4 w-4 mr-2" />
          {t("Save Changes")}
        </Button>
      }
    >
      <form id="storage-settings-form" onSubmit={submitStorageSettings}>
        <Tabs 
          value={storageSettings.storageType}
          className="w-full"
          onValueChange={(value) => setStorageSettings(prev => ({ ...prev, storageType: value as StorageType }))}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="local" className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              {t("Local Storage")}
            </TabsTrigger>
            <TabsTrigger value="aws_s3" className="flex items-center gap-2">
              <span>☁️</span>
              {t("AWS S3")}
            </TabsTrigger>
            <TabsTrigger value="wasabi" className="flex items-center gap-2">
              <span>🗄️</span>
              {t("Wasabi")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="local" className="mt-6">
            <h3 className="text-base font-medium mb-4">{t("Local Storage Settings")}</h3>
            {renderLocalStorageFields()}
          </TabsContent>
          
          <TabsContent value="aws_s3" className="mt-6">
            <h3 className="text-base font-medium mb-4">{t("AWS S3 Storage Settings")}</h3>
            {renderAwsS3Fields()}
          </TabsContent>
          
          <TabsContent value="wasabi" className="mt-6">
            <h3 className="text-base font-medium mb-4">{t("Wasabi Storage Settings")}</h3>
            {renderWasabiFields()}
          </TabsContent>
        </Tabs>
      </form>
    </SettingsSection>
  );
}