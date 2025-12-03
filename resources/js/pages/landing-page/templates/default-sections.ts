export const defaultLandingPageSections = {
  sections: [
    {
      key: 'header',
      transparent: false,
      background_color: '#ffffff',
      text_color: '#1f2937',
      button_style: 'gradient'
    },
    {
      key: 'hero',
      title: 'Create Your Digital Business Card in Minutes',
      subtitle: 'Transform your networking with professional digital business cards.',
      announcement_text: '🚀 New: Advanced Analytics Dashboard',
      primary_button_text: 'Start Free Trial',
      secondary_button_text: 'Login',
      image: '',
      background_color: '#f8fafc',
      text_color: '#1f2937',
      layout: 'image-right',
      height: 600,
      stats: [
        { value: '10K+', label: 'Active Users' },
        { value: '50+', label: 'Countries' },
        { value: '99%', label: 'Satisfaction' }
      ],
      card: {
        name: 'John Doe',
        title: 'Senior Developer',
        company: 'Tech Solutions Inc.',
        initials: 'JD'
      }
    },
    {
      key: 'features',
      title: 'Powerful Features for Modern Networking',
      description: 'Everything you need to create, share, and manage your digital business presence.',
      background_color: '#ffffff',
      layout: 'grid',
      columns: 3,
      image: '',
      show_icons: true,
      features_list: [
        {
          title: 'QR Code Generation',
          description: 'Generate unique QR codes for instant contact sharing.',
          icon: 'qr-code'
        },
        {
          title: 'NFC Technology',
          description: 'Tap-to-share functionality with NFC-enabled devices.',
          icon: 'smartphone'
        },
        {
          title: 'Analytics & Insights',
          description: 'Track views, clicks, and engagement metrics.',
          icon: 'bar-chart'
        }
      ]
    },
    {
      key: 'screenshots',
      title: 'See Store SaaS in Action',
      subtitle: 'Explore our intuitive interface and powerful features designed to streamline your digital networking experience.',
      screenshots_list: [
        {
          src: '/screenshots/hero.png',
          alt: 'Store SaaS Dashboard Overview',
          title: 'Dashboard Overview',
          description: 'Comprehensive dashboard with all your digital cards and analytics'
        },
        {
          src: '/screenshots/store-builder.png',
          alt: 'Store Builder Interface',
          title: 'Store Builder',
          description: 'Intuitive drag-and-drop builder for creating professional digital cards'
        }
      ]
    },
    {
      key: 'why_choose_us',
      title: 'Why Choose Store SaaS?',
      subtitle: 'We\'re not just another digital business card platform.',
      reasons: [
        { title: 'Quick Setup', description: 'Create your digital business card in under 5 minutes.', icon: 'clock' },
        { title: 'Professional Network', description: 'Join thousands of professionals using our platform.', icon: 'users' }
      ],
      stats: [
        { value: '10K+', label: 'Active Users', color: 'blue' },
        { value: '99%', label: 'Satisfaction', color: 'green' }
      ]
    },
    {
      key: 'templates',
      title: 'Explore Our Templates',
      subtitle: 'Choose from our professionally designed templates to create your perfect digital business card.',
      background_color: '#f8fafc',
      layout: 'grid',
      columns: 3,
      templates_list: [
        { name: 'freelancer', category: 'professional' },
        { name: 'doctor', category: 'medical' },
        { name: 'restaurant', category: 'food' },
        { name: 'realestate', category: 'business' },
        { name: 'fitness', category: 'health' },
        { name: 'photography', category: 'creative' },
        { name: 'lawfirm', category: 'professional' },
        { name: 'cafe', category: 'food' },
        { name: 'salon', category: 'beauty' },
        { name: 'construction', category: 'business' },
        { name: 'eventplanner', category: 'services' },
        { name: 'tech-startup', category: 'technology' }
      ],
      cta_text: 'View All Templates',
      cta_link: '#'
    },
    {
      key: 'about',
      title: 'About Store SaaS',
      description: 'We are passionate about transforming how professionals connect.',
      story_title: 'Empowering Professional Connections Since 2020',
      story_content: 'Founded by a team of networking enthusiasts and technology experts, Store SaaS was born from the frustration of outdated paper business cards.',
      image: '',
      background_color: '#f9fafb',
      layout: 'image-right',
      stats: [
        { value: '4+ Years', label: 'Experience', color: 'blue' },
        { value: '10K+', label: 'Happy Users', color: 'green' },
        { value: '50+', label: 'Countries', color: 'purple' }
      ]
    },
    {
      key: 'team',
      title: 'Meet Our Team',
      subtitle: 'We\'re a diverse team of innovators and problem-solvers.',
      cta_title: 'Want to Join Our Team?',
      cta_description: 'We\'re always looking for talented individuals.',
      cta_button_text: 'View Open Positions',
      members: [
        { name: 'Sarah Johnson', role: 'CEO & Founder', bio: 'Former tech executive with 15+ years experience.', image: '', linkedin: '#', email: 'sarah@Store SaaS.com' }
      ]
    },
    {
      key: 'testimonials',
      title: 'What Our Clients Say',
      subtitle: 'Don\'t just take our word for it.',
      trust_title: 'Trusted by Professionals Worldwide',
      trust_stats: [
        { value: '4.9/5', label: 'Average Rating', color: 'blue' },
        { value: '10K+', label: 'Happy Users', color: 'green' }
      ],
      testimonials: [
        { name: 'Alex Thompson', role: 'Sales Director', company: 'TechCorp Inc.', content: 'Store SaaS has revolutionized how I network.', rating: 5 }
      ]
    },
    {
      key: 'active_campaigns',
      title: 'Featured Business Promotions',
      subtitle: 'Explore businesses we\'re currently promoting and discover amazing services',
      background_color: '#f8fafc',
      show_view_all: true,
      max_display: 6
    },
    {
      key: 'plans',
      title: 'Choose Your Plan',
      subtitle: 'Start with our free plan and upgrade as you grow.',
      faq_text: 'Have questions about our plans? Contact our sales team'
    },
    {
      key: 'faq',
      title: 'Frequently Asked Questions',
      subtitle: 'Got questions? We\'ve got answers.',
      cta_text: 'Still have questions?',
      button_text: 'Contact Support',
      faqs: [
        { question: 'How does Store SaaS work?', answer: 'Store SaaS allows you to create digital business cards that can be shared via QR codes.' }
      ]
    },
    {
      key: 'newsletter',
      title: 'Stay Updated with Store SaaS',
      subtitle: 'Get the latest updates and networking tips.',
      privacy_text: 'No spam, unsubscribe at any time.',
      benefits: [
        { icon: '📧', title: 'Weekly Updates', description: 'Latest features and improvements' }
      ]
    },
    {
      key: 'contact',
      title: 'Get in Touch',
      subtitle: 'Have questions about Store SaaS? We\'d love to hear from you.',
      form_title: 'Send us a Message',
      info_title: 'Contact Information',
      info_description: 'We\'re here to help and answer any question you might have.',
      layout: 'split',
      background_color: '#f9fafb'
    },
    {
      key: 'footer',
      description: 'Transforming professional networking with innovative digital business cards.',
      newsletter_title: 'Stay Updated',
      newsletter_subtitle: 'Join our newsletter for updates',
      links: {
        product: [{ name: 'Features', href: '#features' }, { name: 'Pricing', href: '#pricing' }],
        company: [{ name: 'About Us', href: '#about' }, { name: 'Contact', href: '#contact' }]
      },
      social_links: [
        { name: 'Facebook', icon: 'Facebook', href: '#' },
        { name: 'Twitter', icon: 'Twitter', href: '#' }
      ],
      section_titles: {
        product: 'Product',
        company: 'Company'
      }
    }
  ],
  colors: {
    primary: '#10b981',
    secondary: '#059669',
    accent: '#065f46'
  },
  theme: {
    primary_color: '#10b981',
    secondary_color: '#ffffff',
    accent_color: '#f7f7f7',
    logo_light: '',
    logo_dark: '',
    favicon: ''
  },
  seo: {
    meta_title: 'Store SaaS - Digital Business Cards',
    meta_description: 'Create professional digital business cards in minutes.',
    meta_keywords: 'digital business cards, networking, QR codes, NFC'
  },
  custom_css: '',
  custom_js: '',
  section_order: ['header', 'hero', 'features', 'screenshots', 'why_choose_us', 'templates', 'about', 'team', 'testimonials', 'active_campaigns', 'plans', 'faq', 'newsletter', 'contact', 'footer'],
  section_visibility: {
    header: true,
    hero: true,
    features: true,
    screenshots: true,
    why_choose_us: true,
    templates: true,
    about: true,
    team: true,
    testimonials: true,
    active_campaigns: true,
    plans: true,
    faq: true,
    newsletter: true,
    contact: true,
    footer: true
  }
};