'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!imageRef.current || !containerRef.current) return;

      // Pure GSAP timeline scrubbing tied to scroll
      gsap.fromTo(
        imageRef.current,
        {
          x: -120,          // Offset toward top-left
          y: -80,
          scale: 0.65,      // Start smaller
          opacity: 0,       // Invisible initially
          borderRadius: '2rem',
        },
        {
          x: 0,             // Settle into natural right-side container box
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%', // Triggers right as user scrolls down from Hero
            end: 'top 25%',   // Fully formed by the time section reaches center
            scrub: 1.2,       // Smooth scrubbing connected to scroll velocity
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="panel-wrap relative min-h-screen w-full">
      <section
        className="panel philosophy relative min-h-screen w-full overflow-hidden flex flex-col justify-center bg-[#FAF7F2] text-[#0F2E2A] rounded-t-[3.5rem] sm:rounded-t-[5rem] shadow-[0_-30px_60px_rgba(0,0,0,0.12)] z-[2] py-20"
        id="philosophy"
      >
        {/* Main Content Grid */}
        <div className="panel-inner max-w-[1280px] w-full mx-auto px-[clamp(1.25rem,5vw,4rem)] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="philosophy-content space-y-4">
            <p className="eyebrow text-xs tracking-[0.22em] uppercase font-semibold text-[#FF6B4A] flex items-center gap-2.5 before:w-[22px] before:h-[1px] before:bg-current before:inline-block">
              OUR PHILOSOPHY
            </p>
            <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] leading-[1.12] text-[#0F2E2A] font-semibold">
              Treating our patients the way we want to be treated
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#0F2E2A]/85 font-normal pt-2">
              <p>
                Having been dental patients ourselves, we have experienced the emotional and financial frustrations that our patients go through every time they need dental services.
              </p>
              <p>
                At Harbord Dentistry, we carefully listen to our patient's chief complaint, and provide them with several options to choose what works best for them.
              </p>
              <p className="font-medium text-[#0F2E2A] text-base sm:text-lg pt-1">
                Our ultimate goal is to create an uplifting experience in which our patients walk out healthier, happier and smiling more beautifully than when they walked in.
              </p>
            </div>
          </div>

          {/* Right Destination Box */}
          <div className="relative w-full h-[340px] sm:h-[440px] rounded-3xl overflow-hidden">
            {/* Animated Image Element */}
            <div
              ref={imageRef}
              className="philosophy-animated-image w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-[rgba(15,46,42,0.1)] relative"
            >
              <img
                src="https://plus.unsplash.com/premium_photo-1681995206380-babb9b6debc6?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Modern Harbord Dentistry Interior"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E2A]/20 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}