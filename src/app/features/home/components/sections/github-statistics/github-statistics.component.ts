import { Component, effect, inject, OnInit } from '@angular/core';
import { GridComponent } from '../../../../../shared/layout/grid/grid.component';
import { SectionContainerComponent } from '../../../../../shared/layout/section-container/section-container.component';
import { SectionHeaderComponent } from '../../../../../shared/layout/section-header/section-header.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { GithubStatisticsService, GithubStats } from '../../../../../core/services/github-statistics.service';
import { LocalizationService } from '../../../../../core/i18n/localization.service';

@Component({
  selector: 'app-github-statistics',
  imports: [GridComponent, SectionContainerComponent, SectionHeaderComponent, BaseChartDirective],
  templateUrl: './github-statistics.component.html',
  styleUrls: ['./github-statistics.component.css'],
})
export class GithubStatisticsComponent implements OnInit {
  publicRepos = 0;
  followers = 0;
  following = 0;
  totalStars = 0;

  // Repository stars
  repositoryStarsData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Stars',
        data: [],
      },
    ],
  };

  repositoryStarsOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Languages
  languagesData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };

  languagesOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Code activity
  codeActivityData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Additions',
        data: [],
        tension: 0.3,
      },
      {
        label: 'Deletions',
        data: [],
        tension: 0.3,
      },
    ],
  };

  codeActivityOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Contribution activity
  contributionData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Commits',
        data: [],
        tension: 0.3,
      },
    ],
  };

  contributionOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };
  private readonly githubStatisticsService = inject(GithubStatisticsService);
  protected readonly localization = inject(LocalizationService);
  private latestStats: GithubStats | null = null;
  isLoading = false;
  hasError = false;

  constructor() {
    effect(() => {
      const locale = this.localization.locale();

      if (this.latestStats) {
        this.updateChartData(this.latestStats, locale);
      }
    });
  }

  ngOnInit(): void {
    this.loadGithubStatistics();
  }

  loadGithubStatistics(): void {
    this.isLoading = true;
    this.hasError = false;

    this.githubStatisticsService.getStats().subscribe({
      next: (stats) => {
        this.followers = stats.followers;
        this.following = stats.following;
        this.totalStars = stats.stars;
        this.publicRepos = stats.repositories?.length ?? 0;

        this.latestStats = stats;
        this.updateChartData(stats, this.localization.locale());
      },
      error: (err) => {
        console.error('Failed to fetch GitHub statistics', err);
        this.hasError = true;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private updateChartData(stats: GithubStats, locale: string): void {
    this.languagesData = {
      labels: (stats.languages ?? []).map((language) => language.name),
      datasets: [
        {
          data: (stats.languages ?? []).map((language) => language.size),
        },
      ],
    };

    this.contributionData = {
      labels: stats.commits.map((commit) =>
        new Date(commit.week).toLocaleDateString(locale, {
          month: 'short',
          day: 'numeric',
        }),
      ),
      datasets: [
        {
          label: this.localization.text('github.chartCommits'),
          data: stats.commits.map((commit) => commit.count),
          tension: 0.3,
        },
      ],
    };

    this.repositoryStarsData = {
      labels: stats.repositories?.map((repository) => repository.name) ?? [],
      datasets: [
        {
          label: this.localization.text('github.chartStars'),
          data: stats.repositories?.map((repository) => repository.stars) ?? [],
        },
      ],
    };

    this.codeActivityData = {
      labels: (stats.codeActivity ?? []).map((activity) =>
        new Date(activity.week).toLocaleDateString(locale, {
          month: 'short',
          day: 'numeric',
        }),
      ),
      datasets: [
        {
          label: this.localization.text('github.chartAdditions'),
          data: stats.codeActivity?.map((activity) => activity.additions) ?? [],
          tension: 0.3,
        },
        {
          label: this.localization.text('github.chartDeletions'),
          data: stats.codeActivity?.map((activity) => activity.deletions) ?? [],
          tension: 0.3,
        },
      ],
    };
  }
}
