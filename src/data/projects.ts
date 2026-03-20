import Project from '../types/project';

export const projects: Project[] = [
  {
    title: 'Spawn',
    description: 'Spawn your own websites with just a prompt.',
    category: ['Full-Stack', 'AI'],
    technologies: ['Next.js', 'Node.js', 'LangGraph', 'PostgreSQL', 'E2B'],
    link: 'https://spawn.spandev.site/',
  },
  {
    title: 'Critique',
    description: 'A website that judges you based on your media interests.',
    category: ['Full-Stack', 'AI'],
    technologies: ['Next.js', 'Typescript', 'OpenRouter'],
    link: 'https://critique.spandev.site/',
  },
  {
    title: 'Second Brain',
    description: 'Media management system which helps users to store their content and share it with others, all in one place.',
    category: ['Full-Stack'],
    technologies: ['React', 'Node', 'Express', 'MongoDB', 'Typescript', 'Tailwind CSS'],
    link: 'https://github.com/Spandan-Mishra/second-brain',
  },
  {
    title: 'Qwator',
    description: 'A decentralized platform to help creators choose metadata for high CTA based on crowdsourced results.',
    category: ['Web3'],
    technologies: ['Next', 'Node', 'Typescript', 'Prisma', 'Solana', 'ShadCN', 'Supabase'],
    link: 'https://github.com/Spandan-Mishra/qwator',
  },
  {
    title: 'College Football',
    description: 'College Football is designed in order to make the gaming experience of football games more fun, interactive and enjoyable by introducing features to customize the gameplay.',
    category: ['Full-Stack'],
    technologies: ['Python', 'Flask'],
    link: 'https://github.com/Spandan-Mishra/college-football',
  },
  {
    title: 'Terminal Pong',
    description: 'A terminal based multiplayer pong game',
    category: ['Experimenting'],
    technologies: ['Go'],
    link: 'https://github.com/Spandan-Mishra/terminal-pong',
  },
  {
    title: 'PayTM',
    description: 'A clone of PayTM with basic features like money transfer, balance check, transaction history etc.',
    category: ['Full-Stack'],
    technologies: ['React', 'Node', 'Express', 'MongoDB', 'Javascript', 'CSS'],
    link: 'https://github.com/Spandan-Mishra/PayTM',
  },
  {
    title: 'Om Tours',
    description: 'An AI powered travel website that provides personalized tour packages based on user preferences and budget.',
    category: ['Hackathons'],
    technologies: ['React', 'Node', 'Express', 'Gemini API'],
    link: 'https://github.com/Spandan-Mishra/om-tours',
  },
];

export default projects;
