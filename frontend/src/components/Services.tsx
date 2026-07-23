'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLImageElement>(null);
  const filterNavRef = useRef<HTMLDivElement>(null);
  const serviceRowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero Parallax Effect
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

      // Hero Text Entrance
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

      // 2. Filter Bar Entrance
      if (filterNavRef.current) {
        gsap.fromTo(
          filterNavRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: filterNavRef.current,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 3. Service Section Rows Scroll Reveal
      if (serviceRowsRef.current) {
        const rows = Array.from(serviceRowsRef.current.children);
        rows.forEach((row) => {
          const img = row.querySelector('.service-img');
          const content = row.querySelector('.service-content');

          gsap.fromTo(
            [img, content],
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.18,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      {/* Header Section with Background Image & Rounded Bottom */}
      <section
        ref={heroRef}
        className="relative w-full bg-[#0F2E2A] text-[#FAF7F2] pt-32 pb-24 px-[clamp(1.25rem,5vw,4rem)] rounded-b-[3.5rem] sm:rounded-b-[5rem] overflow-hidden shadow-2xl"
      >
        {/* Background Image with Parallax */}
        <img
          ref={heroBgRef}
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80"
          alt="Dental Clinic Interior"
          className="absolute inset-0 w-full h-[120%] object-cover object-center opacity-55 -top-[10%]"
        />

        {/* Lighter Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F2E2A]/70 via-[#0F2E2A]/60 to-[#0F2E2A]/85" />

        {/* Header Text Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="hero-anim font-serif text-[clamp(2.5rem,5vw,4.2rem)] font-bold tracking-tight mb-6 text-[#FAF7F2] drop-shadow-md">
            Our Services
          </h1>
          <p className="hero-anim text-lg sm:text-xl font-medium leading-relaxed mb-4 text-[#FAF7F2] drop-shadow-sm">
            Our team provides dental treatments to patients in different age groups from young children to seniors.
          </p>
          <p className="hero-anim text-base sm:text-lg font-light leading-relaxed text-[#FAF7F2]/90 max-w-2xl mx-auto drop-shadow-sm">
            If you are anxious about any dental procedure, we offer gas (N2O) or oral sedation to ensure your comfort during any dental treatment.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto py-16 px-[clamp(1.25rem,5vw,4rem)]">
        {/* Sub-Category Navigation Bar */}
        <div ref={filterNavRef} className="mb-20 w-full flex justify-center">
          <div className="flex flex-wrap sm:flex-nowrap max-sm:overflow-x-auto items-center justify-center gap-2 p-2.5 px-4 rounded-3xl sm:rounded-full bg-[#0F2E2A] border border-[rgba(15,46,42,0.1)] shadow-xl max-w-full no-scrollbar">
            {[
              { name: 'Preventative', id: 'preventative' },
              { name: 'Periodontics & Gum Therapy', id: 'periodontics' },
              { name: 'Restorative', id: 'restorative' },
              { name: 'Cosmetic', id: 'cosmetic' },
              { name: 'Dental Implants', id: 'implants' },
              { name: 'Wisdom Teeth Extraction', id: 'wisdom-teeth' },
              { name: 'Emergencies', id: 'emergencies' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => scrollToSection(btn.id)}
                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] hover:bg-[#FF6B4A] transition-colors duration-300 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {btn.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Alternating Grid Layout */}
        <div ref={serviceRowsRef} className="space-y-24">
          {/* 1. Preventative */}
          <div id="preventative" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              onMouseEnter={(e) => handleImageHover(e, true)}
              onMouseLeave={(e) => handleImageHover(e, false)}
              className="service-img overflow-hidden rounded-3xl border border-[rgba(15,46,42,0.12)] shadow-xl h-[360px] cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1663755489920-5e09f66d011a?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Preventative Dental Care"
                className="w-full h-full object-cover transition-transform duration-500"
              />
            </div>
            <div className="service-content">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-[#FF6B4A]">Preventative</h2>
              <p className="text-base font-light leading-relaxed mb-6 text-[#0F2E2A]/90">
                We strongly encourage regular preventative care appointments for patients of all ages to maintain and monitor oral health.
              </p>
              <ul className="space-y-2 text-sm font-light border-t border-[rgba(15,46,42,0.15)] pt-4 text-[#0F2E2A]/90">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" /> Scaling, Cleaning and Polishing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" /> Fluoride Treatments
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" /> Nightguards and Sportguards
                </li>
              </ul>
            </div>
          </div>

          {/* 2. Periodontics & Gum Therapy */}
          <div id="periodontics" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="service-content order-2 lg:order-1">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-[#FF6B4A]">
                Periodontics &amp; Gum Therapy
              </h2>
              <p className="text-base font-light leading-relaxed text-[#0F2E2A]/90">
                We offer a strong periodontal (gum therapy) program. Our dental team is highly qualified to diagnose, treat and monitor periodontal problems and devote time to educating our patients regarding their treatment.
              </p>
            </div>
            <div
              onMouseEnter={(e) => handleImageHover(e, true)}
              onMouseLeave={(e) => handleImageHover(e, false)}
              className="service-img order-1 lg:order-2 overflow-hidden rounded-3xl border border-[rgba(15,46,42,0.12)] shadow-xl h-[360px] cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1684607633251-8a4a8d94ddd2?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Periodontics and Gum Therapy"
                className="w-full h-full object-cover transition-transform duration-500"
              />
            </div>
          </div>

          {/* 3. Restorative */}
          <div id="restorative" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              onMouseEnter={(e) => handleImageHover(e, true)}
              onMouseLeave={(e) => handleImageHover(e, false)}
              className="service-img overflow-hidden rounded-3xl border border-[rgba(15,46,42,0.12)] shadow-xl h-[360px] cursor-pointer"
            >
              <img
                src="https://plus.unsplash.com/premium_photo-1661436629100-ba3c5ea70514?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Restorative Care"
                className="w-full h-full object-cover transition-transform duration-500"
              />
            </div>
            <div className="service-content">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-[#FF6B4A]">Restorative</h2>
              <p className="text-base font-light leading-relaxed mb-6 text-[#0F2E2A]/90">
                We are committed to restoring diseased or damaged teeth to health. Many of our patients are finding implants beneficial to the maintenance of their oral health, whether as a stand alone tooth option or as an anchor for dentures.
              </p>
              <ul className="space-y-2 text-sm font-light border-t border-[rgba(15,46,42,0.15)] pt-4 text-[#0F2E2A]/90">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" /> White and Amalgam Fillings
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" /> Root Canal Treatments
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" /> Crown and Bridges
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" /> Dental Implants
                </li>
              </ul>
            </div>
          </div>

          {/* 4. Cosmetic */}
          <div id="cosmetic" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="service-content order-2 lg:order-1">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-[#FF6B4A]">Cosmetic</h2>
              <p className="text-base font-light leading-relaxed mb-6 text-[#0F2E2A]/90">
                At Harbord Dentistry, we offer an array of cosmetic services to help you improve your smile.
              </p>
              <ul className="space-y-2 text-sm font-light border-t border-[rgba(15,46,42,0.15)] pt-4 text-[#0F2E2A]/90">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" /> Teeth Whitening
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" /> Crown and Bridges
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" /> Veneers
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" /> Invisalign
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" /> Dental Implants
                </li>
              </ul>
            </div>
            <div
              onMouseEnter={(e) => handleImageHover(e, true)}
              onMouseLeave={(e) => handleImageHover(e, false)}
              className="service-img order-1 lg:order-2 overflow-hidden rounded-3xl border border-[rgba(15,46,42,0.12)] shadow-xl h-[360px] cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1667133295315-820bb6481730?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Cosmetic Dentistry"
                className="w-full h-full object-cover transition-transform duration-500"
              />
            </div>
          </div>

          {/* 5. Dental Implants */}
          <div id="implants" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              onMouseEnter={(e) => handleImageHover(e, true)}
              onMouseLeave={(e) => handleImageHover(e, false)}
              className="service-img overflow-hidden rounded-3xl border border-[rgba(15,46,42,0.12)] shadow-xl h-[360px] cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80"
                alt="Dental Implants"
                className="w-full h-full object-cover transition-transform duration-500"
              />
            </div>
            <div className="service-content">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-[#FF6B4A]">Dental Implants</h2>
              <p className="text-base font-light leading-relaxed text-[#0F2E2A]/90">
                Most implant cases are done here in our office with very affordable prices including the crown. To get a quote please contact our office via email, phone or schedule a free consult (Free consult is less than 30 minutes and do not include X-rays).
              </p>
            </div>
          </div>

          {/* 6. Wisdom Teeth Extraction */}
          <div id="wisdom-teeth" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="service-content order-2 lg:order-1">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-[#FF6B4A]">
                Wisdom Teeth Extraction
              </h2>
              <p className="text-base font-light leading-relaxed text-[#0F2E2A]/90">
                We conduct most wisdom teeth extractions right here at our office.
              </p>
            </div>
            <div
              onMouseEnter={(e) => handleImageHover(e, true)}
              onMouseLeave={(e) => handleImageHover(e, false)}
              className="service-img order-1 lg:order-2 overflow-hidden rounded-3xl border border-[rgba(15,46,42,0.12)] shadow-xl h-[360px] cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
                alt="Wisdom Teeth Extraction"
                className="w-full h-full object-cover transition-transform duration-500"
              />
            </div>
          </div>

          {/* 7. Emergencies */}
          <div id="emergencies" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              onMouseEnter={(e) => handleImageHover(e, true)}
              onMouseLeave={(e) => handleImageHover(e, false)}
              className="service-img overflow-hidden rounded-3xl border border-[rgba(15,46,42,0.12)] shadow-xl h-[360px] cursor-pointer"
            >
              <img
                src="https://plus.unsplash.com/premium_photo-1672759455710-70c879daf721?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Emergency Care"
                className="w-full h-full object-cover transition-transform duration-500"
              />
            </div>
            <div className="service-content">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-[#FF6B4A]">Emergencies</h2>
              <p className="text-base font-light leading-relaxed mb-4 text-[#0F2E2A]/90">
                We offer extended hours to accommodate most emergency patients. Our goal is to see the patient as quickly as possible, get the person out of pain and diagnose and recommend treatment in consultation with the patient.
              </p>
              <p className="text-sm font-semibold text-[#FF6B4A] border-t border-[rgba(15,46,42,0.15)] pt-4">
                We are open Mondays to Thursdays from 9-7 and Fridays 9-6.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}