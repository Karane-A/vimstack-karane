/**
 * Helper function to ensure all required sections are displayed in templates
 */
export function ensureRequiredSections(configSections: any, defaultSections: any = {}) {
  // List of required sections that should always be displayed
  const requiredSectionKeys = [
    'about',
    'social',
    'contact',
    'business_hours',
    'appointments',
    'services',
    'testimonials',
    'google_map',
    'app_download',
    'contact_form',
    'thank_you',
    'copyright'
  ];
  
  // Create a new object with all required sections
  const enhancedSections = { ...configSections };
  
  // Ensure each required section exists with at least an empty object
  requiredSectionKeys.forEach(key => {
    if (!enhancedSections[key] || typeof enhancedSections[key] !== 'object') {
      enhancedSections[key] = defaultSections[key] || {};
    }
    
    // Make sure the section is not disabled
    if (enhancedSections[key].enabled === false) {
      enhancedSections[key].enabled = true;
    }
  });
  
  return enhancedSections;
}