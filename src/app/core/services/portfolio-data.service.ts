import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { LocalizationService, Locale, TranslationKey } from '../i18n/localization.service';
import { Achievement } from '../models/achievement.model';
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
  private readonly localization = inject(LocalizationService);

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
  readonly achievements = computed<Achievement[]>(() => this.dataState()?.achievements ?? []);

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
          summary: this.localization.text('experience.summaryFallback', {
            role: workItem.position,
            company: workItem.company,
          }),
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

    const categoryMap: Array<{
      key: keyof PortfolioSkills;
      title: TranslationKey;
      summary: TranslationKey;
    }> = [
      {
        key: 'programmingLanguages',
        title: 'skills.programmingLanguages',
        summary: 'skills.programmingLanguagesSummary',
      },
      {
        key: 'backend',
        title: 'skills.backend',
        summary: 'skills.backendSummary',
      },
      {
        key: 'frontend',
        title: 'skills.frontend',
        summary: 'skills.frontendSummary',
      },
      {
        key: 'databases',
        title: 'skills.databases',
        summary: 'skills.databasesSummary',
      },
      {
        key: 'devOpsAndTools',
        title: 'skills.devOpsAndTools',
        summary: 'skills.devOpsAndToolsSummary',
      },
      {
        key: 'projectManagement',
        title: 'skills.projectManagement',
        summary: 'skills.projectManagementSummary',
      },
      {
        key: 'architectureAndDesign',
        title: 'skills.architectureAndDesign',
        summary: 'skills.architectureAndDesignSummary',
      },
      {
        key: 'maintenanceAndTriaging',
        title: 'skills.maintenanceAndTriaging',
        summary: 'skills.maintenanceAndTriagingSummary',
      },
    ];

    return categoryMap.map((category) => ({
      id: category.key,
      title: this.localization.text(category.title),
      summary: this.localization.text(category.summary),
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
      { label: this.localization.text('about.factRole'), value: basics.role },
      {
        label: this.localization.text('about.factLocation'),
        value: `${basics.location.city}, ${basics.location.country}`,
      },
      {
        label: this.localization.text('about.factProjects'),
        value: `${this.experienceEntries().length}`,
      },
      {
        label: this.localization.text('about.factLanguages'),
        value: `${this.languages().length}`,
      },
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
    effect((onCleanup) => {
      const locale = this.localization.locale();
      this.load(locale, onCleanup);
    });
  }

  private load(locale: Locale, onCleanup: (cleanupFn: () => void) => void): void {
    this.statusState.set('loading');
    this.dataState.set(null);

    const dataPath = locale === 'en' ? 'data.json' : `data.${locale}.json`;
    const subscription = this.http.get<PortfolioData>(dataPath).subscribe({
      next: (data) => {
        this.dataState.set(data);
        this.statusState.set('ready');
      },
      error: (error: unknown) => {
        console.error(`Failed to load portfolio data for locale "${locale}"`, error);
        this.statusState.set('error');
      },
    });
    onCleanup(() => subscription.unsubscribe());
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
      return this.localization.text('date.present');
    }

    if (value.toLowerCase() === 'current') {
      return this.localization.text('date.present');
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(this.localization.locale(), {
      month: 'short',
      year: 'numeric',
    }).format(date);
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

  get getPortfolioData(){
    return this.dataState();
  }
}
