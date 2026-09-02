import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GithubStats {
  username:           string;
  name:               string;
  followers:          number;
  following:          number;
  publicRepositories: number;
  commits:            Commit[];
  prs:                number;
  issues:             number;
  stars:              number;
  forks:              number;
  repositories:       Repository[];
  codeActivity:       CodeActivity[];
  languages:          LanguageElement[];
}

export interface CodeActivity {
  week:      string;
  additions: number;
  deletions: number;
}

export interface Commit {
  week:  string;
  count: number;
}

export interface LanguageElement {
  name: string;
  size: number;
}

export interface Repository {
  name:        string;
  url:         string;
  description: null | string;
  stars:       number;
  forks:       number;
  language:    string;
  isFork:      boolean;
  updatedAt:   string;
}


@Injectable({
  providedIn: 'root',
})
export class GithubStatisticsService {
  private readonly http = inject(HttpClient);

  getStats(): Observable<GithubStats> {
    return this.http.get<GithubStats>(
      environment.github.apiUrl,
    );
  }
}
