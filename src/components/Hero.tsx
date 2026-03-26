"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(SplitText);

const Hero = () => {
    const [displayText, setDisplayText] = useState("");
    const fullText = "RAHUL BIND";
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const handleType = () => {
            const currentText = fullText;
            setDisplayText(
                isDeleting
                    ? currentText.substring(0, displayText.length - 1)
                    : currentText.substring(0, displayText.length + 1)
            );

            setTypingSpeed(isDeleting ? 100 : 150);

            if (!isDeleting && displayText === currentText) {
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && displayText === "") {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, typingSpeed]);

    return (
        <div className="relative flex w-full items-center justify-center bg-white dark:bg-black h-screen overflow-hidden">
            {/* Hexagon Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30" 
                 style={{ 
                     backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='104' height='90' viewBox='0 0 104 90'%3E%3Cpath d='M26 0 L78 0 L104 45 L78 90 L26 90 L0 45 Z' fill='none' stroke='%23888' stroke-width='1.5'/%3E%3C/svg%3E")`,
                     backgroundSize: '104px 90px'
                 }} 
            />
            
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black/50"></div>
            
            <div className="relative flex flex-col items-center justify-center gap-5 z-20 bg-gradient-to-b from-primary to-gray-500 bg-clip-text py-8 font-bold text-transparent text-center px-4">
                <p className="text-2xl sm:text-7xl">Hello, I'm</p> 
                <p className="text-4xl sm:text-9xl min-h-[1.2em]">
                    {displayText}
                    <span className="border-r-4 border-primary animate-pulse ml-1">&nbsp;</span>
                </p>
            </div>
        </div>
    );
};

export default Hero;