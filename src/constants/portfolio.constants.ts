import { v4 as uuidv4 } from 'uuid';
import { Portfolio } from '@/interfaces/Portfolio';

export enum WorkMenuItemsEnum {
  'all' = 'all',
  'finance-fintech' = 'finance-fintech',
  'automotive' = 'automotive',
  'telecommunications' = 'telecommunications',
  'healthcare' = 'healthcare',
  'gaming-entertainment' = 'gaming-entertainment',
  'retail-ecommerce' = 'retail-ecommerce',
  'business-productivity' = 'business-productivity',
  'chemical-industry' = 'chemical-industry',
  'location-tracking' = 'location-tracking',
  'event-management' = 'event-management',
  'beauty-personal-care' = 'beauty-personal-care',
}

export enum WorkMenuEnum {
  'all' = 'All',
  'finance-fintech' = 'Finance & Fintech',
  'automotive' = 'Automotive',
  'telecommunications' = 'Telecommunications',
  'healthcare' = 'Healthcare',
  'gaming-entertainment' = 'Gaming & Entertainment',
  'retail-ecommerce' = 'Retail & E-commerce',
  'business-productivity' = 'Business & Productivity',
  'chemical-industry' = 'Chemicals',
  'location-tracking' = 'Location & Tracking',
  'event-management' = 'Event Management',
  'beauty-personal-care' = 'Beauty & Personal Care',
}

export const PortfolioTechnologies: string[] = [
  'Android',
  'iOS',
  'Angular',
  'Node.js',
  'Wordpress',
  'Wearables',
  'PHP',
  'Flutter',
];

export interface PortfolioSearchInterface {
  id: string;
}

export enum PortfolioIndustriesLabelsEnum {
  'finance-fintech' = 'Finance & Fintech',
  'automotive' = 'Automotive',
  'telecommunications' = 'Telecommunications',
  'healthcare' = 'Healthcare',
  'gaming-entertainment' = 'Gaming & Entertainment',
  'retail-ecommerce' = 'Retail & E-commerce',
  'business-productivity' = 'Business & Productivity',
  'chemical-industry' = 'Chemicals',
  'location-tracking' = 'Location & Tracking',
  'event-management' = 'Event Management',
  'beauty-personal-care' = 'Beauty & Personal Care',
}

export const industries = [
  { name: 'Finance & Fintech', value: 'finance-fintech' },
  { name: 'Automotive', value: 'automotive' },
  { name: 'Telecommunications', value: 'telecommunications' },
  { name: 'Healthcare', value: 'healthcare' },
  { name: 'Gaming & Entertainment', value: 'gaming-entertainment' },
  { name: 'Retail & E-commerce', value: 'retail-ecommerce' },
  { name: 'Business & Productivity', value: 'business-productivity' },
  { name: 'Chemicals', value: 'chemical-industry' },
  { name: 'Location & Tracking', value: 'location-tracking' },
  { name: 'Event Management', value: 'event-management' },
  { name: 'Beauty & Personal Care', value: 'beauty-personal-care' },
];

export const ProjectDefaults: Partial<Portfolio> = {
  id: 1,
  updatedAt: 0,
  createdAt: 0,
  publishedAt: 0,
  publishURLPath: '',
  status: false,
  title: '',
  project: '',
  excerpt: '',
  contentRight: '',
  imageURL: '',
  folder: uuidv4(),
  content: '',
  industry: '',
  technologies: '',
  backgroundGradientColors: '',
  duration: 0,
  userID: 0,
  caseStudy: false,
  order: 0,
  homepage: false,
  software: false,
  node: false,
  slug: '',
  seoMetatitle: '',
  seoDescription: '',
  seoKeywords: '',
  seoImageURL: '',
};

export const PortfolioStatus = {
  pending: 0,
  published: 1,
  disabled: 2,
};

export const PortfolioStatusLabels = [
  {
    value: '0',
    label: 'Pending',
  },
  {
    value: '1',
    label: 'Published',
  },
  {
    value: '2',
    label: 'Disabled',
  },
];

export const PortfolioIndustriesLabels = [
  { label: PortfolioIndustriesLabelsEnum['finance-fintech'], value: 'finance-fintech' },
  { label: PortfolioIndustriesLabelsEnum['automotive'], value: 'automotive' },
  { label: PortfolioIndustriesLabelsEnum['telecommunications'], value: 'telecommunications' },
  { label: PortfolioIndustriesLabelsEnum['healthcare'], value: 'healthcare' },
  { label: PortfolioIndustriesLabelsEnum['gaming-entertainment'], value: 'gaming-entertainment' },
  { label: PortfolioIndustriesLabelsEnum['retail-ecommerce'], value: 'retail-ecommerce' },
  { label: PortfolioIndustriesLabelsEnum['business-productivity'], value: 'business-productivity' },
  { label: PortfolioIndustriesLabelsEnum['chemical-industry'], value: 'chemical-industry' },
  { label: PortfolioIndustriesLabelsEnum['location-tracking'], value: 'location-tracking' },
  { label: PortfolioIndustriesLabelsEnum['event-management'], value: 'event-management' },
  { label: PortfolioIndustriesLabelsEnum['beauty-personal-care'], value: 'beauty-personal-care' },
];
