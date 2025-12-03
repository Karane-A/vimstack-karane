export interface SectionConfig {
  key: string;
  enabled: boolean;
  order: number;
}

export const getSectionOrder = (templateConfig: any, allSections: any[] = []): string[] => {
  const sectionSettings = templateConfig?.sectionSettings || {};
  
  const sectionsWithOrder = allSections.map((section, index) => {
    const settings = sectionSettings[section.key] || {};
    return {
      key: section.key,
      enabled: settings.enabled ?? true,
      order: settings.order ?? index
    };
  });

  return sectionsWithOrder
    .filter(section => section.enabled)
    .sort((a, b) => a.order - b.order)
    .map(section => section.key);
};

export const isSectionEnabled = (templateConfig: any, sectionKey: string): boolean => {
  const enabled = templateConfig?.sectionSettings?.[sectionKey]?.enabled;
  return enabled !== false;
};

export const getSectionData = (templateConfig: any, sectionKey: string): any => {
  return templateConfig?.sections?.[sectionKey] || {};
};