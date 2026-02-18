"use client";

import { useEffect, useMemo } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();

  const wordsArray = useMemo(() => words.split(" "), [words]);

  useEffect(() => {
    const runAnimation = async () => {
      await animate(
        "span",
        {
          opacity: 0,
          filter: filter ? "blur(10px)" : "none",
        },
        {
          duration: 0,
        },
      );

      await animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration,
          delay: stagger(0.08),
        },
      );
    };

    runAnimation();
  }, [animate, duration, filter, words]);

  return (
    <div className={cn("font-bold", className)}>
      <div className="my-4">
        <motion.div
          ref={scope}
          key={words}
          className="dark:text-white text-black leading-snug tracking-wide"
        >
          {wordsArray.map((word, idx) => (
            <motion.span
              key={`${word}-${idx}`}
              className={`${idx > 3 ? "text-purple" : "dark:text-white text-black"} opacity-0`}
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
