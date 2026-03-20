"use client";

import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../lib/motion";

const skills = ["TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL", "Competitive Programming"];

const Skills = () => {
    return (
        <motion.div className="flex flex-col w-full items-center my-4" variants={containerVariants} initial="hidden" whileInView="visible">
            <motion.div className="text-3xl font-bold" variants={itemVariants}>
                Skills
            </motion.div>
            <motion.div className="flex flex-wrap justify-center sm:w-2/3 my-4" variants={containerVariants} initial="hidden" whileInView="visible">
                {skills.map((skill, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <Button className="mx-1.5 my-1 p-2" size="xs">
                            {skill}
                        </Button>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}

export default Skills;
