'use client';

import React from 'react';

export default function WhyChooseUs() {
  return (
    <div className="panel-wrap relative h-screen">
      <section
        className="panel why-us sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center bg-[#0F2E2A] text-[#FAF7F2] rounded-t-[56px] shadow-[0_-30px_60px_rgba(0,0,0,0.18)] z-[5]"
        data-theme="dark"
        id="why-choose-us"
      >
        <div className="panel-inner max-w-[1280px] w-full mx-auto px-[clamp(1.25rem,5vw,4rem)] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="why-us-content space-y-6">
            <p className="eyebrow text-xs tracking-[0.22em] uppercase font-semibold opacity-70 flex items-center gap-2.5 before:w-[22px] before:h-[1px] before:bg-current before:inline-block">
              WHY CHOOSE US
            </p>
            <h2 className="font-serif text-[clamp(2rem,3.8vw,3.2rem)] leading-[1.06] text-[#FAF7F2] font-semibold">
              A modern standard for gentle, patient-centered care.
            </h2>
            <p className="text-base leading-relaxed opacity-85 font-light text-[#FAF7F2]">
              We believe dental visits should fit seamlessly into your life—free of stress, unexpected costs, or rushed consultations.
            </p>

            <div className="space-y-4 border-t border-[rgba(250,247,242,0.15)] pt-4">
              <div className="flex items-start gap-3.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B4A] mt-2 shrink-0" />
                <div>
                  <h4 className="font-serif font-medium text-lg text-[#FAF7F2]">Transparent Guidance</h4>
                  <p className="text-xs sm:text-sm opacity-70 mt-0.5">Clear treatment plans and honest pricing before any procedure begins.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B4A] mt-2 shrink-0" />
                <div>
                  <h4 className="font-serif font-medium text-lg text-[#FAF7F2]">Minimally Invasive Tech</h4>
                  <p className="text-xs sm:text-sm opacity-70 mt-0.5">Advanced digital imaging for precise diagnosis with maximum comfort.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B4A] mt-2 shrink-0" />
                <div>
                  <h4 className="font-serif font-medium text-lg text-[#FAF7F2]">Comfort-First Environment</h4>
                  <p className="text-xs sm:text-sm opacity-70 mt-0.5">Designed to feel warm and calming from the moment you step through our doors.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="why-us-image relative h-[340px] sm:h-[440px] w-full rounded-3xl overflow-hidden shadow-2xl border border-[rgba(250,247,242,0.15)]">
            <img
              src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200&auto=format&fit=crop"
              alt="Dentist discussing treatment options with patient"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E2A]/40 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>
    </div>
  );
}