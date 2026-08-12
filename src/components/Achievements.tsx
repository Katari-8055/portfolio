"use client";

import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../lib/motion";
import { Award, Trophy, BrainCircuit, ExternalLink } from "lucide-react";

const achievements = [
  {
    icon: <Trophy className="w-6 h-6 text-amber-500" />,
    title: "Problem Solving & Competitive Programming",
    description:
      "Solved 600+ Data Structures & Algorithms problems across LeetCode, GeeksforGeeks, and CodeChef. Achieved a 1700+ LeetCode rating.",
    tag: "1700+ Rating",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    icon: <BrainCircuit className="w-6 h-6 text-indigo-500" />,
    title: "IBM Generative AI: Introduction and Applications",
    description:
      "Completed IBM's Coursera specialization covering Generative AI fundamentals, Large Language Models (LLMs), and prompt engineering.",
    tag: "IBM Certified",
    date: "Jun 2026",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
];

const Achievements = () => {
  return (
    <motion.section
      id="achievements"
      className="flex flex-col w-full items-center my-12 scroll-mt-24"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary/80 bg-primary/10 px-3 py-1 rounded-full mb-3 border border-primary/20">
          <Award className="w-3.5 h-3.5" /> Recognition & Growth
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Achievements & Certifications</h2>
      </motion.div>

      <motion.div
        className="w-full sm:w-5/6 md:w-3/4 lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-0"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
      >
        {achievements.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="p-6 rounded-xl border border-border/60 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-md hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="p-2.5 rounded-lg bg-secondary border border-border/50">{item.icon}</div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${item.badgeColor}`}>
                  {item.tag}
                </span>
              </div>
              <h3 className="font-bold text-base leading-snug text-foreground mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
            {item.date && (
              <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground font-medium flex items-center justify-between">
                <span>Issued {item.date}</span>
                <span className="text-primary font-semibold">Verified</span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Achievements;
