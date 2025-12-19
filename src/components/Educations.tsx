"use client";

import dayjs from 'dayjs';
import Education from '../types/education';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../lib/motion';

const education: Education[] = [
    {
        icon: <img src="/NIT_Rourkela.svg" width={60} height={60}></img>,
        institution: "National Institute of Technology, Rourkela",
        from: "2023-05",
        to: "2027-06"
    }
]

const Educations = () => {

    return (
        <motion.div className="flex flex-col w-full items-center my-4" variants={containerVariants} initial="hidden" whileInView="visible">
            <motion.div className="text-3xl font-bold" variants={itemVariants}>
                Education
            </motion.div>
            <motion.div className="w-2/3 my-4" variants={containerVariants} initial="hidden" whileInView="visible">
                {education.map((item, index) => (
                    <motion.div className="flex justify-between p-2 rounded-md" key={index} variants={itemVariants}>
                        <div className="flex gap-4 items-center">
                            {item.icon}
                            <div className="flex flex-col">
                                <p className="font-bold text-md">{item.institution}</p>
                            </div>
                        </div>
                        <div className="text-secondary flex items-center text-sm">
                            { dayjs(item.to).isBefore(dayjs())
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

export default Educations
