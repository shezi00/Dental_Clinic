'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const topGridRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Staggered reveal for top grid columns
      if (topGridRef.current) {
        const columns = topGridRef.current.children;
        gsap.fromTo(
          columns,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 2. Bottom copyright & social icons reveal
      if (bottomBarRef.current) {
        gsap.fromTo(
          bottomBarRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bottomBarRef.current,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleSocialHover = (e: React.MouseEvent<HTMLAnchorElement>, entering: boolean) => {
    gsap.to(e.currentTarget, {
      scale: entering ? 1.12 : 1,
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  return (
    <footer
      ref={footerRef}
      className="w-full bg-[#0B221F] text-[#FAF7F2] pt-16 pb-12 px-[clamp(1.25rem,5vw,4rem)] border-t border-[rgba(250,247,242,0.12)] overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Top Section: Brand + Links + Contact Grid */}
        <div
          ref={topGridRef}
          className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[rgba(250,247,242,0.1)]"
        >
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <svg className="w-7 h-7 text-[#FF6B4A]" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 4C10 4 6 8 6 13c0 4 1.8 6.6 2.6 10.4.5 2.3.9 5.6 2.6 5.6 2 0 1.7-4.8 2.4-7.4.3-1.1.9-1.6 2.4-1.6s2.1.5 2.4 1.6c.7 2.6.4 7.4 2.4 7.4 1.7 0 2.1-3.3 2.6-5.6C24.2 19.6 26 17 26 13c0-5-4-9-10-9z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-serif font-semibold text-xl tracking-tight">Harbord Dentistry</span>
            </div>
            <p className="text-xs text-[#FAF7F2] opacity-70 leading-relaxed max-w-xs">
              A modern, gentle dental practice dedicated to accessible, high-quality oral health care for the Toronto community.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6B4A]">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium opacity-80">
              <li><Link href="#home" className="hover:opacity-100 hover:text-[#FF6B4A] transition-colors">Home</Link></li>
              <li><Link href="#philosophy" className="hover:opacity-100 hover:text-[#FF6B4A] transition-colors">Philosophy</Link></li>
              <li><Link href="#mission" className="hover:opacity-100 hover:text-[#FF6B4A] transition-colors">Mission</Link></li>
              <li><Link href="#smiles" className="hover:opacity-100 hover:text-[#FF6B4A] transition-colors">Our Space</Link></li>
              <li><Link href="#why-choose-us" className="hover:opacity-100 hover:text-[#FF6B4A] transition-colors">Why Choose Us</Link></li>
              <li><Link href="#contact" className="hover:opacity-100 hover:text-[#FF6B4A] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Col 3 & 4: Contact Information */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6B4A]">Contact Details</h4>
              <p className="text-sm opacity-85 font-medium">(416) 672-1000</p>

              <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6B4A] pt-4">Email Us</h4>
              <p className="text-sm opacity-85 font-medium">info@harborddentistry.ca</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6B4A]">Address</h4>
              <p className="text-sm opacity-85 font-medium leading-relaxed">
                91 Harbord Street,<br />
                Toronto, ON M5S 1G4
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Social Icons */}
        <div
          ref={bottomBarRef}
          className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="text-xs opacity-50">
            © {new Date().getFullYear()} Harbord Dentistry. All rights reserved.
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4 text-[#FAF7F2]">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              onMouseEnter={(e) => handleSocialHover(e, true)}
              onMouseLeave={(e) => handleSocialHover(e, false)}
              className="p-2 rounded-full border border-[rgba(250,247,242,0.15)] hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              onMouseEnter={(e) => handleSocialHover(e, true)}
              onMouseLeave={(e) => handleSocialHover(e, false)}
              className="p-2 rounded-full border border-[rgba(250,247,242,0.15)] hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.592 9 4.808V8z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter / X"
              onMouseEnter={(e) => handleSocialHover(e, true)}
              onMouseLeave={(e) => handleSocialHover(e, false)}
              className="p-2 rounded-full border border-[rgba(250,247,242,0.15)] hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              onMouseEnter={(e) => handleSocialHover(e, true)}
              onMouseLeave={(e) => handleSocialHover(e, false)}
              className="p-2 rounded-full border border-[rgba(250,247,242,0.15)] hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}