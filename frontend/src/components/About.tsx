'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLImageElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero Entrance & Scroll Parallax
      if (heroRef.current && heroBgRef.current && heroTextRef.current) {
        // Initial entrance
        gsap.fromTo(
          heroTextRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
        );

        gsap.fromTo(
          heroBgRef.current,
          { scale: 1.15 },
          { scale: 1, duration: 1.5, ease: 'power2.out' }
        );

        // Scroll Parallax on Hero Image
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

      // 2. Animate Alternating Sections (Dr. B, Our Team, Our Office)
      const sections = ['#dr-baradaran', '#our-team', '#our-office'];

      sections.forEach((id) => {
        const el = document.querySelector(id);
        if (!el) return;

        const isEven = id === '#our-team'; // Swapped orientation check
        const textCol = el.querySelector('.section-text');
        const imgCol = el.querySelector('.section-image');
        const imgElement = el.querySelector('.section-image img');

        // Text slide-in timeline
        if (textCol) {
          gsap.fromTo(
            textCol,
            {
              x: isEven ? 60 : -60,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'top 40%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Image container slide-in
        if (imgCol) {
          gsap.fromTo(
            imgCol,
            {
              x: isEven ? -60 : 60,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'top 40%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Subtle Image Scale-in on scroll
        if (imgElement) {
          gsap.fromTo(
            imgElement,
            { scale: 1.15 },
            {
              scale: 1,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'bottom 20%',
                scrub: 1,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#FAF7F2] text-[#0F2E2A] overflow-x-hidden">
      
      {/* Header Section with Background Image & Rounded Bottom */}
      <section
        ref={heroRef}
        className="relative w-full bg-[#0F2E2A] text-[#FAF7F2] pt-32 pb-24 px-[clamp(1.25rem,5vw,4rem)] rounded-b-[3.5rem] sm:rounded-b-[5rem] overflow-hidden shadow-2xl"
      >
        {/* Background Image */}
        <img
          ref={heroBgRef}
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80"
          alt="Harbord Dentistry Office"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-50 pointer-events-none"
        />
        
        {/* Dark Teal Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F2E2A]/70 via-[#0F2E2A]/60 to-[#0F2E2A]/85 pointer-events-none" />

        {/* Centered Header Content */}
        <div ref={heroTextRef} className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.2rem)] font-bold tracking-tight mb-6 text-[#FAF7F2] drop-shadow-md">
            About Us
          </h1>
          <p className="text-lg sm:text-xl font-medium leading-relaxed text-[#FAF7F2] drop-shadow-sm max-w-2xl mx-auto">
            Get to know the team behind Harbord Dentistry and our commitment to compassionate, community-focused dental care in Toronto.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto py-20 px-[clamp(1.25rem,5vw,4rem)]">

        {/* About Sections Alternating Grid Layout */}
        <div className="space-y-28">
          
          {/* 1. Dr. Baradaran (B) - Text Left, Image Right */}
          <div id="dr-baradaran" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="section-text order-2 lg:order-1">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4 text-[#FF6B4A]">
                Dr. Baradaran (B)
              </h2>
              <div className="space-y-4 text-base font-light leading-relaxed text-[#0F2E2A]/90">
                <p>
                  Doctor Shahrooz Baradaran AKA Dr. B has been practicing general dentistry since 2001. Over these years, he has worked in many different professional areas such as hospitals, dental clinics, private offices, and mobile dentistry. This wide range of experiences has brought him the knowledge and expertise to better serve people in different age groups with different medical and physical conditions.
                </p>
                <p>
                  In 2012, he successfully completed the international dentists' qualifying program at University of Western in London Ontario with distinction and received the "Dr. Glen Walker" award for excellent patient care.
                </p>
                <p>
                  Since then, he has been practicing as a dental associate in Guelph, Ontario. For several years, he has worked at Golden Care Dental Services providing mobile dentistry for seniors and medically compromised patients in retirement and nursing facilities across GTA.
                </p>
                <p>
                  He is also an awesome dad who hopes to bring a healthier smile to more kids and their families in the neighbourhood.
                </p>
              </div>
            </div>
            <div className="section-image order-1 lg:order-2 overflow-hidden rounded-3xl border border-[rgba(15,46,42,0.12)] shadow-xl h-[480px]">
              <img
                src="https://static.wixstatic.com/media/0b33ee_f192d30d77e849ef9976ac0a059d2221~mv2_d_1200_1602_s_2.jpg/v1/crop/x_70,y_0,w_1059,h_1067/fill/w_872,h_878,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0b33ee_f192d30d77e849ef9976ac0a059d2221~mv2_d_1200_1602_s_2.jpg"
                alt="Dr. Shahrooz Baradaran"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* 2. Our Team - Image Left, Text Right */}
          <div id="our-team" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="section-image overflow-hidden rounded-3xl border border-[rgba(15,46,42,0.12)] shadow-xl h-[380px]">
              <img
                src="https://static.wixstatic.com/media/0b33ee_f46443c0d291476b81426b24021d8ef0~mv2.png/v1/crop/x_554,y_0,w_2648,h_2340/fill/w_880,h_778,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Staff%20Photo.png"
                alt="Harbord Dentistry Team"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="section-text">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4 text-[#FF6B4A]">
                Our Team
              </h2>
              <div className="space-y-4 text-base font-light leading-relaxed text-[#0F2E2A]/90">
                <p>
                  Although we are a small team, we care about our patients like family and make sure each one of them leaves our office with a great experience.
                </p>
                <p>
                  Besides dentistry, we are passionate about people, art, design, cooking and life in general.
                </p>
                <div className="p-4 rounded-2xl bg-[#0F2E2A]/5 border border-[rgba(15,46,42,0.1)] text-sm font-medium text-[#0F2E2A] flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B4A] shrink-0" />
                  <span>If you are in the neighbourhood, please stop by and say hi!</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Our Office - Text Left, Image Right */}
          <div id="our-office" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="section-text order-2 lg:order-1">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4 text-[#FF6B4A]">
                Our Office
              </h2>
              <div className="space-y-4 text-base font-light leading-relaxed text-[#0F2E2A]/90">
                <p>
                  Our team's expertise coupled with our state of the art dental equipment leads to better results for our patients.
                </p>
                <div className="p-4 rounded-2xl bg-[#0F2E2A]/5 border border-[rgba(15,46,42,0.1)] text-sm font-medium text-[#0F2E2A] flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B4A] shrink-0" />
                  <span>We have made sure our facility is entirely accessible for patients who use wheelchairs.</span>
                </div>
              </div>
            </div>
            <div className="section-image order-1 lg:order-2 overflow-hidden rounded-3xl border border-[rgba(15,46,42,0.12)] shadow-xl h-[380px]">
              <img
                src="https://static.wixstatic.com/media/0b33ee_1cb41b76dc4740b0819ffca347ef5b7b~mv2_d_9984_2374_s_2.jpg/v1/fill/w_1798,h_494,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0b33ee_1cb41b76dc4740b0819ffca347ef5b7b~mv2_d_9984_2374_s_2.jpg"
                alt="Accessible Modern Dental Office"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}