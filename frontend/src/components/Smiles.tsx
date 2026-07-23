'use client';

import React from 'react';

export default function Smiles() {
  return (
    <div className="panel-wrap relative min-h-screen w-full">
      <section
        className="panel smiles relative min-h-screen w-full overflow-hidden flex flex-col justify-center bg-[#FAF7F2] text-[#0F2E2A] rounded-t-[3.5rem] sm:rounded-t-[56px] shadow-[0_-30px_60px_rgba(0,0,0,0.18)] z-[4] py-20 sm:py-24"
        data-theme="light"
        id="smiles"
      >
        <div className="panel-inner max-w-[1280px] w-full mx-auto px-[clamp(1.25rem,5vw,4rem)] flex flex-col items-center text-center">
          
          {/* Header Section */}
          <div className="smiles-header max-w-2xl mb-10 sm:mb-12">
            <h2 className="font-serif text-[clamp(1.85rem,3.8vw,3.2rem)] leading-[1.12] font-semibold text-[#0F2E2A]">
              A Place for Healthy Smiles
            </h2>
            <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-[#1F5C52] opacity-90">
              Modern design, advanced tools, and a warm team culture create an environment where families feel supported and cared for at every visit.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl">
            <div className="smiles-card group relative h-[200px] sm:h-[210px] rounded-2xl overflow-hidden shadow-md border border-[rgba(15,46,42,0.1)]">
              <img
                src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Modern reception & lounge area"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E2A]/70 via-[#0F2E2A]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            </div>

            <div className="smiles-card group relative h-[200px] sm:h-[210px] rounded-2xl overflow-hidden shadow-md border border-[rgba(15,46,42,0.1)]">
              <img
                src="https://plus.unsplash.com/premium_photo-1682097288491-7e926a30cd0b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Gentle & personalized dental exams"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E2A]/70 via-[#0F2E2A]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            </div>

            <div className="smiles-card group relative h-[200px] sm:h-[210px] rounded-2xl overflow-hidden shadow-md border border-[rgba(15,46,42,0.1)]">
              <img
                src="https://images.unsplash.com/photo-1667133295352-ef4c83620e8e?q=80&w=1329&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Advanced digital imaging technology"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E2A]/70 via-[#0F2E2A]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            </div>

            <div className="smiles-card group relative h-[200px] sm:h-[210px] rounded-2xl overflow-hidden shadow-md border border-[rgba(15,46,42,0.1)]">
              <img
                src="https://images.unsplash.com/photo-1663755489920-5e09f66d011a?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Family-friendly welcoming environment"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E2A]/70 via-[#0F2E2A]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}