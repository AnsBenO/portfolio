import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SectionSpyService implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private observer?: IntersectionObserver;
  private sections: HTMLElement[] = [];
  private isScrollSuppressed = false;
  private scrollWatchRaf?: number;

  readonly activeSection = signal('home');

  observe(sectionIds: string[]): void {
    this.disconnect();
    if (typeof window === 'undefined') return;

    this.sections = this.getTrackedSections(sectionIds);
    if (this.sections.length === 0) return;

    this.observer = new IntersectionObserver(() => this.updateActiveSection(), {
      root: null,
      threshold: 0,
      rootMargin: '-15% 0px -79% 0px',
    });

    for (const section of this.sections) {
      this.observer.observe(section);
    }

    this.updateActiveSection();
  }

  private getTrackedSections(sectionIds: string[]): HTMLElement[] {
    return sectionIds
      .map((id) => this.document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
  }

  private updateActiveSection(): void {
    if (this.isScrollSuppressed) return;

    const activeSectionId = this.getActiveSectionId();
    if (activeSectionId) {
      this.activeSection.set(activeSectionId);
    }
  }

  private getActiveSectionId(): string | null {
    const triggerLine = window.innerHeight * 0.275;
    let activeId = this.sections[0]?.id ?? null;

    for (const section of this.sections) {
      if (section.getBoundingClientRect().top <= triggerLine) {
        activeId = section.id;
        continue;
      }

      break;
    }

    return activeId;
  }

  scrollTo(sectionId: string): void {
    const section = this.document.getElementById(sectionId);
    if (!section) return;

    this.activeSection.set(sectionId);
    this.cancelScrollWatch();

    const target = this.getScrollTarget(section);
    this.isScrollSuppressed = true;
    window.scrollTo({ top: target, behavior: 'smooth' });

    if (typeof history !== 'undefined') {
      history.replaceState(null, '', `#${sectionId}`);
    }

    this.watchForScrollSettle(target);
  }

  private getScrollTarget(section: HTMLElement): number {
    const headerOffset = this.getHeaderOffset();
    return section.getBoundingClientRect().top + window.scrollY - headerOffset;
  }

  // Polls scrollY on rAF until it stops moving and is close to the
  // target, instead of guessing how long the smooth scroll will take.
  // A hard 3s cap guarantees we never suppress forever.
  private watchForScrollSettle(target: number): void {
    const deadline = performance.now() + 3000;
    let lastY = window.scrollY;
    let stableFrames = 0;

    const check = () => {
      const currentY = window.scrollY;
      const closeEnough = Math.abs(currentY - target) < 2;
      const unchanged = Math.abs(currentY - lastY) < 0.5;
      stableFrames = unchanged ? stableFrames + 1 : 0;
      lastY = currentY;

      if ((closeEnough && stableFrames >= 2) || performance.now() > deadline) {
        this.isScrollSuppressed = false;
        this.scrollWatchRaf = undefined;
        return;
      }

      this.scrollWatchRaf = requestAnimationFrame(check);
    };

    this.scrollWatchRaf = requestAnimationFrame(check);
  }

  private cancelScrollWatch(): void {
    if (this.scrollWatchRaf !== undefined) {
      cancelAnimationFrame(this.scrollWatchRaf);
      this.scrollWatchRaf = undefined;
    }
  }

  private getHeaderOffset(): number {
    if (window.matchMedia('(min-width: 768px)').matches) {
      return 45;
    }

    const header = this.document.querySelector('header.sticky') as HTMLElement | null;
    return (header?.offsetHeight ?? 0) + 16;
  }

  disconnect(): void {
    this.cancelScrollWatch();
    this.observer?.disconnect();
    this.observer = undefined;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
