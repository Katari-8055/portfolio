export default interface Project {
    title: string;
    description: string;
    category: string[];
    technologies: string[];
    link: string;
    highlights?: string[];
    metrics?: string;
    featured?: boolean;
}