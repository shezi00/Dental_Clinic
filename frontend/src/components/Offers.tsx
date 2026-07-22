'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Offers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLImageElement>(null);
  const studentsSectionRef = useRef<HTMLDivElement>(null);
  const seniorsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero Parallax & Initial Entrance
      if (heroBgRef.current) {
        gsap.to(heroBgRef.current, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll('.hero-anim'),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
          }
        );
      }

      // 2. Students & Graduates Section Entrance
      if (studentsSectionRef.current) {
        const image = studentsSectionRef.current.querySelector('.offer-img');
        const content = studentsSectionRef.current.querySelector('.offer-content');

        gsap.fromTo(
          [image, content],
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: studentsSectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 3. Seniors Section Entrance
      if (seniorsSectionRef.current) {
        const image = seniorsSectionRef.current.querySelector('.offer-img');
        const content = seniorsSectionRef.current.querySelector('.offer-content');

        gsap.fromTo(
          [content, image],
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: seniorsSectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>, entering: boolean) => {
    const img = e.currentTarget.querySelector('img');
    if (img) {
      gsap.to(img, {
        scale: entering ? 1.05 : 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#FAF7F2] text-[#0F2E2A] overflow-hidden">
      {/* Header Section with Hero Image & Rounded Bottom */}
      <section
        ref={heroRef}
        className="relative w-full bg-[#0F2E2A] text-[#FAF7F2] pt-32 pb-24 px-[clamp(1.25rem,5vw,4rem)] rounded-b-[3.5rem] sm:rounded-b-[5rem] overflow-hidden shadow-2xl"
      >
        {/* Background Image with Parallax Effect */}
        <img
          ref={heroBgRef}
          src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1920&q=80"
          alt="Harbord Dentistry Offers"
          className="absolute inset-0 w-full h-[120%] object-cover object-center opacity-50 -top-[10%]"
        />

        {/* Dark Teal Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F2E2A]/70 via-[#0F2E2A]/60 to-[#0F2E2A]/85" />

        {/* Header Text Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="hero-anim font-serif text-[clamp(2.5rem,5vw,4.2rem)] font-bold tracking-tight mb-6 text-[#FAF7F2] drop-shadow-md">
            Special Offers
          </h1>
          <p className="hero-anim text-lg sm:text-xl font-medium leading-relaxed mb-4 text-[#FAF7F2] drop-shadow-sm max-w-2xl mx-auto">
            Quality dental care should be accessible. We offer targeted discount programs to support our vibrant student, recent graduate, and senior communities.
          </p>
          <div className="hero-anim mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FAF7F2]/10 backdrop-blur-md border border-[#FAF7F2]/20 text-xs sm:text-sm font-light text-[#FAF7F2]">
            <span className="w-2 h-2 rounded-full bg-[#FF6B4A]" />
            <span>
              Please note that our fees are set according to the <strong>Ontario Dental Association (ODA) Fee Guide</strong>.
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto py-16 px-[clamp(1.25rem,5vw,4rem)]">
        {/* Offers Alternating Grid Layout */}
        <div className="space-y-24">
          {/* 1. Students & New Graduates */}
          <div
            id="students-graduates"
            ref={studentsSectionRef}
            className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div
              onMouseEnter={(e) => handleImageHover(e, true)}
              onMouseLeave={(e) => handleImageHover(e, false)}
              className="offer-img overflow-hidden rounded-3xl border border-[rgba(15,46,42,0.12)] shadow-xl h-[380px] relative cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                alt="Students and Graduates"
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#0F2E2A]/90 text-[#FAF7F2] text-xs font-semibold px-4 py-2 rounded-full border border-[rgba(250,247,242,0.2)] backdrop-blur-md">
                15% OFF
              </div>
            </div>
            <div className="offer-content">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-[#FF6B4A]">
                Students &amp; New Graduates
              </h2>
              <p className="text-base font-light leading-relaxed mb-4 text-[#0F2E2A]/90">
                At Harbord Dentistry, College and University students receive a <strong>15% discount</strong> on all provided dental services. This offer is valid throughout the year.
              </p>
              <p className="text-base font-light leading-relaxed mb-6 text-[#0F2E2A]/90">
                If you are a new college or university graduate within one year of your graduation date and haven't secured a job with dental benefits yet, don't worry—we still extend the <strong>15% student discount</strong> to you!
              </p>
              <div className="p-4 rounded-2xl bg-[#0F2E2A]/5 border border-[rgba(15,46,42,0.1)] text-xs text-[#0F2E2A]/80 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A] shrink-0" />
                <span>Note: This discount applies to all standard procedures and excludes laboratory fees.</span>
              </div>
            </div>
          </div>

          {/* 2. Seniors & CDCP Plan */}
          <div
            id="seniors"
            ref={seniorsSectionRef}
            className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="offer-content order-2 lg:order-1">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-[#FF6B4A]">
                Seniors &amp; CDCP Care
              </h2>
              <p className="text-base font-light leading-relaxed mb-6 text-[#0F2E2A]/90">
                We proudly accept the <strong>Canadian Dental Care Plan (CDCP)</strong> to ensure comprehensive coverage for eligible patients.
              </p>
              <p className="text-base font-light leading-relaxed mb-6 text-[#0F2E2A]/90">
                If you are <strong>65 or older</strong> and do not have CDCP coverage, Harbord Dentistry offers a <strong>15% discount</strong> on all dental services to keep your smile healthy and comfortable. This offer remains valid for the rest of the year.
              </p>
              <div className="p-4 rounded-2xl bg-[#0F2E2A]/5 border border-[rgba(15,46,42,0.1)] text-xs text-[#0F2E2A]/80 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A] shrink-0" />
                <span>Note: This discount applies to all standard procedures and excludes laboratory fees.</span>
              </div>
            </div>
            <div
              onMouseEnter={(e) => handleImageHover(e, true)}
              onMouseLeave={(e) => handleImageHover(e, false)}
              className="offer-img order-1 lg:order-2 overflow-hidden rounded-3xl border border-[rgba(15,46,42,0.12)] shadow-xl h-[380px] relative cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1758691462321-9b6c98c40f7e?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Senior Dental Care"
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-[#FF6B4A] text-[#FAF7F2] text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
                CDCP Accepted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}