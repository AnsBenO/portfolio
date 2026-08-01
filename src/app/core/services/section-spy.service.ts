import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SectionSpyService implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private observer?: IntersectionObserver;
  private sections: HTMLElement[] = [];
  private suppressed = false;
  private scrollWatchRaf?: number;

  readonly activeSection = signal('home');

  observe(sectionIds: string[]): void {
    this.disconnect();
    if (typeof window === 'undefined') return;

    this.sections = sectionIds
      .map((id) => this.document.getElementById(id))
      .filter((s): s is HTMLElement => s !== null);

    if (this.sections.length === 0) return;

    this.observer = new IntersectionObserver(() => this.updateActiveSection(), {
      root: null,
      threshold: 0,
      rootMargin: '-20% 0px -79% 0px',
    });

    for (const section of this.sections) {
      this.observer.observe(section);
    }

    this.updateActiveSection();
  }

  private updateActiveSection(): void {
    if (this.suppressed) return;

    const triggerLine = window.innerHeight * 0.2;
    let activeId = this.sections[0]?.getAttribute('id') ?? null;

    for (const section of this.sections) {
      if (section.getBoundingClientRect().top <= triggerLine) {
        activeId = section.getAttribute('id');
      } else {
        break;
      }
    }

    if (activeId) this.activeSection.set(activeId);
  }

  scrollTo(sectionId: string): void {
    const section = this.document.getElementById(sectionId);
    if (!section) return;

    this.activeSection.set(sectionId);
    this.cancelScrollWatch();

    const headerOffset = this.getHeaderOffset();
    const target = section.getBoundingClientRect().top + window.scrollY - headerOffset;

    this.suppressed = true;
    window.scrollTo({ top: target, behavior: 'smooth' });

    if (typeof history !== 'undefined') {
      history.replaceState(null, '', `#${sectionId}`);
    }

    this.watchForScrollSettle(target);
  }

  // Polls scrollY on rAF until it stops moving and is close to the
  // target, instead of guessing how long the smooth scroll will take.
  // A hard 3s cap guarantees we never suppress forever.
  private watchForScrollSettle(target: number): void {
    const deadline = performance.now() + 3000;
    let lastY = window.scrollY;
    let stableFrames = 0;

    const check = () => {
      const y = window.scrollY;
      const closeEnough = Math.abs(y - target) < 2;
      const unchanged = Math.abs(y - lastY) < 0.5;
      stableFrames = unchanged ? stableFrames + 1 : 0;
      lastY = y;

      if ((closeEnough && stableFrames >= 2) || performance.now() > deadline) {
        this.suppressed = false;
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
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) {
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
