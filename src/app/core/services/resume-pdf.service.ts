import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PortfolioData, PortfolioWork, PortfolioWorkProject } from '../models/portfolio-data.model';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Injectable({
  providedIn: 'root',
})
export class ResumePdfService {
  generate(data: PortfolioData): void {
    const documentDefinition = {
      pageSize: 'A4',

      pageMargins: [36, 32, 36, 36],

      content: [
        this.buildHeader(data),
        this.buildSectionTitle('PROFILE'),
        this.buildSummary(data.basics.summary),

        this.buildSectionTitle('PROFESSIONAL EXPERIENCE'),
        ...this.buildExperience(data.work),

        this.buildSectionTitle('TECHNICAL SKILLS'),
        this.buildSkills(data.skills),

        this.buildSectionTitle('LANGUAGES'),
        this.buildLanguages(data.languages),
      ],

      styles: this.buildStyles(),

      defaultStyle: {
        font: 'Roboto',
        fontSize: 9,
      },
    };

    (pdfMake as any).createPdf(documentDefinition).download('Anass-Benomar-Resume.pdf');
  }

  private buildHeader(data: PortfolioData): any {
    const { basics } = data;

    const profileLinks = basics.profiles.flatMap((profile, index) => {
      const items: any[] = [
        {
          text: profile.network,
          link: this.normalizeUrl(profile.url),
          style: 'link',
        },
      ];

      if (index < basics.profiles.length - 1) {
        items.push({
          text: ' · ',
          style: 'contact',
        });
      }

      return items;
    });

    return {
      stack: [
        {
          text: basics.name.toUpperCase(),
          style: 'name',
        },
        {
          text: basics.title,
          style: 'title',
        },
        {
          text: `${basics.location.city}, ${basics.location.country}`,
          style: 'contact',
        },
        {
          text: basics.email,
          link: `mailto:${basics.email}`,
          style: 'link',
        },
        {
          text: profileLinks,
          margin: [0, 1, 0, 1],
        },
      ],
      margin: [0, 0, 0, 10],
    };
  }
  private normalizeUrl(url: string): string {
    // Handles URLs that might accidentally contain Markdown links:
    // [https://github.com/AnsBenO](https://github.com/AnsBenO)

    const markdownMatch = url.match(/\]\((https?:\/\/[^)]+)\)/);

    if (markdownMatch) {
      return markdownMatch[1];
    }

    return url;
  }

  private buildSectionTitle(title: string): any {
    return {
      text: title,
      style: 'sectionTitle',
    };
  }

  private buildSummary(summary: string): any {
    return {
      text: summary,
      style: 'summary',
    };
  }

  private buildExperience(work: PortfolioWork[]): any[] {
    return work.flatMap((company) => [
      {
        text: [
          {
            text: company.company,
            style: 'company',
          },
          {
            text: ` · ${company.position}   `,
            style: 'position',
          },
          {
            text: `${this.formatDateRange(company.startDate, company.endDate)}`,
            style: 'date',
          },
        ],
        margin: [0, 6, 0, 4],
      },

      ...company.projects.map((project) => this.buildWorkProject(project)),
    ]);
  }

  private buildWorkProject(project: PortfolioWorkProject): any {
    return {
      stack: [
        {
          text: [
              {
                  text: `${project.name}    `,
                  style: 'projectName',
                },
                {
                  text: `${this.formatDateRange(project.startDate, project.endDate)}  `,
                  style: 'projectDate',
                },
          ],
        },

        {
          text: project.description,
          style: 'description',
        },

        ...(project.environment
          ? [
              {
                text: project.environment,
                style: 'environment',
              },
            ]
          : []),

        {
          ul: project.highlights,
          style: 'bullet',
        },

        {
          text: [
            {
              text: 'Technologies: ',
              bold: true,
            },
            project.technologies.join(' · '),
          ],
          style: 'technologies',
        },
      ],

      margin: [8, 0, 0, 6],
    };
  }
  private buildSkills(skills: PortfolioData['skills']): any {
    const groups = [
      ['Programming Languages', skills.programmingLanguages],
      ['Backend', skills.backend],
      ['Frontend', skills.frontend],
      ['Databases', skills.databases],
      ['DevOps & Tools', skills.devOpsAndTools],
      ['Project Management', skills.projectManagement],
      ['Architecture & Design', skills.architectureAndDesign],
      ['Maintenance & Triaging', skills.maintenanceAndTriaging],
    ];

    return {
      table: {
        widths: [120, '*'],
        body: groups.map(([name, values]) => [
          {
            text: name,
            style: 'skillName',
            border: [false, false, false, false],
          },
          {
            text: (values as string[]).join(' · '),
            style: 'skillValues',
            border: [false, false, false, false],
          },
        ]),
      },

      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingTop: () => 2,
        paddingBottom: () => 2,
        paddingLeft: () => 0,
        paddingRight: () => 5,
      },
    };
  }

  private buildLanguages(languages: PortfolioData['languages']): any {
    return {
      columns: languages.map((language) => ({
        width: '*',
        stack: [
          {
            text: language.language,
            style: 'languageName',
          },
          {
            text: this.simplifyFluency(language.fluency),
            style: 'languageLevel',
          },
        ],
      })),
    };
  }

  private formatDateRange(startDate?: string, endDate?: string): string {
    if (!startDate && !endDate) {
      return '';
    }

    const start = startDate ? this.formatDate(startDate) : '';

    const end = endDate ? this.formatDate(endDate) : 'Present';

    return `${start} – ${end}`;
  }

  private formatDate(date: string): string {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  private simplifyFluency(fluency: string): string {
    const cefr = fluency.match(/\b(A1|A2|B1|B2|C1|C2)\b/i);

    if (cefr) {
      return cefr[1].toUpperCase();
    }

    if (/native/i.test(fluency)) {
      return 'Native';
    }

    return fluency;
  }

  private buildStyles(): any {
    return {
      name: {
        fontSize: 22,
        bold: true,
        color: '#111827',
      },

      title: {
        fontSize: 11,
        color: '#4B5563',
        margin: [0, 2, 0, 5],
      },

      contact: {
        fontSize: 8,
        color: '#4B5563',
        margin: [0, 1, 0, 1],
      },

      link: {
        fontSize: 8,
        color: '#2563EB',
        margin: [0, 1, 0, 1],
      },

      sectionTitle: {
        fontSize: 10,
        bold: true,
        color: '#111827',
        margin: [0, 12, 0, 6],
      },

      summary: {
        fontSize: 8.5,
        color: '#374151',
        lineHeight: 1.3,
      },

      date: {
        fontSize: 8,
        color: '#6B7280',
      },

      company: {
        fontSize: 10,
        bold: true,
        color: '#111827',
      },

      position: {
        fontSize: 9,
        color: '#111827',
      },

      projectName: {
        fontSize: 9.5,
        bold: true,
        color: '#1F2937',
      },

      projectDate: {
        fontSize: 7.5,
        color: '#6B7280',
      },

      description: {
        fontSize: 8,
        italics: true,
        color: '#6B7280',
        margin: [0, 2, 0, 2],
      },

      environment: {
        fontSize: 7.5,
        italics: true,
        color: '#6B7280',
      },

      bullet: {
        fontSize: 8,
        color: '#374151',
        lineHeight: 1.2,
        margin: [0, 2, 0, 2],
      },

      technologies: {
        fontSize: 7.5,
        color: '#4B5563',
      },

      skillName: {
        fontSize: 8,
        bold: true,
        color: '#374151',
      },

      skillValues: {
        fontSize: 8,
        color: '#4B5563',
      },

      languageName: {
        fontSize: 8.5,
        bold: true,
        color: '#1F2937',
      },

      languageLevel: {
        fontSize: 7.5,
        color: '#6B7280',
        margin: [0, 1, 0, 0],
      },
    };
  }
}
