export interface PortfolioIdParam {
  id: number;
}
export interface PortfolioParams {
  publishedAt?: number;
  publishURLPath?: string;
  status: number | boolean;
  title: string;
  project?: string;
  excerpt?: string;
  contentRight?: string;
  imageURL?: string;
  folder: string;
  content?: string;
  industry?: string;
  technologies?: string | null;
  backgroundGradientColors?: string | undefined;
  duration: number;
  userID: number;
  caseStudy: number | boolean;
  order: number;
  homepage: number | boolean;
  software: number | boolean;
  node: number | boolean;
  slug: string;
  seoMetatitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoImageURL?: string;
}
export interface Portfolio extends PortfolioIdParam, PortfolioParams {
  createdAt: number;
  updatedAt: number;
}
export interface PreAsignedUrlParam {
  key: string;
  type: string;
  size: number;
  file: File;
}

export interface PreAsignedUrlResponse {
  url: string;
  fields: {
    key: string;
  };
}
