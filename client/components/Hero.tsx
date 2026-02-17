"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import MathNoise from "./ui/MathNoise";
import { HEADER_MARGIN } from "@/lib/utils";

const Hero = () => {
  const piRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (piRef.current) {
      gsap.fromTo(
        piRef.current,
        {
          x: -200,
          y: 300,
          opacity: 0,
          rotation: -45,
          scale: 0.5,
        },
        {
          x: 0,
          y: 0,
          opacity: 0.7,
          rotation: 45,
          scale: 1,
          duration: 2,
          ease: "power3.out",
          delay: 0.5,
        },
      );
    }

    if (sigmaRef.current) {
      gsap.fromTo(
        sigmaRef.current,
        {
          x: 200,
          y: 300,
          opacity: 0,
          rotation: 45,
          scale: 0.5,
        },
        {
          x: 0,
          y: 0,
          opacity: 0.7,
          rotation: -45,
          scale: 1,
          duration: 2,
          ease: "power3.out",
          delay: 0.7,
        },
      );
    }
  }, []);

  return (
    <section
      style={{ height: `calc(100vh - ${HEADER_MARGIN}px)` }}
      className={`w-full  flex flex-col justify-center items-center gap-5 relative overflow-hidden select-none`}
    >
      <h1 className="absolute text-[150px] font-bold text-primary opacity-30 blur-3xl scale-110 flex flex-col items-center pointer-events-none">
        <span>
          <span className="text-[190px]">N</span>UM
        </span>
        <span>ITZ</span>
      </h1>

      <h1 className="text-6xl md:text-[150px] font-bold flex items-end justify-end z-50">
        <div>
          <span className="text-7xl md:text-[190px]">N</span>UM
        </div>

        <div className="flex items-start">
          <div className="flex flex-col justify-center items-center gap-2">
            <Plus
              strokeWidth={6}
              className="w-5 md:w-16 h-5 md:h-16 text-primary"
            />
            <div className="w-2 md:w-6 h-7 md:h-16 bg-foreground" />
          </div>
          TZ
        </div>
      </h1>
      <p className="text-center max-w-2xl">
        A collection of challenging and thought-provoking mathematics problems,
        including Olympiad-level questions, intricate puzzles, and exercises
        that require deep reasoning.
      </p>
      <div className="flex gap-5">
        <Button link="/sign_up">Sign Up</Button>
        <Button link="/contests">Contests</Button>
      </div>

      <MathNoise />

      <div
        ref={piRef}
        className="hidden md:block absolute left-0 -bottom-10 text-[600px] font-bold text-primary/40 2xl:text-primary pointer-events-none select-none opacity-0 -z-20"
        style={{ lineHeight: 1 }}
      >
        π
      </div>

      <div
        ref={sigmaRef}
        className="hidden md:block absolute -right-20 -bottom-5 text-[420px] font-bold text-primary/40 2xl:text-primary pointer-events-none select-none opacity-0 -z-20"
        style={{ lineHeight: 1 }}
      >
        x²{" "}
      </div>
    </section>
  );
};

export default Hero;
