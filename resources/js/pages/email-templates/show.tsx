import { useState, useEffect, useRef } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import { PageTemplate } from '@/components/page-template'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { RichTextField } from '@/components/ui/rich-text-field'
import { Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from '@/components/custom-toast'

interface EmailTemplateLang {
  id: number
  lang: string
  subject: string
  content: string
}

interface EmailTemplate {
  id: number
  name: string
  from: string
  email_template_langs: EmailTemplateLang[]
}

interface Language {
  code: string
  name: string
  countryCode: string
}

interface Props {
  template: EmailTemplate
  languages: Language[]
  variables: Record<string, string>
}

export default function EmailTemplateShow({ template, languages, variables }: Props) {
  const { t } = useTranslation()
  const [fromName, setFromName] = useState(template.from)
  const [currentLang, setCurrentLang] = useState(languages[0]?.code || 'en')
  const [templateLangs, setTemplateLangs] = useState(() => {
    const langData = {} as Record<string, { subject: string; content: string }>
    
    // Initialize all languages with empty or existing data
    languages.forEach(language => {
      const existingLang = template.email_template_langs.find(tl => tl.lang === language.code)
      langData[language.code] = {
        subject: existingLang?.subject || '',
        content: existingLang?.content || ''
      }
    })
    
    return langData
  })

  const handleSubjectChange = (lang: string, subject: string) => {
    setTemplateLangs(prev => ({
      ...prev,
      [lang]: { 
        subject,
        content: prev[lang]?.content || ''
      }
    }))
  }

  const handleContentChange = (lang: string, content: string) => {
    setTemplateLangs(prev => ({
      ...prev,
      [lang]: { 
        subject: prev[lang]?.subject || '',
        content
      }
    }))
  }



  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Email Templates'), href: route('email-templates.index') },
    { title: template.name }
  ]

  const pageActions: any[] = []

  return (
    <PageTemplate
      title={template.name}
      url={route('email-templates.show', template.id)}
      breadcrumbs={breadcrumbs}
      actions={pageActions}
    >
      <Head title={`Edit Template - ${template.name}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">{t("Template Settings")}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{t("Configure your email template")}</p>
                </div>
                <Button 
                  onClick={() => {
                    router.put(route('email-templates.update-settings', template.id), {
                      from: fromName
                    })
                  }}
                  size="sm"
                  className="ml-4"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t("Save")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">{t("Template Name")}</Label>
                    <Badge variant="secondary" className="text-xs">{t("System Template")}</Badge>
                  </div>
                  <Input value={template.name} disabled className="bg-muted font-medium" />
                  <p className="text-xs text-muted-foreground">{t("This is a system template and cannot be renamed")}</p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="from" className="font-medium">{t("Sender Name")}</Label>
                  <Input
                    id="from"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    placeholder={t("e.g., StoreGo Support, Your Store Name")}
                    className="focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">{t("This name will appear as the email sender")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{t("Multi-Language Content")}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("Edit email content in multiple languages")}
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    const currentContent = templateLangs[currentLang]
                    if (currentContent) {
                      router.put(route('email-templates.update-content', template.id), {
                        lang: currentLang,
                        subject: currentContent.subject,
                        content: currentContent.content
                      })
                    }
                  }}
                  size="sm"
                  className="shrink-0"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t("Save Content")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue={languages[0]?.code} onValueChange={setCurrentLang} className="w-full">
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">{t("Choose Language to Edit")}</Label>
                  <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 h-auto p-0 bg-transparent">
                    {languages.map((language) => (
                      <TabsTrigger 
                        key={language.code} 
                        value={language.code} 
                        className="flex flex-col items-center p-3 border-2 border-muted data-[state=active]:border-primary data-[state=active]:bg-primary/5 rounded-lg hover:border-primary/50 transition-all duration-200 min-h-[60px] justify-center"
                      >
                        <span className="text-xs font-bold text-primary">{language.code.toUpperCase()}</span>
                        <span className="text-xs text-muted-foreground mt-1 text-center leading-tight">{language.name}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                {languages.map((language) => (
                  <TabsContent key={language.code} value={language.code} className="space-y-6 mt-0">
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Badge variant="default" className="text-xs px-2 py-0.5">
                            {language.code.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{language.name}</h3>
                          <p className="text-xs text-muted-foreground">{t("Editing content for {{language}}", { language: language.name })}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <Label htmlFor={`subject-${language.code}`} className="text-sm font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          {t("Email Subject Line")}
                        </Label>
                        <Input
                          id={`subject-${language.code}`}
                          value={templateLangs[language.code]?.subject || ''}
                          onChange={(e) => handleSubjectChange(language.code, e.target.value)}
                          placeholder={t("Enter a compelling subject line...")}
                          className="focus:ring-2 focus:ring-primary text-base"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          {t("Email Body Content")}
                        </Label>
                        <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-1">
                          <RichTextField
                            label=""
                            value={templateLangs[language.code]?.content || ''}
                            onChange={(content) => handleContentChange(language.code, content)}
                            placeholder={t("Write your email message here. Use variables from the sidebar to personalize...")}
                            className="min-h-[320px] border-0"
                          />
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                          <p className="text-xs text-amber-800 flex items-center gap-2">
                            <span>💡</span>
                            {t("Pro tip: Click variables in the sidebar to copy them instantly")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm sticky top-6">
            <CardHeader className="bg-gray-50/50 border-b pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">{t("Dynamic Variables")}</CardTitle>
                <Badge variant="outline" className="text-xs font-medium">
                  {Object.keys(variables).length} {t("available")}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t("Click any variable below to copy it instantly")}
              </p>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {Object.entries(variables).map(([variable, description]) => (
                  <div 
                    key={variable} 
                    className="group relative p-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-md border hover:border-primary/30 hover:shadow-sm cursor-pointer transition-all duration-200"
                    onClick={() => {
                      navigator.clipboard.writeText(variable)
                      toast.success(t('Copied: {{variable}}', { variable }))
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <code className="text-xs font-mono text-primary font-bold bg-primary/10 px-2 py-1 rounded border">
                          {variable}
                        </code>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          {description}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          {t("Copy")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">💡</span>
                  <div>
                    <p className="text-xs font-medium text-blue-900">{t("How it works")}</p>
                    <p className="text-xs text-blue-700 mt-1">
                      {t("Variables are automatically replaced with real data when emails are sent to customers.")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTemplate>
  )
}