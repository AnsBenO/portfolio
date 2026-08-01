export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: 'web' | 'mobile' | 'api' | 'platform';
  technologies: string[];
  featured: boolean;
  liveUrl?: string;
  sourceUrl?: string;
}
