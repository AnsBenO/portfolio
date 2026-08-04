import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Experience } from '../models/experience.model';
import { Project } from '../models/project.model';
import {
  PortfolioBasics,
  PortfolioData,
  PortfolioEducation,
  PortfolioLanguage,
  PortfolioProject,
  PortfolioProfile,
  PortfolioSkills,
  PortfolioTraining,
  PortfolioWork,
} from '../models/portfolio-data.model';
import { SkillCategory } from '../models/skill.model';

export interface AboutFact {
  label: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {
  private readonly http = inject(HttpClient);

  private readonly dataState = signal<PortfolioData | null>(null);
  private readonly statusState = signal<'idle' | 'loading' | 'ready' | 'error'>('idle');

  readonly status = this.statusState.asReadonly();
  readonly isReady = computed(() => this.statusState() === 'ready');

  readonly basics = computed<PortfolioBasics | null>(() => this.dataState()?.basics ?? null);
  readonly profiles = computed<PortfolioProfile[]>(() => this.basics()?.profiles ?? []);
  readonly work = computed<PortfolioWork[]>(() => this.dataState()?.work ?? []);
  readonly education = computed<PortfolioEducation[]>(() => this.dataState()?.education ?? []);
  readonly training = computed<PortfolioTraining[]>(() => this.dataState()?.training ?? []);
  readonly projects = computed<Project[]>(() =>
    (this.dataState()?.projects ?? []).map((project) => this.toProject(project)),
  );
  readonly skills = computed<PortfolioSkills | null>(() => this.dataState()?.skills ?? null);
  readonly languages = computed<PortfolioLanguage[]>(() => this.dataState()?.languages ?? []);

  readonly experienceEntries = computed<Experience[]>(() => {
    const entries: Experience[] = [];

    for (const workItem of this.work()) {
      const projects = workItem.projects ?? [];

      if (projects.length === 0) {
        entries.push({
          id: this.slugify(`${workItem.company}-${workItem.position}`),
          role: workItem.position,
          company: workItem.company,
          period: this.formatDateRange(workItem.startDate, workItem.endDate),
          location: workItem.location,
          summary: `${workItem.position} at ${workItem.company}`,
          highlights: [],
          technologies: [],
        });
        continue;
      }

      for (const project of projects) {
        entries.push({
          id: this.slugify(`${workItem.company}-${project.name}`),
          role: project.name,
          company: workItem.company,
          period: this.formatDateRange(
            project.startDate ?? workItem.startDate,
            project.endDate ?? workItem.endDate,
          ),
          location: workItem.location,
          summary: project.description,
          highlights: project.highlights ?? [],
          technologies: project.technologies ?? [],
        });
      }
    }

    return entries;
  });

  readonly skillCategories = computed<SkillCategory[]>(() => {
    const skills = this.skills();

    if (!skills) {
      return [];
    }

    const categoryMap: Array<{ key: keyof PortfolioSkills; title: string; summary: string }> = [
      {
        key: 'programmingLanguages',
        title: 'Programming Languages',
        summary: 'Core languages used in production software delivery.',
      },
      {
        key: 'backend',
        title: 'Backend',
        summary: 'API, platform, and testing capabilities for server-side development.',
      },
      {
        key: 'frontend',
        title: 'Frontend',
        summary: 'User-interface frameworks and rendering patterns.',
      },
      {
        key: 'databases',
        title: 'Databases',
        summary: 'Data modeling and relational persistence technologies.',
      },
      {
        key: 'devOpsAndTools',
        title: 'DevOps and Tools',
        summary: 'Automation, infrastructure, and operational tooling.',
      },
      {
        key: 'projectManagement',
        title: 'Project Management',
        summary: 'Delivery methods and collaboration workflows.',
      },
      {
        key: 'architectureAndDesign',
        title: 'Architecture and Design',
        summary: 'Design principles used to shape scalable systems.',
      },
      {
        key: 'maintenanceAndTriaging',
        title: 'Maintenance and Triaging',
        summary: 'Production issue handling and service reliability practices.',
      },
    ];

    return categoryMap.map((category) => ({
      id: category.key,
      title: category.title,
      summary: category.summary,
      skills: skills[category.key].map((name, index) => ({
        name,
        level: Math.max(64, 92 - index * 4),
      })),
    }));
  });

  readonly aboutFacts = computed<AboutFact[]>(() => {
    const basics = this.basics();

    if (!basics) {
      return [];
    }

    return [
      { label: 'Role', value: basics.role },
      { label: 'Location', value: `${basics.location.city}, ${basics.location.country}` },
      { label: 'Work Projects', value: `${this.experienceEntries().length}` },
      { label: 'Languages', value: `${this.languages().length}` },
    ];
  });

  readonly topTechnologies = computed<string[]>(() => {
    const skills = this.skills();

    if (!skills) {
      return [];
    }

    const buckets = Object.values(skills).flat();
    return Array.from(new Set(buckets)).slice(0, 10);
  });

  constructor() {
    this.load();
  }

  private load(): void {
    const status = this.statusState();

    if (status === 'loading' || status === 'ready') {
      return;
    }

    this.statusState.set('loading');

    this.http.get<PortfolioData>('data.json').subscribe({
      next: (data) => {
        this.dataState.set(data);
        this.statusState.set('ready');
      },
      error: () => {
        this.statusState.set('error');
      },
    });
  }

  private formatDateRange(start?: string, end?: string): string {
    if (!start && !end) {
      return '';
    }

    const startLabel = this.formatDate(start);
    const endLabel = this.formatDate(end);

    return `${startLabel} - ${endLabel}`;
  }

  private formatDate(value?: string): string {
    if (!value) {
      return 'Present';
    }

    if (value.toLowerCase() === 'current') {
      return 'Present';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
  }

  private slugify(value: string): string {
    let normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    while (normalized.startsWith('-')) {
      normalized = normalized.slice(1);
    }

    while (normalized.endsWith('-')) {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  }

  private toProject(project: PortfolioProject): Project {
    return {
      id: project.id || this.slugify(project.title),
      title: project.title,
      thumbnailUrl: project.thumbnailUrl,
      summary: project.summary,
      description: project.description,
      category: project.category,
      technologies: project.technologies ?? [],
      featured: project.featured ?? false,
      liveUrl: project.liveUrl,
      sourceUrl: project.sourceUrl,
    };
  }
}
