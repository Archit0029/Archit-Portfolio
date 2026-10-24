import type {
  AchievementItem,
  AnalyticsStat,
  CertificationItem,
  EducationItem,
  ExperienceItem,
  InterestItem,
  Project,
  SkillGroup,
  SocialLink,
  Stat,
} from '../types';

export const CONTACT_EMAIL = 'architbishnoi177@gmail.com';

export const profile = {
  name: 'Archit Bishnoi',
  title: 'BCA Student • Full-Stack Web & Mobile Developer',
  status: 'Driven BCA student open to internships and project opportunities',
  university: 'Bachelor of Computer Applications (BCA), CGC Jhanjeri, Mohali, Punjab',
  bio: 'BCA student with project and internship experience in web and mobile application development using JavaScript, React, Firebase, and Flutter.',
  completion: 100,
  image: 'https://avatars.githubusercontent.com/u/214365719?v=4',
  coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  email: CONTACT_EMAIL,
  phone: '+91 6284946919',
  address: 'Mohali, Punjab, India',
};

export const stats: Stat[] = [
  { label: 'Featured projects', value: '3' },
  { label: 'Verified certificates', value: '3' },
  { label: 'Skill areas', value: '4' },
];

export const analytics: AnalyticsStat[] = [
  { label: 'Visitors', value: '0' },
  { label: 'Portfolio views', value: '0' },
  { label: 'Resume downloads', value: '0' },
  { label: 'Shares', value: '0' },
];

export const education: EducationItem[] = [
  {
    institution: 'CGC Jhanjeri, Mohali',
    degree: 'Bachelor of Computer Applications (BCA)',
    period: '2025 – 2028',
    description: 'Pursuing BCA with practical app development projects and technology-driven solutions.',
  },
  {
    institution: 'Govt. Model Senior Secondary School, Abohar',
    degree: 'Intermediate of Commerce (I.Com)',
    period: '2023 – 2025',
    description: 'Completed Intermediate of Commerce (I.Com).',
  },
];

export const skillGroups: SkillGroup[] = [
  { title: 'Programming', items: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'HTML', 'CSS'], accent: '#4cc9f0' },
  { title: 'Tools & Platforms', items: ['Firebase', 'Flutter', 'MS Office', 'Git', 'GitHub', 'VS Code'], accent: '#3b82f6' },
  { title: 'Soft Skills', items: ['Active Listening', 'Time Management', 'Team Management', 'Creative Problem Solving', 'Smart Working', 'Communication'], accent: '#10b981' },
];

export const experience: ExperienceItem[] = [
  {
    company: 'IntrnForte',
    role: 'Application Developer Intern',
    period: 'Apr 2026 – Present',
    type: 'Internship',
    description: 'Working remotely as a full-stack developer, contributing to web and app development, feature implementation, and product improvements.',
    stack: ['JavaScript', 'HTML', 'CSS', 'Firebase', 'Flutter'],
  },
];

export const projects: Project[] = [
  {
    title: 'ServiceArc',
    description: 'Smart service management platform that connects customers with service providers through a seamless digital interface.',
    tags: ['Web', 'Service Management', 'Real-Time Tracking'],
    link: 'https://github.com/Archit0029/ServiceArc',
    github: 'https://github.com/Archit0029/ServiceArc',
    demo: 'https://github.com/Archit0029/ServiceArc',
    highlight: 'Service request and provider task management',
  },
  {
    title: 'Web Development Online',
    description: 'Web development learning resources and demo projects created to teach frontend fundamentals.',
    tags: ['HTML', 'CSS', 'Web'],
    link: 'https://github.com/Archit0029/Web-Development-online',
    github: 'https://github.com/Archit0029/Web-Development-online',
    demo: 'https://github.com/Archit0029/Web-Development-online',
    highlight: 'Frontend development showcase',
  },
  {
    title: 'CampusConnect',
    description: 'Campus community app designed to connect students, manage campus resources, and share event information.',
    tags: ['Campus', 'Community', 'Web'],
    link: 'https://github.com/Archit0029/CampusConnect',
    github: 'https://github.com/Archit0029/CampusConnect',
    demo: 'https://github.com/Archit0029/CampusConnect',
    highlight: 'Student networking and campus resource sharing',
  },
];

export const certifications: CertificationItem[] = [
  {
    name: 'AI Upscaling Certification — Technical Foundation',
    issuer: 'Qualcomm Academy',
    date: '2025',
    credential: 'AI Upscaling',
    link: '',
  },
  {
    name: 'Basic Computer Application Certificate',
    issuer: 'Education Hub, Abohar',
    date: '2024',
    credential: 'Basic Computer Applications',
    link: '',
  },
  {
    name: 'C Programming for BCA',
    issuer: 'Data Flair',
    date: '2025',
    credential: 'C Programming for BCA',
    link: '',
  },
  {
    name: 'AI Tools and ChatGPT Workshop',
    issuer: 'Be10x',
    date: '2026',
    credential: 'AI Tools Workshop',
    link: '',
  },
  {
    name: 'YUVA AI for ALL',
    issuer: 'GUVI • HCL',
    date: '2025',
    credential: '369A4yK84dOm71ro62',
    link: 'https://www.guvi.in/certificate?id=369A4yK84dOm71ro62',
  },
  {
    name: 'ChatGPT for Everyone',
    issuer: 'GUVI • HCL',
    date: '2025',
    credential: '1G6i9611q6p71o5Q8k',
    link: 'https://www.guvi.in/certificate?id=1G6i9611q6p71o5Q8k',
  },
  {
    name: 'Introduction to Data Engineering and Big Data',
    issuer: 'GUVI • HCL',
    date: '2025',
    credential: 'qy961o1T6p975g729H',
    link: 'https://www.guvi.in/certificate?id=qy961o1T6p975g729H',
  },
  {
    name: 'Introduction to Cybersecurity Awareness',
    issuer: 'HP Life Foundation',
    date: '2025',
    credential: 'Cybersecurity Awareness',
    link: '',
  },
  {
    name: 'Presenting Data',
    issuer: 'HP Life Foundation',
    date: '2025',
    credential: 'Presenting Data',
    link: '',
  },
  {
    name: 'Microsoft Power BI Data Analyst Associate Prep',
    issuer: 'Microsoft Press',
    date: '2025',
    credential: 'PL-300 Prep',
    link: '',
  },
];

export const achievements: AchievementItem[] = [
  {
    title: 'Full-stack app development',
    detail: 'Built real-world e-commerce, delivery, and social media applications during BCA studies.',
  },
  {
    title: 'AI and data certifications',
    detail: 'Completed certificates and training from GUVI, Qualcomm Academy, and HP Life.',
  },
  {
    title: 'Commerce and technical blend',
    detail: 'Combines commerce education with practical software development and business solution skills.',
  },
];

export const interests: InterestItem[] = [
  { label: 'Web designing', icon: '🌐' },
  { label: 'AI integration', icon: '🤖' },
  { label: 'Business solutions', icon: '💼' },
  { label: 'Software development', icon: '🛠️' },
  { label: 'Learning new tools', icon: '📘' },
  { label: 'Problem solving', icon: '🧩' },
];

export const socialLinks: SocialLink[] = [
  { label: 'LinkedIn', url: 'https://linkedin.com/in/archit-29bishnoi', icon: 'in' },
  { label: 'GitHub', url: 'https://github.com/Archit0029', icon: 'gh' },
];

export const contactDetails = {
  email: 'architbishnoi177@gmail.com',
  phone: '+91 6284946919',
  address: 'Mohali, Punjab, India',
};
