import Project from '../types/project';

export const projects: Project[] = [
  {
    title: 'PulseAPI',
    description:
      'A real-time API monitoring platform built with Node.js, Express.js, RabbitMQ, MongoDB, PostgreSQL, and Docker for monitoring API performance and processing telemetry events.',
    category: ['Backend', 'Full-Stack', 'SaaS'],
    technologies: [
      'Node.js',
      'Express.js',
      'RabbitMQ',
      'MongoDB',
      'PostgreSQL',
      'Docker',
      'LRU Cache',
      'k6',
    ],
    link: 'https://github.com/Katari-8055/PulseAPI',
    metrics: 'Throughput: 310 → 780 RPS (2.5x)',
    highlights: [
      'Engineered reliable event processing with retry mechanisms, exponential backoff with jitter, circuit breaker, idempotency checks, and DLQ handling, validated through k6 load testing.',
      'Optimized API key authentication with an in-memory LRU cache and 10-minute TTL, eliminating redundant MongoDB reads and boosting throughput by 2.5× from 310 to 780 RPS.',
    ],
  },
  {
    title: 'WorkSphere',
    description:
      'A multi-tenant HR Management Platform for managing employees, departments, projects, tasks, attendance, and leave across isolated workspaces.',
    category: ['Full-Stack', 'SaaS'],
    technologies: [
      'Node.js',
      'Express.js',
      'PostgreSQL',
      'Prisma',
      'React',
      'Socket.IO',
    ],
    link: 'https://github.com/Katari-8055/MultiTenantHRM',
    metrics: 'Multi-Tenant Architecture',
    highlights: [
      'Designed backend architecture using Node.js, Express.js, PostgreSQL, and Prisma ORM with RBAC, tenant-aware authorization, and secure RESTful APIs.',
      'Implemented Socket.IO real-time notifications and modular backend services, improving scalability, maintainability, and collaboration across multiple user roles.',
    ],
  },
  {
    title: 'Grosify',
    description:
      'A full-stack grocery web application with a responsive frontend built in vanilla JavaScript, CSS, and HTML. Features a Node.js and Express backend with payment gateway integration for seamless online shopping.',
    category: ['Full-Stack'],
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'Node.js', 'Express', 'Payment API'],
    link: 'https://github.com/Katari-8055/Grosify',
    highlights: [
      'Integrated secure payment gateway for automated order processing and invoice generation.',
      'Constructed custom dynamic shopping cart and real-time inventory management backend APIs.',
    ],
  },
];

export default projects;
