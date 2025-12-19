"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import projects from "../data/projects";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { containerVariants, itemVariants } from "../lib/motion";

const categories = ["Full-Stack", "Web3", "Hackathons", "Experimenting", "Machine Learning"];

const Projects = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const filteredProjects = selectedCategory && selectedCategory !== "All"
        ? projects.filter(project => project.category === selectedCategory)
        : projects;

    return (
        <motion.div
            className="flex flex-col w-full items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
        >
            <motion.div variants={itemVariants}>
                <div className="text-3xl font-bold mb-6">Projects</div>
            </motion.div>
            <motion.div variants={itemVariants}>
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
                        whileInView="visible"
                        exit={{ opacity: 0, y: -10, filter: "blur(5px)", transition: { duration: 0.2 } }}
                        className="w-2/3 my-12 flex flex-col gap-6"
                    >
                        {filteredProjects.length !== 0 ?
                            filteredProjects.map((project, index) => (
                                <motion.div key={index} variants={itemVariants}>
                                    <Card className="w-full hover:shadow-lg border-zinc-300 transition-shadow">
                                        <CardHeader>
                                            <CardTitle>{project.title}</CardTitle>
                                            <CardDescription className="w-5/6">{project.description}</CardDescription>
                                            <CardAction>
                                                <a
                                                    href={project.link}
                                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                                >
                                                    View Project
                                                </a>
                                            </CardAction>
                                        </CardHeader>
                                        <CardContent>
                                            {project.technologies.map((tech, tIndex) => (
                                                <Button variant="outline" size="xs" className="mr-2" key={tIndex}>{tech}</Button>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        :
                        <motion.div variants={itemVariants} className="text-sm text-center text-secondary">
                            No {selectedCategory !== "All" ? selectedCategory : null} projects made yet. Still learning this technology!
                        </motion.div>
                        }
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default Projects;