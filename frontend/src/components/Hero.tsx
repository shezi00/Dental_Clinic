'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Fly-in staggered animation for the photo gallery cards
      gsap.from('.hero-card', {
        x: 100,
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.3,
      });

      // Subtle float effect on hover/idle
      gsap.to('.hero-card', {
        y: '-8px',
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.2,
          from: 'random',
        },
      });
    },
    { scope: heroRef }
  );

  return (
    <div ref={heroRef} className="panel-wrap relative min-h-screen">
      <section
        className="panel hero sticky top-0 min-h-screen w-full overflow-hidden flex flex-col justify-center bg-[#0F2E2A] text-[#FAF7F2] z-[1] py-20 lg:py-0"
        data-theme="dark"
        id="home"
      >
        <div className="panel-inner max-w-[1280px] w-full mx-auto px-[clamp(1.25rem,5vw,4rem)] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Copy & Stats */}
          <div className="hero-copy lg:col-span-6 max-w-xl">
            <p className="eyebrow text-xs tracking-[0.22em] uppercase font-semibold opacity-70 mb-4 flex items-center gap-2.5 before:w-[22px] before:h-[1px] before:bg-current before:inline-block">
              Harbord Dentistry &mdash; Est. 2014
            </p>
            <h1 className="font-serif text-[clamp(2.6rem,5.2vw,4.8rem)] leading-[1.02] font-semibold tracking-tight">
              Your smile,<br />looked after <em className="italic font-normal text-[#FF6B4A]">properly</em>.
            </h1>
            <p className="hero-desc mt-6 max-w-[34ch] text-base sm:text-lg leading-relaxed opacity-80 font-light">
              A calm, modern dental studio for cleanings, cosmetic work, and everything in between &mdash; without the waiting-room dread.
            </p>

            {/* CTA Buttons */}
            <div className="btn-row flex gap-4 mt-8 flex-wrap items-center">
              <Link
                href="/book"
                className="px-8 py-3.5 rounded-full text-sm font-bold tracking-wide bg-[#FF6B4A] text-[#FAF7F2] border border-[#FF6B4A] hover:bg-[#15413B] hover:border-[#15413B] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF6B4A]/20 active:translate-y-0 transition-all duration-300"
              >
                Book a Visit
              </Link>
              <Link
                href="/services"
                className="px-8 py-3.5 rounded-full text-sm font-bold tracking-wide border border-[rgba(250,247,242,0.3)] text-[#FAF7F2] hover:bg-[#FAF7F2] hover:text-[#0F2E2A] hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10 active:translate-y-0 transition-all duration-300"
              >
                Our Services
              </Link>
            </div>

            <div className="stat-row mt-10 flex gap-[clamp(1.5rem,3.5vw,3rem)] flex-wrap border-t border-[rgba(250,247,242,0.22)] pt-6">
              <div>
                <b className="block font-serif text-3xl font-semibold">11 yrs</b>
                <span className="text-xs opacity-65 tracking-wider uppercase">IN PRACTICE</span>
              </div>
              <div>
                <b className="block font-serif text-3xl font-semibold">3</b>
                <span className="text-xs opacity-65 tracking-wider uppercase">TREATMENT CHAIRS</span>
              </div>
              <div>
                <b className="block font-serif text-3xl font-semibold">4.9</b>
                <span className="text-xs opacity-65 tracking-wider uppercase">PATIENT RATING</span>
              </div>
            </div>
          </div>

          {/* Right Side: Animated Rounded Photo Collage */}
          <div className="hero-gallery lg:col-span-6 grid grid-cols-3 gap-3.5 sm:gap-4 items-center max-w-lg mx-auto lg:max-w-none">
            
            {/* Column 1: Family + Seniors */}
            <div className="space-y-3.5 sm:space-y-4">
              {/* Family Photo (Tall pill) */}
              <div className="hero-card relative h-[210px] sm:h-[260px] rounded-[36px] overflow-hidden shadow-xl border border-[rgba(250,247,242,0.15)] bg-[#1F5C52]">
                <img
                  src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Happy family smiling together"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Senior Couple (Heart hands) */}
              <div className="hero-card relative h-[140px] sm:h-[180px] rounded-[32px] overflow-hidden shadow-xl border border-[rgba(250,247,242,0.15)] bg-[#1F5C52]">
                <img
                  src="https://plus.unsplash.com/premium_photo-1705883264560-c47c16288358?q=80&w=981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Senior couple smiling"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Column 2: Close-up Smile + Young Man */}
            <div className="space-y-3.5 sm:space-y-4 pt-4">
              {/* Perfect Smile close-up */}
              <div className="hero-card relative h-[130px] sm:h-[160px] rounded-[32px] overflow-hidden shadow-xl border border-[rgba(250,247,242,0.15)] bg-[#1F5C52]">
                <img
                  src="https://images.unsplash.com/photo-1607378119679-1b10e82b3704?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Healthy teeth close up"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Winking man (Tall pill) */}
              <div className="hero-card relative h-[210px] sm:h-[270px] rounded-[36px] overflow-hidden shadow-xl border border-[rgba(250,247,242,0.15)] bg-[#1F5C52]">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Smiling man"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Column 3: Heart hands smile */}
            <div className="space-y-3.5 sm:space-y-4">
              {/* Woman making heart around her smile */}
              <div className="hero-card relative h-[310px] sm:h-[390px] rounded-[40px] overflow-hidden shadow-xl border border-[rgba(250,247,242,0.15)] bg-[#1F5C52]">
                <img
                  src="https://plus.unsplash.com/premium_photo-1723187823945-bd116325da6a?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Woman framing smile with heart hands"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}