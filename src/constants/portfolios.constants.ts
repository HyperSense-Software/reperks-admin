export enum PortfoliosMenuItems {
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

export interface PortfoliosSearchInterface {
  homepage?: number;
  industry?: PortfoliosMenuItems | string;
  keyword?: string;
  status?: number;
  order?: string;
  direction?: string;
  offset?: number;
  limit?: number;
  skip?: number;
}
