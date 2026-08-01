export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  summary: string;
  skills: SkillItem[];
}
