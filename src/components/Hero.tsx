"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef } from "react";

gsap.registerPlugin(SplitText);

const Hero = () => {
    // const heroRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     const hero = heroRef.current;

    //     if (!hero) return;

    //     SplitText.create(hero, {
    //         type: "lines, words",
    //         mask: "lines",
    //         autoSplit: true,
    //         onSplit(self) {
    //             return gsap.from(self.words, {
    //                 duration: 1,
    //                 y: 100,
    //                 autoAlpha: 0,
    //                 stagger: 0.05,
    //             });
    //         },
    //     });
    // }, []);

    return (
        <div className="relative flex w-full items-center justify-center bg-white dark:bg-black h-screen">
            <div
                className={cn(
                "absolute inset-0",
                "[background-size:40px_40px]",
                "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
                )}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
            <p className="relative z-20 bg-gradient-to-b from-primary to-gray-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-9xl">
                I am Spandan Mishra
            </p>
        </div>
    );
};

export default Hero;