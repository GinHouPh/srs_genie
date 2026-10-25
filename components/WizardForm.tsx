import React, { useState, useRef, useEffect } from 'react';
import { ProjectInput, SRSFormData } from '../types';
import { ChevronRight, ChevronLeft, FileText, Save, Eye, CheckCircle, ArrowLeft, Sparkles, HelpCircle } from 'lucide-react';

interface WizardFormProps {
  onSubmit: (data: ProjectInput) => void;
  onBack: () => void;
  initialData?: Partial<ProjectInput>;
}

export const WizardForm: React.FC<WizardFormProps> = ({ onSubmit, onBack, initialData }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<SRSFormData>(initialData?.formData || {});
  const [viewMode, setViewMode] = useState<'form' | 'summary'>('form');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section] || {},
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (section: string, field: string, option: string, isChecked: boolean) => {
    const currentValues = (formData[section]?.[field] as string[]) || [];
    const newValues = isChecked
      ? [...currentValues, option]
      : currentValues.filter(v => v !== option);
    handleInputChange(section, field, newValues);
  };

  const handleGenerate = () => {
    const projectName = (formData['project_overview']?.['project_name'] as string) || 'Untitled Project';
    const projectInput: ProjectInput = {
      id: initialData?.id || crypto.randomUUID(),
      name: projectName,
      version: '1.0.0',
      lastModified: new Date(),
      status: 'generated',
      formData: formData
    };
    onSubmit(projectInput);
  };

  const formSections = [
    {
      id: 'project_overview',
      title: '1. Project Overview',
      icon: '📋',
      fields: [
        { 
          id: 'project_name', 
          label: 'Project Name', 
          type: 'text', 
          required: true, 
          placeholder: 'Enter your project name' 
        },
        { 
          id: 'industry', 
          label: 'Industry/Domain', 
          type: 'choice_with_text',
          required: true,
          options: [
            'E-commerce & Retail', 'Healthcare & Medical', 'Finance & Banking', 'Education & E-learning',
            'Real Estate', 'Travel & Hospitality', 'Food & Restaurant', 'Logistics & Transportation',
            'Manufacturing', 'Media & Entertainment', 'Social Networking', 'Human Resources',
            'Customer Relationship Management (CRM)', 'Project Management', 'Marketing & Advertising',
            'Insurance', 'Legal Services', 'Non-profit & NGO', 'Government & Public Sector',
            'Sports & Fitness', 'Agriculture', 'Energy & Utilities', 'Telecommunications', 'Other'
          ],
          hasTextInput: true,
          textPlaceholder: 'If Other or additional details, please specify...'
        },
        { 
          id: 'project_type', 
          label: 'Type of Project', 
          type: 'choice_with_text',
          required: true,
          options: [
            'New Product Development', 'Redesign/Modernization of Existing System', 'Feature Enhancement/Addition',
            'System Integration', 'Migration Project', 'Proof of Concept (POC)', 'Minimum Viable Product (MVP)',
            'Full-Scale Production System', 'Other'
          ],
          hasTextInput: true,
          textPlaceholder: 'Please provide additional details...'
        },
        { 
          id: 'business_model', 
          label: 'Business Model', 
          type: 'multiple_choice_with_text',
          options: [
            'B2B (Business to Business)', 'B2C (Business to Consumer)', 'B2B2C', 'C2C (Consumer to Consumer)',
            'Marketplace/Platform', 'Subscription-based (SaaS)', 'Freemium', 'One-time Purchase',
            'Commission-based', 'Advertising-based', 'Other'
          ],
          hasTextInput: true,
          textPlaceholder: 'Describe your business model in detail...'
        },
        { 
          id: 'target_users', 
          label: 'Target Users/Audience', 
          type: 'multiple_choice_with_text',
          required: true,
          options: [
            'General Public', 'Business Professionals', 'Technical Users/Developers', 'Management/Executives',
            'Sales Teams', 'Customer Support Teams', 'Students', 'Teachers/Educators', 'Healthcare Providers',
            'Patients', 'Administrators', 'End Consumers', 'Partners/Vendors', 'Internal Employees Only', 'Other'
          ],
          hasTextInput: true,
          textPlaceholder: 'Describe your target audience demographics, technical expertise, and specific needs...'
        },
        { 
          id: 'expected_timeline', 
          label: 'Expected Project Timeline', 
          type: 'choice_with_text',
          options: [
            '1-2 months', '3-4 months', '5-6 months', '6-12 months', '1-2 years',
            'Flexible timeline', 'ASAP/Urgent', 'Other'
          ],
          hasTextInput: true,
          textPlaceholder: 'Any specific deadline or launch date?'
        },
        { 
          id: 'budget_range', 
          label: 'Budget Range (Optional)', 
          type: 'choice_with_text',
          options: [
            'Under $10,000', '$10,000 - $25,000', '$25,000 - $50,000', '$50,000 - $100,000',
            '$100,000 - $250,000', '$250,000 - $500,000', 'Above $500,000', 'Not decided yet', 'Prefer not to disclose'
          ],
          hasTextInput: true,
          textPlaceholder: 'Any budget constraints or flexibility details...'
        }
      ]
    },
    {
      id: 'system_type',
      title: '2. System Type & Platform',
      icon: '🖥️',
      fields: [
        { 
          id: 'application_type', 
          label: 'What type of application do you need?', 
          type: 'multiple_choice_with_text',
          required: true,
          options: [
            'Web Application (Browser-based)', 'Mobile App - iOS', 'Mobile App - Android',
            'Mobile App - Cross-platform (iOS + Android)', 'Desktop Application (Windows)',
            'Desktop Application (macOS)', 'Desktop Application (Linux)', 'Progressive Web App (PWA)',
            'Backend/API Only', 'Chrome Extension', 'Embedded System/IoT', 'Other'
          ],
          hasTextInput: true,
          textPlaceholder: 'Describe specific platform requirements...'
        },
        { 
          id: 'similar_systems', 
          label: 'Similar Systems/Inspiration', 
          type: 'choice_with_text',
          options: [
            'E-commerce: Amazon, Shopify, Etsy', 'Social Media: Facebook, Twitter, Instagram, LinkedIn',
            'Marketplace: Airbnb, Uber, Upwork', 'Streaming: Netflix, Spotify, YouTube',
            'Productivity: Trello, Asana, Monday.com, Notion', 'Communication: Slack, Discord, Zoom, WhatsApp',
            'Finance: PayPal, Stripe, Mint, Robinhood', 'Education: Coursera, Udemy, Khan Academy',
            'Food Delivery: DoorDash, UberEats, Zomato', 'CRM: Salesforce, HubSpot, Zoho',
            'Analytics: Google Analytics, Tableau, Mixpanel', 'Healthcare: Zocdoc, HealthTap, MyChart',
            'Real Estate: Zillow, Realtor.com, Redfin', 'No similar system (completely unique)', 'Other'
          ],
          hasTextInput: true,
          textPlaceholder: 'Provide URLs or detailed description of systems you want to reference...'
        },
        { 
          id: 'user_scale', 
          label: 'Expected User Scale', 
          type: 'choice_with_text',
          options: [
            'Small (1-100 users)', 'Medium (100-1,000 users)', 'Large (1,000-10,000 users)',
            'Very Large (10,000-100,000 users)', 'Enterprise (100,000+ users)', 'Viral/Unpredictable scale', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Any growth expectations or scaling plans?'
        },
        { 
          id: 'geographic_reach', 
          label: 'Geographic Reach', 
          type: 'multiple_choice_with_text',
          options: ['Single City', 'State/Province', 'National', 'Multiple Countries', 'Global/Worldwide', 'Not applicable'],
          hasTextInput: true,
          textPlaceholder: 'Specify regions or countries...'
        }
      ]
    },
    {
      id: 'core_features',
      title: '3. Core Features & Functionality',
      icon: '⚙️',
      fields: [
        { 
          id: 'user_management', 
          label: 'User Management Features', 
          type: 'multiple_choice_with_text',
          options: [
            'User Registration & Sign Up', 'Email/Password Login', 'Social Login (Google, Facebook, Apple, etc.)',
            'Two-Factor Authentication (2FA)', 'Single Sign-On (SSO)', 'User Profile Management',
            'Password Reset/Recovery', 'Email Verification', 'Role-based Access Control', 'User Analytics & Tracking',
            'User Settings & Preferences', 'Account Deactivation/Deletion', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Describe specific user management requirements...'
        },
        { 
          id: 'content_management', 
          label: 'Content Management Features', 
          type: 'multiple_choice_with_text',
          options: [
            'Create/Edit/Delete Content', 'Rich Text Editor', 'Media Upload (Images, Videos, Documents)',
            'Content Categories/Tags', 'Content Scheduling', 'Version Control/History', 'Draft & Publish Workflow',
            'Content Search', 'Content Moderation', 'Multi-language Content', 'SEO Management', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Specific content types and management needs...'
        },
        { 
          id: 'ecommerce_features', 
          label: 'E-commerce Features', 
          type: 'multiple_choice_with_text',
          options: [
            'Product Catalog', 'Shopping Cart', 'Checkout Process', 'Payment Gateway Integration',
            'Multiple Payment Methods', 'Order Management', 'Inventory Management', 'Shipping Integration',
            'Discount/Coupon System', 'Wishlist', 'Product Reviews & Ratings', 'Subscription Management',
            'Multi-vendor Support', 'Abandoned Cart Recovery', 'Not applicable'
          ],
          hasTextInput: true,
          textPlaceholder: 'Describe your e-commerce requirements...'
        },
        { 
          id: 'communication_features', 
          label: 'Communication & Collaboration Features', 
          type: 'multiple_choice_with_text',
          options: [
            'In-app Messaging/Chat', 'Real-time Chat (1-on-1)', 'Group Chat/Channels', 'Video Calling',
            'Audio Calling', 'Email Notifications', 'SMS Notifications', 'Push Notifications', 'In-app Notifications',
            'Comments & Discussion Threads', 'File Sharing', 'Screen Sharing', 'Whiteboard/Collaboration Tools', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Specific communication requirements...'
        },
        { 
          id: 'search_filter', 
          label: 'Search & Filtering Features', 
          type: 'multiple_choice_with_text',
          options: [
            'Basic Keyword Search', 'Advanced Search with Filters', 'Auto-complete/Suggestions', 'Full-text Search',
            'Faceted Search', 'Geolocation-based Search', 'Search History', 'Saved Searches', 'Sort & Filter Options',
            'AI-powered/Smart Search', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Search functionality details...'
        },
        { 
          id: 'analytics_reporting', 
          label: 'Analytics & Reporting Features', 
          type: 'multiple_choice_with_text',
          options: [
            'Dashboard with Key Metrics', 'Custom Reports', 'Data Visualization (Charts, Graphs)',
            'Export Reports (PDF, Excel, CSV)', 'Real-time Analytics', 'User Behavior Analytics',
            'Sales/Revenue Reports', 'Scheduled Reports', 'Advanced Analytics/Business Intelligence', 'Audit Logs', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'What insights and reports do you need?'
        },
        { 
          id: 'booking_scheduling', 
          label: 'Booking & Scheduling Features', 
          type: 'multiple_choice_with_text',
          options: [
            'Calendar Integration', 'Appointment Booking', 'Resource Scheduling', 'Availability Management',
            'Booking Confirmation', 'Reminders & Notifications', 'Cancellation/Rescheduling', 'Waitlist Management',
            'Recurring Bookings', 'Time Zone Support', 'Not applicable'
          ],
          hasTextInput: true,
          textPlaceholder: 'Booking/scheduling requirements...'
        },
        { 
          id: 'social_features', 
          label: 'Social Features', 
          type: 'multiple_choice_with_text',
          options: [
            'User Profiles', 'Follow/Friend System', 'News Feed/Activity Feed', 'Like/Favorite', 'Share Content',
            'Comments & Discussions', 'User-generated Content', 'Ratings & Reviews', 'Mentions & Tags',
            'Direct Messaging', 'Groups/Communities', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Social interaction requirements...'
        },
        { 
          id: 'automation_workflow', 
          label: 'Automation & Workflow Features', 
          type: 'multiple_choice_with_text',
          options: [
            'Automated Email Campaigns', 'Task Automation', 'Workflow Builder', 'Scheduled Tasks/Jobs',
            'Triggers & Actions', 'Approval Workflows', 'Auto-responders', 'Data Synchronization',
            'Batch Processing', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Automation needs...'
        },
        { 
          id: 'additional_features', 
          label: 'Additional Must-Have Features', 
          type: 'text_only',
          placeholder: 'List any other critical features not covered above. Be as detailed as possible...',
          rows: 6
        }
      ]
    },
    {
      id: 'user_roles',
      title: '4. User Roles & Permissions',
      icon: '👥',
      fields: [
        { 
          id: 'role_types', 
          label: 'User Role Types', 
          type: 'multiple_choice_with_text',
          required: true,
          options: [
            'Super Admin (Full system access)', 'Admin (System management)', 'Manager/Supervisor',
            'Staff/Employee', 'Customer/Client', 'Guest/Visitor (No login)', 'Vendor/Partner',
            'Moderator', 'Content Creator', 'Viewer/Read-only User', 'Custom Roles Needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Describe each role and their specific permissions in detail...'
        },
        { 
          id: 'permission_model', 
          label: 'Permission Model', 
          type: 'choice_with_text',
          options: [
            'Simple (Admin vs Regular User)', 'Role-based (Multiple fixed roles)', 'Advanced Role-based with custom permissions',
            'Hierarchical (Manager can manage subordinates)', 'Dynamic permissions (User-specific)',
            'Team/Group-based permissions', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Explain your permission requirements...'
        }
      ]
    },
    {
      id: 'design_ui_ux',
      title: '5. Design & User Interface',
      icon: '🎨',
      fields: [
        { 
          id: 'design_preference', 
          label: 'Design Style Preference', 
          type: 'multiple_choice_with_text',
          options: [
            'Modern & Minimalist', 'Bold & Vibrant', 'Corporate & Professional', 'Creative & Artistic',
            'Dark Theme/Dark Mode', 'Light & Airy', 'Material Design', 'Flat Design', 'Neumorphism',
            'Glassmorphism', 'Retro/Vintage', 'Futuristic', 'Similar to specific website (will provide reference)', 'No preference'
          ],
          hasTextInput: true,
          textPlaceholder: 'Describe your design vision or provide reference links...'
        },
        { 
          id: 'branding', 
          label: 'Branding Assets', 
          type: 'choice_with_text',
          options: [
            'Have complete brand guidelines (logo, colors, fonts)', 'Have logo and colors only',
            'Have logo only', 'Need complete branding created', 'Will provide later'
          ],
          hasTextInput: true,
          textPlaceholder: 'Provide brand colors (hex codes), fonts, and any guidelines...'
        },
        { 
          id: 'device_support', 
          label: 'Device & Screen Support', 
          type: 'multiple_choice_with_text',
          required: true,
          options: [
            'Desktop (Large screens)', 'Laptop', 'Tablet (iPad, Android tablets)',
            'Mobile Phone (Portrait)', 'Mobile Phone (Landscape)', 'Smart TV', 'Smartwatch',
            'All devices (Fully responsive)'
          ],
          hasTextInput: true,
          textPlaceholder: 'Any specific device requirements or priorities?'
        },
        { 
          id: 'accessibility', 
          label: 'Accessibility Requirements', 
          type: 'multiple_choice_with_text',
          options: [
            'WCAG 2.1 Level A Compliance', 'WCAG 2.1 Level AA Compliance', 'WCAG 2.1 Level AAA Compliance',
            'Screen Reader Support', 'Keyboard Navigation', 'High Contrast Mode', 'Font Size Adjustment',
            'Color Blind Friendly', 'ADA Compliance', 'Section 508 Compliance', 'Not required'
          ],
          hasTextInput: true,
          textPlaceholder: 'Specific accessibility needs...'
        },
        { 
          id: 'language_support', 
          label: 'Multi-language Support', 
          type: 'choice_with_text',
          options: [
            'Single Language (English)', '2-3 Languages', '4-10 Languages', '10+ Languages',
            'Right-to-Left (RTL) Support needed (Arabic, Hebrew)', 'Dynamic language switching', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'List specific languages needed...'
        },
        { 
          id: 'ui_deliverables', 
          label: 'Design Deliverables Needed', 
          type: 'multiple_choice_with_text',
          options: [
            'Wireframes', 'High-fidelity Mockups', 'Interactive Prototype', 'Design System/Style Guide',
            'Icon Set', 'Illustrations', 'Animation Specifications', 'Not needed (will provide designs)', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Any specific design requirements...'
        }
      ]
    },
    {
      id: 'technical_requirements',
      title: '6. Technical Requirements',
      icon: '🔧',
      fields: [
        { 
          id: 'technology_preference', 
          label: 'Technology Stack Preference', 
          type: 'choice_with_text',
          options: [
            'No preference (Developer\'s choice)', 'Modern/Latest technologies', 'Stable/Mature technologies',
            'Specific technologies required (will specify)', 'Must match existing infrastructure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Specify technology requirements (e.g., React, Python, Node.js, .NET, etc.)...'
        },
        { 
          id: 'existing_infrastructure', 
          label: 'Existing Technical Infrastructure', 
          type: 'multiple_choice_with_text',
          options: [
            'Cloud Infrastructure (AWS, Azure, Google Cloud)', 'On-Premise Servers', 'Existing Database Systems',
            'Existing APIs/Web Services', 'Legacy Systems', 'Content Management System (CMS)', 'ERP System',
            'CRM System', 'Other Business Software', 'No existing infrastructure', 'Not applicable'
          ],
          hasTextInput: true,
          textPlaceholder: 'Describe your current technical setup...'
        },
        { 
          id: 'database_needs', 
          label: 'Database Requirements', 
          type: 'choice_with_text',
          options: [
            'Relational Database (MySQL, PostgreSQL, SQL Server)', 'NoSQL Database (MongoDB, DynamoDB)',
            'Both Relational and NoSQL', 'In-memory Database (Redis, Memcached)', 'Graph Database (Neo4j)',
            'Time-series Database', 'No preference', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Data volume, structure, and specific needs...'
        },
        { 
          id: 'api_requirements', 
          label: 'API Requirements', 
          type: 'multiple_choice_with_text',
          options: [
            'RESTful API', 'GraphQL API', 'WebSocket for Real-time', 'Webhooks', 'Third-party API Integration',
            'API Documentation', 'API Rate Limiting', 'API Versioning', 'Public API (for external developers)', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'API specifications and requirements...'
        },
        { 
          id: 'file_storage', 
          label: 'File Storage & Management', 
          type: 'multiple_choice_with_text',
          options: [
            'Image Upload & Storage', 'Video Upload & Storage', 'Document Upload (PDF, Word, Excel)',
            'Large File Support (> 100MB)', 'File Compression', 'CDN for File Delivery', 'File Preview/Viewer',
            'File Version Control', 'Cloud Storage (AWS S3, Azure Blob)', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'File types, sizes, and storage requirements...'
        },
        { 
          id: 'offline_support', 
          label: 'Offline Capability', 
          type: 'choice_with_text',
          options: [
            'Full offline functionality', 'Partial offline (read-only)', 'Offline data sync when online',
            'No offline needed', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Describe offline requirements...'
        }
      ]
    },
    {
      id: 'integrations',
      title: '7. Third-Party Integrations',
      icon: '🔗',
      fields: [
        { 
          id: 'payment_gateways', 
          label: 'Payment Gateway Integration', 
          type: 'multiple_choice_with_text',
          options: [
            'Stripe', 'PayPal', 'Square', 'Braintree', 'Authorize.net', 'Razorpay', 'Apple Pay',
            'Google Pay', 'Cryptocurrency Payments', 'Local Payment Methods', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Specific payment requirements and supported currencies...'
        },
        { 
          id: 'email_services', 
          label: 'Email Service Integration', 
          type: 'multiple_choice_with_text',
          options: [
            'SendGrid', 'Mailgun', 'Amazon SES', 'Mailchimp', 'Constant Contact', 'Custom SMTP',
            'Transactional Emails', 'Marketing Emails', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Email requirements and volume...'
        },
        { 
          id: 'social_media_integration', 
          label: 'Social Media Integration', 
          type: 'multiple_choice_with_text',
          options: [
            'Facebook (Login, Share, API)', 'Google (Login, APIs)', 'Twitter/X', 'LinkedIn',
            'Instagram', 'TikTok', 'YouTube', 'WhatsApp', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'What social features needed?'
        },
        { 
          id: 'cloud_storage', 
          label: 'Cloud Storage Integration', 
          type: 'multiple_choice_with_text',
          options: [
            'Google Drive', 'Dropbox', 'OneDrive', 'Box', 'iCloud', 'AWS S3', 'Azure Storage', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Storage integration needs...'
        },
        { 
          id: 'maps_location', 
          label: 'Maps & Location Services', 
          type: 'multiple_choice_with_text',
          options: [
            'Google Maps', 'Mapbox', 'Apple Maps', 'Geolocation Services', 'Address Autocomplete',
            'Route Planning', 'Store/Location Finder', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Location feature requirements...'
        },
        { 
          id: 'analytics_tools', 
          label: 'Analytics & Tracking Tools', 
          type: 'multiple_choice_with_text',
          options: [
            'Google Analytics', 'Mixpanel', 'Amplitude', 'Segment', 'Hotjar', 'Facebook Pixel', 'Custom Analytics', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Analytics requirements...'
        },
        { 
          id: 'communication_tools', 
          label: 'Communication Tools Integration', 
          type: 'multiple_choice_with_text',
          options: [
            'Twilio (SMS, Voice)', 'SendBird (Chat)', 'Zoom', 'Microsoft Teams', 'Slack', 'Intercom',
            'Zendesk', 'LiveChat', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Communication integration needs...'
        },
        { 
          id: 'business_tools', 
          label: 'Business Tools Integration', 
          type: 'multiple_choice_with_text',
          options: [
            'Salesforce', 'HubSpot', 'Zoho', 'QuickBooks', 'Xero', 'SAP', 'Microsoft Dynamics',
            'Custom ERP/CRM', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Business tool integration requirements...'
        },
        { 
          id: 'other_integrations', 
          label: 'Other Integrations', 
          type: 'text_only',
          placeholder: 'List any other third-party services or APIs you need to integrate...',
          rows: 4
        }
      ]
    },
    {
      id: 'security',
      title: '8. Security & Compliance',
      icon: '🔒',
      fields: [
        { 
          id: 'authentication', 
          label: 'Authentication Methods', 
          type: 'multiple_choice_with_text',
          required: true,
          options: [
            'Email & Password', 'Social Login (Google, Facebook, Apple)', 'Phone Number (OTP)',
            'Two-Factor Authentication (2FA)', 'Multi-Factor Authentication (MFA)', 'Biometric (Fingerprint, Face ID)',
            'Single Sign-On (SSO)', 'LDAP/Active Directory', 'Magic Link (Passwordless)', 'Other'
          ],
          hasTextInput: true,
          textPlaceholder: 'Specific authentication requirements...'
        },
        { 
          id: 'data_security', 
          label: 'Data Security Requirements', 
          type: 'multiple_choice_with_text',
          required: true,
          options: [
            'Data Encryption at Rest', 'Data Encryption in Transit (SSL/TLS)', 'End-to-End Encryption',
            'Database Encryption', 'Secure File Storage', 'Password Hashing', 'API Key Management',
            'Secrets Management', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Security specifications...'
        },
        { 
          id: 'compliance', 
          label: 'Compliance & Regulatory Requirements', 
          type: 'multiple_choice_with_text',
          options: [
            'GDPR (EU Data Protection)', 'CCPA (California Privacy)', 'HIPAA (Healthcare)', 'PCI-DSS (Payment Card)',
            'SOC 2', 'ISO 27001', 'FERPA (Education)', 'COPPA (Children\'s Privacy)', 'Industry-specific compliance',
            'None', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Specific compliance requirements and jurisdiction...'
        },
        { 
          id: 'data_privacy', 
          label: 'Data Privacy Features', 
          type: 'multiple_choice_with_text',
          options: [
            'Cookie Consent Management', 'Privacy Policy & Terms', 'Data Export (User can download their data)',
            'Data Deletion (Right to be forgotten)', 'Consent Management', 'Privacy Dashboard for Users',
            'Anonymous/Pseudonymous Usage', 'Data Retention Policies', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Privacy requirements...'
        },
        { 
          id: 'backup_recovery', 
          label: 'Backup & Disaster Recovery', 
          type: 'choice_with_text',
          options: [
            'Daily Automated Backups', 'Real-time/Continuous Backup', 'Weekly Backups', 'Multi-region Backup',
            'Disaster Recovery Plan needed', 'Point-in-time Recovery', 'Not required', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Backup and recovery requirements...'
        }
      ]
    },
    {
      id: 'performance',
      title: '9. Performance & Scalability',
      icon: '⚡',
      fields: [
        { 
          id: 'performance_expectations', 
          label: 'Performance Expectations', 
          type: 'multiple_choice_with_text',
          options: [
            'Page Load Time < 2 seconds', 'Page Load Time < 3 seconds', 'Real-time Updates (< 100ms)',
            'High-performance Computing', 'Standard Performance', 'Not critical', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Specific performance requirements...'
        },
        { 
          id: 'concurrent_users', 
          label: 'Expected Concurrent Users', 
          type: 'choice_with_text',
          options: [
            '1-50 users', '50-500 users', '500-5,000 users', '5,000-50,000 users', '50,000+ users',
            'Variable/Unpredictable', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Peak usage times and patterns...'
        },
        { 
          id: 'scalability', 
          label: 'Scalability Requirements', 
          type: 'choice_with_text',
          options: [
            'Auto-scaling needed', 'Manual scaling acceptable', 'Vertical scaling (more powerful servers)',
            'Horizontal scaling (more servers)', 'Global distribution/CDN', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Growth expectations and scaling needs...'
        },
        { 
          id: 'uptime', 
          label: 'Uptime Requirements', 
          type: 'choice_with_text',
          options: [
            '99.9% (8.76 hours downtime/year)', '99.95% (4.38 hours downtime/year)',
            '99.99% (52 minutes downtime/year)', '99.999% (5 minutes downtime/year)', 'Best effort', 'Not critical'
          ],
          hasTextInput: true,
          textPlaceholder: 'Uptime requirements and maintenance windows...'
        }
      ]
    },
    {
      id: 'deployment',
      title: '10. Deployment & Hosting',
      icon: '🚀',
      fields: [
        { 
          id: 'hosting_model', 
          label: 'Hosting Model', 
          type: 'choice_with_text',
          required: true,
          options: [
            'Cloud Hosting (AWS, Azure, Google Cloud)', 'Shared Hosting', 'VPS Hosting', 'Dedicated Server',
            'On-Premise/Self-hosted', 'Hybrid (Cloud + On-premise)', 'Developer provides and manages',
            'Client provides hosting', 'Not decided'
          ],
          hasTextInput: true,
          textPlaceholder: 'Hosting preferences and existing infrastructure...'
        },
        { 
          id: 'deployment_environment', 
          label: 'Deployment Environments', 
          type: 'multiple_choice_with_text',
          options: [
            'Development Environment', 'Staging/Testing Environment', 'Production Environment', 'Demo Environment', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Environment requirements...'
        },
        { 
          id: 'ci_cd', 
          label: 'CI/CD (Continuous Integration/Deployment)', 
          type: 'choice_with_text',
          options: [
            'Fully automated CI/CD pipeline', 'Semi-automated deployment', 'Manual deployment acceptable',
            'Not needed', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'Deployment process preferences...'
        },
        { 
          id: 'post_launch_support', 
          label: 'Post-Launch Support & Maintenance', 
          type: 'choice_with_text',
          options: [
            'Ongoing monthly maintenance (bug fixes, updates)', 'On-demand support (pay as needed)',
            '3-6 months warranty period', 'Training and handoff only', 'To be discussed later'
          ],
          hasTextInput: true,
          textPlaceholder: 'Support requirements and SLA expectations...'
        },
        { 
          id: 'documentation', 
          label: 'Documentation Requirements', 
          type: 'multiple_choice_with_text',
          options: [
            'User Documentation/Manual', 'Admin Documentation', 'Technical Documentation', 'API Documentation',
            'Code Documentation', 'Video Tutorials', 'Training Sessions', 'Not needed'
          ],
          hasTextInput: true,
          textPlaceholder: 'Documentation needs...'
        }
      ]
    },
    {
      id: 'testing',
      title: '11. Testing & Quality Assurance',
      icon: '✓',
      fields: [
        { 
          id: 'testing_scope', 
          label: 'Testing Scope', 
          type: 'multiple_choice_with_text',
          required: true,
          options: [
            'Unit Testing', 'Integration Testing', 'End-to-End (E2E) Testing', 'User Acceptance Testing (UAT)',
            'Performance/Load Testing', 'Security Testing', 'Cross-browser Testing', 'Mobile Device Testing',
            'Accessibility Testing', 'Regression Testing', 'Basic testing only'
          ],
          hasTextInput: true,
          textPlaceholder: 'Testing requirements and who will participate...'
        },
        { 
          id: 'browsers_devices', 
          label: 'Browser & Device Coverage', 
          type: 'multiple_choice_with_text',
          options: [
            'Chrome (Latest 2 versions)', 'Firefox (Latest 2 versions)', 'Safari (Latest 2 versions)',
            'Edge (Latest 2 versions)', 'Internet Explorer 11', 'iOS Safari', 'Android Chrome',
            'All modern browsers', 'Not specified'
          ],
          hasTextInput: true,
          textPlaceholder: 'Specific browser/device requirements...'
        }
      ]
    },
    {
      id: 'content_data_migration',
      title: '12. Content & Data Migration',
      icon: '📄',
      fields: [
        { 
          id: 'existing_data', 
          label: 'Existing Data to Migrate', 
          type: 'choice_with_text',
          options: [
            'Large amount of data (needs migration)', 'Small amount of data', 'No existing data',
            'Will provide data files', 'Data in existing system/database', 'Not applicable'
          ],
          hasTextInput: true,
          textPlaceholder: 'Describe data volume, format (CSV, Excel, Database), and structure...'
        },
        { 
          id: 'content_creation', 
          label: 'Content Creation Responsibility', 
          type: 'choice_with_text',
          options: [
            'Client provides all content (text, images, videos)', 'Developer team creates content',
            'Shared responsibility', 'Content writers needed', 'Will use placeholder content initially', 'Not applicable'
          ],
          hasTextInput: true,
          textPlaceholder: 'Content requirements and who provides what...'
        }
      ]
    },
    {
      id: 'constraints',
      title: '13. Constraints & Limitations',
      icon: '⚠️',
      fields: [
        { 
          id: 'technical_constraints', 
          label: 'Technical Constraints', 
          type: 'multiple_choice_with_text',
          options: [
            'Must use specific technology/framework', 'Must integrate with legacy systems', 'Limited server resources',
            'Must work on older devices/browsers', 'Network bandwidth limitations', 'Must be installable/downloadable',
            'No external dependencies allowed', 'None'
          ],
          hasTextInput: true,
          textPlaceholder: 'Describe technical limitations...'
        },
        { 
          id: 'business_constraints', 
          label: 'Business Constraints', 
          type: 'multiple_choice_with_text',
          options: [
            'Strict budget limitation', 'Fixed deadline (cannot extend)', 'Limited team availability',
            'Regulatory approval needed', 'Stakeholder approval process', 'Must launch by specific date/event', 'None'
          ],
          hasTextInput: true,
          textPlaceholder: 'Business limitations and constraints...'
        }
      ]
    },
    {
      id: 'risks',
      title: '14. Risks & Concerns',
      icon: '🎯',
      fields: [
        { 
          id: 'known_risks', 
          label: 'Known Risks or Challenges', 
          type: 'text_only',
          placeholder: 'What potential risks, challenges, or obstacles do you foresee for this project?',
          rows: 4
        },
        { 
          id: 'change_management', 
          label: 'Change Management', 
          type: 'choice_with_text',
          options: [
            'Requirements are well-defined (minimal changes)', 'Some changes expected',
            'Frequent changes expected (Agile approach)', 'Iterative development with feedback loops', 'Not sure'
          ],
          hasTextInput: true,
          textPlaceholder: 'How do you handle requirement changes?'
        }
      ]
    },
    {
      id: 'additional',
      title: '15. Additional Information',
      icon: '📌',
      fields: [
        { 
          id: 'competitive_analysis', 
          label: 'Competitor Analysis', 
          type: 'text_only',
          placeholder: 'Who are your competitors? What makes your solution different or better?',
          rows: 4
        },
        { 
          id: 'success_metrics', 
          label: 'Success Metrics', 
          type: 'text_only',
          placeholder: 'How will you measure the success of this project? (KPIs, user adoption, revenue targets, etc.)',
          rows: 4
        },
        { 
          id: 'future_roadmap', 
          label: 'Future Roadmap', 
          type: 'text_only',
          placeholder: 'What features or enhancements are planned for future phases?',
          rows: 4
        },
        { 
          id: 'additional_notes', 
          label: 'Additional Notes & Comments', 
          type: 'text_only',
          placeholder: 'Any other information, requirements, or concerns not covered in this form?',
          rows: 5
        },
        { 
          id: 'attachments', 
          label: 'Reference Materials', 
          type: 'text_only',
          placeholder: 'List any documents, wireframes, mockups, specifications, or other materials you can provide (describe or provide links)...',
          rows: 3
        }
      ]
    }
  ];

  const handleNext = () => {
    if (activeStep < formSections.length - 1) {
      setActiveStep(prev => prev + 1);
      scrollRef.current?.scrollTo(0, 0);
    } else {
      setViewMode('summary');
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
      scrollRef.current?.scrollTo(0, 0);
    } else {
      onBack();
    }
  };

  const renderField = (sectionId: string, field: any) => {
    const fieldId = field.id;
    const value = formData[sectionId]?.[fieldId] || '';
    const textValue = formData[sectionId]?.[`${fieldId}_text`] || '';

    if (field.type === 'text_only') {
      return (
        <textarea
          id={`${sectionId}_${fieldId}`}
          className="w-full px-4 py-3 bg-ink border border-line focus:border-accent resize-y transition-all text-white placeholder:text-muted font-body outline-none text-sm"
          rows={field.rows || 3}
          placeholder={field.placeholder}
          value={value as string}
          onChange={(e) => handleInputChange(sectionId, fieldId, e.target.value)}
        />
      );
    }

    if (field.type === 'text') {
      return (
        <input
          type="text"
          id={`${sectionId}_${fieldId}`}
          className="w-full px-4 py-3 bg-ink border border-line focus:border-accent transition-all text-white placeholder:text-muted font-body outline-none text-sm"
          placeholder={field.placeholder}
          value={value as string}
          onChange={(e) => handleInputChange(sectionId, fieldId, e.target.value)}
        />
      );
    }

    if (field.type === 'choice_with_text') {
      return (
        <div className="space-y-4">
          <div className="space-y-1.5 bg-surface p-4 border border-line">
            {field.options?.map((option: string) => (
              <label key={option} className="flex items-start space-x-3 p-2.5 hover:bg-box cursor-pointer transition-colors group">
                <input
                  type="radio"
                  name={`${sectionId}_${fieldId}`}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(sectionId, fieldId, e.target.value)}
                  className="mt-1 accent-[#d90429]"
                />
                <span className="text-sm font-body text-body group-hover:text-white transition-colors flex-1">{option}</span>
              </label>
            ))}
          </div>
          {field.hasTextInput && (value && value !== 'Not needed' && value !== 'Not applicable' && value !== 'None') && (
            <div className="animate-fadeIn">
              <label className="block font-display text-xs tracking-[0.2em] uppercase text-muted mb-2">
                Additional Details:
              </label>
              <textarea
                className="w-full px-4 py-3 bg-ink border border-line focus:border-accent resize-y transition-all text-white placeholder:text-muted font-body outline-none text-sm"
                rows={3}
                placeholder={field.textPlaceholder}
                value={textValue as string}
                onChange={(e) => handleInputChange(sectionId, `${fieldId}_text`, e.target.value)}
              />
            </div>
          )}
        </div>
      );
    }

    if (field.type === 'multiple_choice_with_text') {
      const selectedValues = (value as string[]) || [];
      return (
        <div className="space-y-4">
          <div className="space-y-1.5 bg-surface p-4 border border-line">
            {field.options?.map((option: string) => (
              <label key={option} className="flex items-start space-x-3 p-2.5 hover:bg-box cursor-pointer transition-colors group">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) => handleCheckboxChange(sectionId, fieldId, option, e.target.checked)}
                  className="mt-1 accent-[#d90429]"
                />
                <span className="text-sm font-body text-body group-hover:text-white transition-colors flex-1">{option}</span>
                {selectedValues.includes(option) && (
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                )}
              </label>
            ))}
          </div>
          {field.hasTextInput && selectedValues.length > 0 && (
            <div className="animate-fadeIn">
              <label className="block font-display text-xs tracking-[0.2em] uppercase text-muted mb-2">
                Additional Details:
              </label>
              <textarea
                className="w-full px-4 py-3 bg-ink border border-line focus:border-accent resize-y transition-all text-white placeholder:text-muted font-body outline-none text-sm"
                rows={3}
                placeholder={field.textPlaceholder}
                value={textValue as string}
                onChange={(e) => handleInputChange(sectionId, `${fieldId}_text`, e.target.value)}
              />
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const getCompletionStats = () => {
    let totalFields = 0;
    let completedFields = 0;

    formSections.forEach(section => {
      section.fields.forEach(field => {
        totalFields++;
        const value = formData[section.id]?.[field.id];
        if (value && (Array.isArray(value) ? value.length > 0 : (typeof value === 'string' ? value.trim().length > 0 : false))) {
          completedFields++;
        }
      });
    });

    return { total: totalFields, completed: completedFields, percentage: Math.round((completedFields / totalFields) * 100) };
  };

  const stats = getCompletionStats();

  const exportData = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `srs-requirements-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Summary View
  if (viewMode === 'summary') {
    return (
      <div className="shell py-6">
        <div className="agape-card overflow-hidden">
          <div className="p-6 border-b border-line bg-box flex justify-between items-center">
            <div>
              <div className="eyebrow mb-1">Pre-Flight Review</div>
              <h2 className="font-display text-xl font-semibold uppercase tracking-[0.06em] text-white">
                Requirements Summary
              </h2>
            </div>
            <button
              onClick={() => setViewMode('form')}
              className="btn btn-sm btn--ghost"
            >
              Back to Questionnaire
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="bg-surface border border-accent/40 p-6">
              <div className="font-display text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-2">Completion Status</div>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-ink border border-line h-2">
                  <div className="bg-accent h-2 transition-all duration-500" style={{ width: `${stats.percentage}%` }} />
                </div>
                <span className="font-display text-2xl font-semibold text-white">{stats.percentage}%</span>
              </div>
              <p className="mt-2 text-muted text-xs font-body">{stats.completed} of {stats.total} fields completed</p>
            </div>

            {formSections.map(section => {
              const sectionData = formData[section.id];
              if (!sectionData || Object.keys(sectionData).length === 0) return null;
              
              const hasData = Object.values(sectionData).some(val => Array.isArray(val) ? val.length > 0 : val);
              if (!hasData) return null;

              return (
                <div key={section.id} className="agape-card overflow-hidden">
                  <div className="bg-box px-6 py-3 border-b border-line flex justify-between items-center">
                    <h3 className="font-display text-base font-semibold text-white uppercase tracking-[0.08em] flex items-center gap-3">
                      <span>{section.icon}</span>
                      {section.title}
                    </h3>
                    <button 
                      onClick={() => {
                          const index = formSections.findIndex(s => s.id === section.id);
                          setActiveStep(index);
                          setViewMode('form');
                      }}
                      className="font-display text-xs uppercase tracking-[0.14em] text-accent hover:text-white"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    {section.fields.map(field => {
                      const value = sectionData[field.id];
                      const textValue = sectionData[`${field.id}_text`];
                      if (!value || (Array.isArray(value) && value.length === 0)) return null;

                      return (
                        <div key={field.id} className="border-l-2 border-accent pl-4 py-1">
                          <dt className="font-display text-xs uppercase tracking-[0.16em] text-muted mb-1">{field.label}</dt>
                          <dd className="text-body text-sm font-body">
                            {Array.isArray(value) ? (
                              <ul className="list-disc list-inside space-y-1 text-white">
                                {value.map((item, idx) => <li key={idx}>{item}</li>)}
                              </ul>
                            ) : (
                              <p className="whitespace-pre-wrap text-white">{value as string}</p>
                            )}
                            {textValue && (
                              <div className="mt-2 p-3 bg-ink border border-line">
                                <p className="font-display text-[11px] uppercase tracking-[0.14em] text-accent mb-1">Additional Details:</p>
                                <p className="text-muted text-xs whitespace-pre-wrap">{textValue as string}</p>
                              </div>
                            )}
                          </dd>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 border-t border-line bg-surface">
            <button
               onClick={handleGenerate}
               disabled={stats.percentage < 10}
               className="btn btn--accent w-full justify-center disabled:opacity-50"
             >
               <Sparkles className="w-4 h-4 mr-1.5" />
               <span>Generate 22-File .specs Suite</span>
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Paginated Form View
  const currentSection = formSections[activeStep];
  const progressPercentage = ((activeStep + 1) / formSections.length) * 100;

  return (
    <div className="shell py-6">
      <div className="agape-card overflow-hidden">
         {/* Header */}
         <div className="p-6 border-b border-line bg-surface">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
             <div>
               <div className="eyebrow mb-1">Specification Engine</div>
               <h1 className="font-display text-2xl font-semibold uppercase tracking-[0.06em] text-white flex items-center gap-2">
                 <FileText className="w-5 h-5 text-accent" />
                 Requirements Questionnaire
               </h1>
             </div>
             
             <div className="flex gap-3">
               <button
                 onClick={exportData}
                 className="btn btn-sm btn--ghost"
               >
                 <Save className="w-4 h-4 mr-1 text-accent" />
                 Save Draft
               </button>
               <button
                 onClick={() => setViewMode('summary')}
                 className="btn btn-sm btn--ghost"
               >
                 <Eye className="w-4 h-4 mr-1" />
                 Review
               </button>
             </div>
           </div>

           {/* Stepper Progress */}
           <div className="space-y-2">
              <div className="flex justify-between text-xs font-display uppercase tracking-[0.16em] text-muted">
                 <span>Section {activeStep + 1} of {formSections.length}</span>
                 <span className="text-accent">{Math.round(progressPercentage)}% Completed</span>
              </div>
              <div className="h-1.5 bg-ink border border-line overflow-hidden">
                 <div 
                   className="h-full bg-accent transition-all duration-300 ease-out"
                   style={{ width: `${progressPercentage}%` }}
                 />
              </div>
           </div>
         </div>

         {/* Form Body */}
         <div className="p-6 md:p-10 bg-ink" ref={scrollRef}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-line">
                 <div className="w-12 h-12 bg-box border border-line flex items-center justify-center text-2xl">
                    {currentSection.icon}
                 </div>
                 <div>
                    <h2 className="font-display text-xl sm:text-2xl font-semibold text-white uppercase tracking-[0.06em]">
                      {currentSection.title}
                    </h2>
                    <p className="font-body text-xs text-muted mt-1">Specify detailed parameters for this architectural dimension.</p>
                 </div>
              </div>

              <div className="space-y-8 animate-fadeIn">
                  {currentSection.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label htmlFor={`${currentSection.id}_${field.id}`} className="block font-display text-xs uppercase tracking-[0.16em] text-white">
                        {field.label}
                        {field.required && <span className="text-accent ml-1">*</span>}
                      </label>
                      {renderField(currentSection.id, field)}
                    </div>
                  ))}
              </div>
            </div>
         </div>

         {/* Footer Navigation */}
         <div className="p-6 border-t border-line bg-surface flex justify-between items-center">
            <button
              onClick={handlePrev}
              className="btn btn-sm btn--ghost"
            >
               {activeStep === 0 ? <ArrowLeft className="w-4 h-4 mr-1.5" /> : <ChevronLeft className="w-4 h-4 mr-1.5" />}
               {activeStep === 0 ? 'Dashboard' : 'Previous'}
            </button>

            <div className="flex gap-4">
               {activeStep === formSections.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="btn btn-sm btn--accent"
                  >
                     Review Summary
                     <Eye className="w-4 h-4 ml-1.5" />
                  </button>
               ) : (
                  <button
                    onClick={handleNext}
                    className="btn btn-sm btn--accent"
                  >
                     Next Section
                     <ChevronRight className="w-4 h-4 ml-1.5" />
                  </button>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
