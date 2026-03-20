"use client"

import dayjs from "dayjs"
import Experience from "../types/experience"
import { motion } from "framer-motion"
import { containerVariants, itemVariants } from "../lib/motion"

const experiences: Experience[] = [
    {
        icon: <img src="/GSoC-icon.svg" width={60} height={60}></img>,
        position: "Open Source Contributor",
        company: "Google Summer of Code",
        from: "2025-05",
        to: "2025-09",
    }
]

const Experiences = () => {
    return (
        <motion.div className="flex flex-col w-full items-center my-4" variants={containerVariants} initial="hidden" whileInView="visible">
            <motion.div className="text-3xl font-bold" variants={itemVariants}>
                Work Experience
            </motion.div>
            <motion.div className="sm:w-2/3 my-4" variants={containerVariants} initial="hidden" whileInView="visible">
                {experiences.map((item, index) => (
                    <motion.div className="flex justify-between p-2 rounded-md" key={index} variants={itemVariants}>
                        <div className="flex gap-4 items-center">
                            {item.icon}
                            <div className="flex flex-col">
                                <p className="font-bold text-md">{item.company}</p>
                                <p className="text-secondary text-sm">{item.position}</p>
                            </div>
                        </div>
                        <div className="text-secondary flex items-center text-sm">
                            {dayjs(item.to).isBefore(dayjs())
                                ? `${dayjs(item.from).format('MMMM YYYY')} - ${dayjs(item.to).format('MMMM YYYY')}`
                                : 'Present'
                            }
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}

export default Experiences