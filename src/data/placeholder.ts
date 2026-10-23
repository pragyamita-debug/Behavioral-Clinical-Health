import type { Resume } from '../lib/types';

/**
 * What the page shows before anyone uploads a CV: the full design, filled with
 * neutral placeholder text. Uploading a CV replaces every field below.
 */
export const placeholder: Resume = {
  name: 'Your Name',
  headline: 'Your Role | Your Field',
  tagline: 'One sentence about the work you do and the change you want it to make.',
  email: 'you@example.com',
  phone: '+00 00000 00000',
  location: 'Your City, Country',
  links: {
    linkedin: 'https://www.linkedin.com/',
    github: 'https://github.com/',
  },
  summary:
    'Two or three sentences about who you are, what you are curious about and the kind of work you want to do next. Upload a CV and this is replaced by your own profile.',
  motto: 'Better choices. Brighter futures.',

  experience: [
    {
      role: 'Your Current Role',
      company: 'Organisation Name',
      period: '2024 – Present',
      current: true,
      months: 0,
      bullets: ['What you are responsible for.', 'A result you are proud of, with a number if you have one.'],
    },
    {
      role: 'Previous Role',
      company: 'Organisation Name',
      period: '2022 – 2024',
      current: false,
      months: 0,
      bullets: ['What you delivered there.'],
    },
  ],

  education: [
    { degree: 'Your Degree in Your Subject', short: 'M.A.', field: 'Your Subject', institution: 'Your University', year: '2022', rank: 4 },
    { degree: 'Your First Degree', short: 'B.A.', field: 'Your Subject', institution: 'Your University', year: '2020', rank: 3 },
  ],

  skills: ['Skill One', 'Skill Two', 'Skill Three', 'Skill Four', 'Skill Five', 'Skill Six', 'Skill Seven', 'Skill Eight'],

  projects: [
    { title: 'Project One', meta: 'Project type', description: 'What you studied or built, in one line.', tags: [] },
    { title: 'Project Two', meta: 'Project type', description: 'Who it helped and how.', tags: [] },
    { title: 'Project Three', meta: 'Project type', description: 'What you found or changed.', tags: [] },
    { title: 'Project Four', meta: 'Project type', description: 'The result you can measure.', tags: [] },
    { title: 'Project Five', meta: 'Project type', description: 'Anything else worth showing.', tags: [] },
  ],

  achievements: ['An award or recognition you received', 'A milestone you reached'],
  certifications: ['A certification you hold'],

  goals: [
    { label: 'Goal', value: 'Your next milestone', note: 'a measurable target' },
    { label: 'Next Step', value: 'What you are learning or building now' },
  ],

  interests: ['Interest One', 'Interest Two', 'Interest Three'],
  languages: [],

  stats: { years: 2, yearsPlus: true, projects: 5, projectsPlus: false, skills: 8 },
};
