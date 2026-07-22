'use client';

import React from 'react';

export default function Mission() {
  return (
    <div className="panel-wrap relative h-screen">
      <section
        className="panel mission sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center bg-[#0F2E2A] text-[#FAF7F2] rounded-t-[56px] shadow-[0_-30px_60px_rgba(0,0,0,0.18)] z-[3]"
        data-theme="dark"
        id="mission"
      >
        <div className="panel-inner max-w-[1280px] w-full mx-auto px-[clamp(1.25rem,5vw,4rem)] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Image (Left Side) */}
          <div className="mission-image order-2 lg:order-1 relative h-[320px] sm:h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl border border-[rgba(250,247,242,0.15)]">
            <img
              src="https://images.unsplash.com/photo-1666214278797-b2cc1b12be76?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Compassionate Dental Care"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E2A]/40 to-transparent pointer-events-none" />
          </div>

          {/* Content (Right Side) */}
          <div className="mission-content order-1 lg:order-2 space-y-4">
            <p className="eyebrow text-xs tracking-[0.22em] uppercase font-semibold opacity-70 flex items-center gap-2.5 before:w-[22px] before:h-[1px] before:bg-current before:inline-block">
              OUR MISSION
            </p>
            <h2 className="font-serif text-[clamp(1.8rem,3.2vw,2.8rem)] leading-[1.12] text-[#FAF7F2] font-semibold">
              Providing exceptional care for everyone
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed opacity-85 font-light pt-2 text-[#FAF7F2]">
              <p>
                At Harbord Dentistry, we are not just building a dental clinic, we are trying our best to make our services accessible and affordable for as many people as possible. Our ultimate goal is to help our community experience the benefits of better oral health.
              </p>
              <p className="opacity-90 font-normal border-l-2 border-[#FF6B4A] pl-4 py-1">
                We have designed special programs for low income families, kids, students and individuals who don't have dental insurance to help anyone in our community have better access to dental care.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}