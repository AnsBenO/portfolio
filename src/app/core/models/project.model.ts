export type ProjectCategory = 'web' | 'mobile' | 'api' | 'platform';

export interface Project {
  id: string;
  title: string;
  thumbnailUrl?: string;
  summary?: string;
  description?: string;
  category?: ProjectCategory;
  technologies: string[];

  featured?: boolean;
  liveUrl?: string;
  sourceUrl?: string;
}
