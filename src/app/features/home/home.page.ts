import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { SectionSpyService } from '../../core/services/section-spy.service';
import { PageContainerComponent } from '../../shared/layout/page-container/page-container.component';
import { AboutSectionComponent } from './components/sections/about-section.component';
import { ContactSectionComponent } from './components/sections/contact-section.component';
import { EducationSectionComponent } from './components/sections/education-section.component';
import { ExperienceSectionComponent } from './components/sections/experience-section.component';
import { HomeSectionComponent } from './components/sections/home-section.component';
import { LanguagesSectionComponent } from './components/sections/languages-section.component';
import { SkillsSectionComponent } from './components/sections/skills-section.component';
import { TrainingSectionComponent } from './components/sections/training-section.component';

@Component({
  selector: 'page-home',
  imports: [
    PageContainerComponent,
    HomeSectionComponent,
    AboutSectionComponent,
    ExperienceSectionComponent,
    EducationSectionComponent,
    TrainingSectionComponent,
    SkillsSectionComponent,
    LanguagesSectionComponent,
    ContactSectionComponent,
  ],
  template: `
    <ui-page-container spacing="spacious" maxWidth="6xl">
      <home-section></home-section>
      <about-section></about-section>
      <experience-section></experience-section>
      <education-section></education-section>
      <training-section></training-section>
      <skills-section></skills-section>
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
    'education',
    'training',
    'skills',
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
