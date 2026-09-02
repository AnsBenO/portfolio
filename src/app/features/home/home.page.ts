import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { SectionSpyService } from '../../core/services/section-spy.service';
import { PageContainerComponent } from '../../shared/layout/page-container/page-container.component';
import { AboutSectionComponent } from './components/sections/about/about-section.component';
import { ExperienceSectionComponent } from './components/sections/experience/experience-section.component';
import { ProjectsSectionComponent } from './components/sections/projects/projects-section.component';
import { SkillsSectionComponent } from './components/sections/skills/skills-section.component';
import { LanguagesSectionComponent } from './components/sections/languages/languages-section.component';
import { ContactSectionComponent } from './components/sections/contact/contact-section.component';
import { IntroSectionComponent } from './components/sections/intro/intro-section.component';
import { GithubStatisticsComponent } from './components/sections/github-statistics/github-statistics.component';

@Component({
  selector: 'page-home',
  imports: [
    PageContainerComponent,
    IntroSectionComponent,
    AboutSectionComponent,
    ExperienceSectionComponent,
    ProjectsSectionComponent,
    GithubStatisticsComponent,
    SkillsSectionComponent,
    LanguagesSectionComponent,
    ContactSectionComponent,
  ],
  template: `
    <ui-page-container spacing="spacious" maxWidth="6xl">
      <intro-section></intro-section>
      <about-section></about-section>
      <experience-section></experience-section>
      <projects-section></projects-section>
      <skills-section></skills-section>
      <app-github-statistics></app-github-statistics>
      <languages-section></languages-section>
      <contact-section></contact-section>
    </ui-page-container>
  `,
})
export class HomePage implements AfterViewInit, OnDestroy {
  private readonly sectionSpy = inject(SectionSpyService);

  protected readonly sectionIds = [
    'home',
    'about',
    'experience',
    'projects',
    'education',
    'training',
    'skills',
    'github-statistics',
    'languages',
    'contact',
  ];

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.sectionSpy.observe(this.sectionIds);
    });
  }

  ngOnDestroy(): void {
    this.sectionSpy.disconnect();
  }
}
