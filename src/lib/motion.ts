import { Variants } from "framer-motion"

export const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut",
            when: "beforeChildren",
            staggerChildren: 0.2,
        },
    },
}

export const itemVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: 20,
        filter: "blur(10px)",
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
        filter: "blur(0px)",
    },
}