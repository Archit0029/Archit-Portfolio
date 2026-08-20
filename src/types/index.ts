export type Project = {
  title: string;
  description: string;
  tags: string[];
  link: string;
  image?: string;
  github?: string;
  demo?: string;
  highlight?: string;
};

export type Stat = {
  label: string;
  value: string;
};

export type EducationItem = {
  institution: string;
  degree: string;
  period: string;
  description: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  type: string;
  description: string;
  stack: string[];
};

export type SkillGroup = {
  title: string;
  items: string[];
  accent: string;
};

export type CertificationItem = {
  name: string;
  issuer: string;
  date: string;
  credential: string;
  link: string;
};

export type AchievementItem = {
  title: string;
  detail: string;
};

export type InterestItem = {
  label: string;
  icon: string;
};

export type SocialLink = {
  label: string;
  url: string;
  icon: string;
};

export type AnalyticsStat = {
  label: string;
  value: string;
};
