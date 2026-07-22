'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollY;

          setScrolled(currentScrollY > 20);

          if (Math.abs(diff) > 5) {
            if (diff < 0) {
              setVisible(true);
            } else if (diff > 0 && currentScrollY > 60) {
              setVisible(false);
            }
            lastScrollY = currentScrollY;
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between py-4 px-[clamp(1.25rem,4vw,3.5rem)] text-[#FAF7F2] transition-all duration-200 ease-out ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled
          ? 'bg-[#0F2E2A]/95 backdrop-blur-md shadow-xl border-b border-[rgba(250,247,242,0.12)]'
          : 'bg-transparent'
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-serif text-xl font-semibold tracking-tight text-[#FAF7F2]">
        <svg className="w-6 h-6 text-[#FF6B4A] flex-shrink-0" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 4C10 4 6 8 6 13c0 4 1.8 6.6 2.6 10.4.5 2.3.9 5.6 2.6 5.6 2 0 1.7-4.8 2.4-7.4.3-1.1.9-1.6 2.4-1.6s2.1.5 2.4 1.6c.7 2.6.4 7.4 2.4 7.4 1.7 0 2.1-3.3 2.6-5.6C24.2 19.6 26 17 26 13c0-5-4-9-10-9z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        <span>Harbord Dentistry</span>
      </Link>

      {/* Nav Links */}
      <div
        className={`flex items-center gap-[clamp(1.1rem,2.4vw,2.4rem)] text-[0.86rem] font-medium tracking-wide text-[#FAF7F2] transition-all duration-300 max-md:fixed max-md:top-0 max-md:right-0 max-md:h-screen max-md:w-[min(78vw,320px)] max-md:bg-[#0F2E2A] max-md:flex-col max-md:items-start max-md:justify-center max-md:p-10 max-md:gap-6 max-md:z-[150] ${
          menuOpen ? 'max-md:translate-x-0' : 'max-md:translate-x-full'
        }`}
      >
        <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-[#FF6B4A] opacity-90 hover:opacity-100 transition-all">
          Home
        </Link>
        <Link href="/services" onClick={() => setMenuOpen(false)} className="hover:text-[#FF6B4A] opacity-90 hover:opacity-100 transition-all">
          Services
        </Link>
        <Link href="/offers" onClick={() => setMenuOpen(false)} className="hover:text-[#FF6B4A] opacity-90 hover:opacity-100 transition-all">
          Special Offers
        </Link>
        <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-[#FF6B4A] opacity-90 hover:opacity-100 transition-all">
          About Us
        </Link>
        <Link href="/contact" onClick={() => setMenuOpen(false)} className="hover:text-[#FF6B4A] opacity-90 hover:opacity-100 transition-all">
          Contact Us
        </Link>

        {/* Book a Visit Button */}
        <Link
          href="/book"
          onClick={() => setMenuOpen(false)}
          className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wider bg-[#FF6B4A] text-[#FAF7F2] hover:bg-[#15413B] hover:text-[#FAF7F2] border border-[#FF6B4A] transition-all duration-300 hover:-translate-y-0.5 shadow-sm uppercase"
        >
          Book a Visit
        </Link>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="hidden max-md:block w-7 h-5 relative z-[210] bg-transparent border-none text-[#FAF7F2]"
        aria-label="Toggle Menu"
      >
        <span className={`absolute left-0 right-0 h-[2px] bg-current transition-all ${menuOpen ? 'top-2.5 rotate-45' : 'top-0'}`} />
        <span className={`absolute left-0 right-0 h-[2px] bg-current transition-all top-2 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
        <span className={`absolute left-0 right-0 h-[2px] bg-current transition-all ${menuOpen ? 'top-2.5 -rotate-45' : 'top-4'}`} />
      </button>
    </nav>
  );
}