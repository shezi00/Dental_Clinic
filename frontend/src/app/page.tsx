'use client';

import React, { useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Philosophy from '@/components/Philosophy';
import Mission from '@/components/Mission';
import Smiles from '@/components/Smiles';
import WhyChooseUs from '@/components/WhyChooseUs';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 1. Hero copy entrance
      gsap.from('.hero-copy > *', {
        y: 28,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2,
      });

      // 2. Stacking cover effect (Dim & scale down previous panels)
      const wraps = gsap.utils.toArray<HTMLElement>('.panel-wrap');
      wraps.forEach((wrap, i) => {
        const prevPanel = i > 0 ? wraps[i - 1].querySelector('.panel-inner') : null;
        if (!prevPanel) return;

        ScrollTrigger.create({
          trigger: wrap,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          onUpdate: (self) => {
            if (reduced) return;
            const p = self.progress;
            gsap.set(prevPanel, {
              scale: 1 - p * 0.08,
              y: -p * 40,
              filter: `brightness(${1 - p * 0.35})`,
              opacity: 1 - p * 0.15,
            });
          },
        });
      });

      // 3. Standard content reveal for panels
      gsap.utils.toArray<HTMLElement>('.panel:not(.why-us)').forEach((panel) => {
        const items = panel.querySelectorAll(
          '.philosophy-content > *, .philosophy-image, .mission-content > *, .mission-image, .smiles-header > *, .smiles-card, .contact-header > *, .contact-card, .contact-map, h2, .eyebrow'
        );
        if (!items.length) return;

        gsap.from(items, {
          y: 35,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // 4. Directional Animations for Why Choose Us
      const whyUsPanel = document.querySelector('.panel.why-us');
      if (whyUsPanel) {
        gsap.from('.why-us-content', {
          x: -60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: whyUsPanel,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });

        gsap.from('.why-us-image', {
          x: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.15,
          scrollTrigger: {
            trigger: whyUsPanel,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // 5. Navbar theme switching based on active panel
      const navbar = document.getElementById('navbar');
      gsap.utils.toArray<HTMLElement>('.panel').forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 10%',
          end: 'bottom 10%',
          onEnter: () => setNavTheme(panel.dataset.theme),
          onEnterBack: () => setNavTheme(panel.dataset.theme),
        });
      });

      function setNavTheme(theme?: string) {
        if (!navbar) return;
        gsap.to(navbar, {
          color: theme === 'light' ? '#0F2E2A' : '#FAF7F2',
          duration: 0.4,
          ease: 'power1.out',
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="bg-[#0F2E2A] text-[#FAF7F2] font-sans selection:bg-[#FF6B4A] selection:text-[#FAF7F2]">
      <Navbar />

      <div className="stack relative">
        <Hero />
        <Philosophy />
        <Mission />
        <Smiles />
        <WhyChooseUs />
        <Contact />

        {/* FOOTER */}
        <div className="relative z-[10] bg-[#0B221F]">
          <Footer />
        </div>
      </div>
    </div>
  );
}