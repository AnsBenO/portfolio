export interface PortfolioProfile {
  network: string;
  username: string;
  url: string;
}

export interface PortfolioLocation {
  city: string;
  country: string;
}

export interface PortfolioBasics {
  name: string;
  title: string;
  role: string;
  phone: string;
  email: string;
  location: PortfolioLocation;
  profiles: PortfolioProfile[];
  summary: string;
}

export interface PortfolioWorkProject {
  name: string;
  description: string;
  environment?: string;
  startDate?: string;
  endDate?: string;
  highlights: string[];
  technologies: string[];
}

export interface PortfolioWork {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  projects: PortfolioWorkProject[];
}

export interface PortfolioEducation {
  institution: string;
  location: string;
  studyType: string;
  startDate: string;
  endDate: string;
}

export interface PortfolioTraining {
  name: string;
  provider: string;
  location?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  highlights: string[];
}

export interface PortfolioSkills {
  programmingLanguages: string[];
  backend: string[];
  frontend: string[];
  databases: string[];
  devOpsAndTools: string[];
  projectManagement: string[];
  architectureAndDesign: string[];
  maintenanceAndTriaging: string[];
}

export interface PortfolioLanguage {
  language: string;
  fluency: string;
}

export interface PortfolioData {
  basics: PortfolioBasics;
  work: PortfolioWork[];
  education: PortfolioEducation[];
  training: PortfolioTraining[];
  skills: PortfolioSkills;
  languages: PortfolioLanguage[];
}
