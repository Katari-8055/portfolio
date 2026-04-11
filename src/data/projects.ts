import Project from '../types/project';

export const projects: Project[] = [
  {
    title: 'CMS',
    description: 'A multi-tenant company management system where a company can manage HR, employees, Manager, projects, leaves, payroll, Tasks and notifications.',
    category: ['Full-Stack', 'SaaS'],
    technologies: [
      'JavaScript',
      'React.js',
      'Node.js',
      'Express.js',
      'PostgreSQL',
      'Prisma',
      'Socket.IO',
    ],
    link: 'https://github.com/Katari-8055/MultiTenantHRM',
  },
  {
    title: 'Grosify',
    description: 'Grosify is a full-stack grocery web application with a responsive frontend built in vanilla JavaScript, CSS, and HTML. It features a Node.js and Express-powered backend with payment gateway integration for seamless online shopping.',
    category: ['Full-Stack'],
    technologies: ['JavaScript', 'CSS', 'HTML', 'Node.js', 'Express'],
    link: 'https://github.com/Katari-8055/Grosify',
  },
];

export default projects;
