import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  SettingsIcon, Type, Image, Globe, Monitor, Award, Info, Users, 
  CreditCard, HelpCircle, Mail, Phone, Layout, ArrowUpDown, Code 
} from 'lucide-react';

interface SectionNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  t: (key: string) => string;
}

const sectionGroups = [
  {
    title: 'Setup',
    sections: [
      { key: 'general', label: 'General', icon: SettingsIcon },
      { key: 'order', label: 'Order', icon: ArrowUpDown },
      { key: 'advanced', label: 'Advanced', icon: Code }
    ]
  },
  {
    title: 'Layout',
    sections: [
      { key: 'header', label: 'Header', icon: Type },
      { key: 'hero', label: 'Hero', icon: Image },
      { key: 'footer', label: 'Footer', icon: Layout }
    ]
  },
  {
    title: 'Content',
    sections: [
      { key: 'features', label: 'Features', icon: Globe },
      { key: 'screenshots', label: 'Screenshots', icon: Monitor },
      { key: 'whychooseus', label: 'Why Us', icon: Award },
      { key: 'about', label: 'About', icon: Info }
    ]
  },
  {
    title: 'Social',
    sections: [
      { key: 'team', label: 'Team', icon: Users },
      { key: 'testimonials', label: 'Reviews', icon: Award },
      { key: 'plans', label: 'Plans', icon: CreditCard }
    ]
  },
  {
    title: 'Engagement',
    sections: [
      { key: 'faq', label: 'FAQ', icon: HelpCircle },
      { key: 'newsletter', label: 'Newsletter', icon: Mail },
      { key: 'contact', label: 'Contact', icon: Phone }
    ]
  }
];

export default function SectionNavigation({ activeSection, onSectionChange, t }: SectionNavigationProps) {
  return (
    <div className="mb-8">
      {/* Mobile Dropdown */}
      <div className="block lg:hidden mb-4">
        <select
          value={activeSection}
          onChange={(e) => onSectionChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white"
        >
          {sectionGroups.map(group => (
            <optgroup key={group.title} label={group.title}>
              {group.sections.map(section => (
                <option key={section.key} value={section.key}>
                  {t(section.label)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Desktop Grouped Navigation */}
      <div className="hidden lg:block space-y-4">
        {sectionGroups.map(group => (
          <div key={group.title}>
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">
              {group.title}
            </div>
            <div className="flex flex-wrap gap-2">
              {group.sections.map(section => {
                const Icon = section.icon;
                const isActive = activeSection === section.key;
                
                return (
                  <Button
                    key={section.key}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => onSectionChange(section.key)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {t(section.label)}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}