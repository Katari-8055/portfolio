"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import projects from "../data/projects";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { containerVariants, itemVariants } from "../lib/motion";
import { ExternalLinkIcon } from "lucide-react";

const categories = ["Full-Stack", "Backend", "SaaS"];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredProjects =
    selectedCategory && selectedCategory !== "All"
      ? projects.filter((project) => project.category.includes(selectedCategory))
      : projects;

  return (
    <motion.div
      id="projects"
      className="flex flex-col w-full items-center my-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
    >
      <motion.div variants={itemVariants} className="text-center mb-6">
        <h2 className="text-3xl font-bold">Projects</h2>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <ToggleGroup
          type="single"
          value={selectedCategory}
          onValueChange={(val) => {
            if (!val) return;
            setSelectedCategory(val);
          }}
          variant="outline"
          aria-label="Project categories"
        >
          <ToggleGroupItem value="All" aria-label="Projects">
            All
          </ToggleGroupItem>
          {categories.map((category) => (
            <ToggleGroupItem key={category} value={category} aria-label={category}>
              {category}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </motion.div>

      <div className="w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, filter: "blur(5px)", transition: { duration: 0.2 } }}
            className="sm:w-2/3 my-4 flex flex-col gap-6 w-full px-4 sm:px-0"
          >
            {filteredProjects.length !== 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div key={project.title} variants={itemVariants}>
                  <Card className="w-full hover:shadow-lg border-zinc-300 dark:border-zinc-800 transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
                          <CardDescription className="sm:w-5/6 text-sm text-secondary mt-1 leading-relaxed">
                            {project.description}
                          </CardDescription>
                        </div>
                        <CardAction>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-md hover:bg-secondary/20 transition-colors inline-block"
                            aria-label={`View ${project.title} project`}
                          >
                            <ExternalLinkIcon size={18} />
                          </a>
                        </CardAction>
                      </div>
                    </CardHeader>

                    {project.highlights && project.highlights.length > 0 && (
                      <CardContent className="py-1">
                        <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground list-disc list-inside">
                          {project.highlights.map((highlight, hIdx) => (
                            <li key={hIdx} className="leading-normal">
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    )}

                    <CardContent className="pt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, tIndex) => (
                          <span
                            key={tIndex}
                            className="text-xs font-mono px-2 py-0.5 rounded border border-border bg-secondary/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div variants={itemVariants} className="text-sm text-center text-secondary py-8">
                No {selectedCategory !== "All" ? selectedCategory : null} projects found.
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Projects;