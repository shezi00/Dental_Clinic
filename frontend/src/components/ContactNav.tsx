'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { submitContactInquiry } from '@/services/api';

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLImageElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: '',
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero Entrance & Scroll Parallax
      if (heroRef.current && heroBgRef.current && heroTextRef.current) {
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

        // Hero Parallax on Scroll
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

      // 2. Left Column Info Cards Stagger Entrance
      if (leftColRef.current) {
        const cards = leftColRef.current.children;
        gsap.fromTo(
          cards,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: leftColRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 3. Right Column Form Entrance
      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formCardRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 4. Map Section Entrance
      if (mapSectionRef.current) {
        const mapElements = mapSectionRef.current.children;
        gsap.fromTo(
          mapElements,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: mapSectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      // Clean, single API service call
      await submitContactInquiry(formData);

      setStatusMsg({
        type: 'success',
        text: 'Thank you for reaching out! Our team will contact you shortly.',
      });

      // Reset form fields after successful submission
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#FAF7F2] text-[#0F2E2A] overflow-x-hidden">
      
      {/* Hero Header */}
      <section
        ref={heroRef}
        className="relative w-full bg-[#0F2E2A] text-[#FAF7F2] pt-32 pb-20 px-[clamp(1.25rem,5vw,4rem)] rounded-b-[3.5rem] sm:rounded-b-[5rem] overflow-hidden shadow-2xl"
      >
        <img
          ref={heroBgRef}
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80"
          alt="Harbord Dentistry Front Office"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F2E2A]/70 via-[#0F2E2A]/60 to-[#0F2E2A]/85 pointer-events-none" />

        <div ref={heroTextRef} className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.2rem)] font-bold tracking-tight mb-4 text-[#FAF7F2] drop-shadow-md">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg font-light leading-relaxed text-[#FAF7F2]/90 max-w-2xl mx-auto drop-shadow-sm">
            Have questions or ready to schedule your next appointment? Reach out to our team today and we'll be glad to assist you.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto py-16 px-[clamp(1.25rem,5vw,4rem)] space-y-20">
        
        {/* Main Form & Info Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards & Socials */}
          <div
            ref={leftColRef}
            className="lg:col-span-5 bg-[#0F2E2A]/5 border border-[rgba(15,46,42,0.08)] rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-sm"
          >
            {/* Phone Details */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[rgba(15,46,42,0.08)] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#0F2E2A]/10 text-[#0F2E2A] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-base text-[#0F2E2A]">Contact Details</h3>
                <p className="text-sm text-[#0F2E2A]/70 font-medium mt-0.5">(416) 672-1000</p>
              </div>
            </div>

            {/* Address Details */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[rgba(15,46,42,0.08)] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#0F2E2A]/10 text-[#0F2E2A] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-base text-[#0F2E2A]">Address</h3>
                <p className="text-sm text-[#0F2E2A]/70 font-medium mt-0.5">91 Harbord Street, Toronto, ON</p>
              </div>
            </div>

            {/* Email Details */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[rgba(15,46,42,0.08)] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#0F2E2A]/10 text-[#0F2E2A] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-base text-[#0F2E2A]">Email Us</h3>
                <p className="text-sm text-[#0F2E2A]/70 font-medium mt-0.5">info@harborddentistry.ca</p>
              </div>
            </div>

            {/* Hours Callout Box */}
            <div className="bg-[#0F2E2A] text-[#FAF7F2] p-5 rounded-2xl border border-[rgba(15,46,42,0.12)] shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#FF6B4A] mb-2">Clinic Hours</h3>
              <p className="text-xs font-light text-[#FAF7F2]/90">Mon – Thu: 9:00 AM – 7:00 PM</p>
              <p className="text-xs font-light text-[#FAF7F2]/90 mt-1">Friday: 9:00 AM – 6:00 PM</p>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-4 px-2">
              <span className="text-sm font-semibold text-[#0F2E2A]">Follow Us:</span>
              <div className="flex items-center gap-3 text-[#0F2E2A]/70">
                <a href="#" className="hover:text-[#FF6B4A] transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="hover:text-[#FF6B4A] transition-colors" aria-label="Twitter X">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="hover:text-[#FF6B4A] transition-colors" aria-label="YouTube">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="#" className="hover:text-[#FF6B4A] transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="hover:text-[#FF6B4A] transition-colors" aria-label="LinkedIn">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div
            ref={formCardRef}
            className="lg:col-span-7 bg-[#FAF7F2] border border-[rgba(15,46,42,0.1)] rounded-[2.5rem] p-8 sm:p-10 shadow-xl"
          >
            {/* Form Header */}
            <div className="mb-8">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2E2A] mb-3">
                Contact Our Team
              </h2>
              <p className="text-sm sm:text-base font-light text-[#0F2E2A]/80 leading-relaxed">
                We're committed to providing clear answers and helpful guidance. Share your details below, and a member of our team will reach out to assist you with your dental care needs.
              </p>
            </div>

            {/* Success/Error Alert Message Banner */}
            {statusMsg.text && (
              <div
                className={`mb-6 p-4 rounded-2xl text-sm font-medium ${
                  statusMsg.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2E2A]/90 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Your Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-white border border-[rgba(15,46,42,0.12)] text-[#0F2E2A] placeholder-[#0F2E2A]/35 text-sm focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] transition-all"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2E2A]/90 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white border border-[rgba(15,46,42,0.12)] text-[#0F2E2A] placeholder-[#0F2E2A]/35 text-sm focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2E2A]/90 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter Your Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white border border-[rgba(15,46,42,0.12)] text-[#0F2E2A] placeholder-[#0F2E2A]/35 text-sm focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2E2A]/90 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write Message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-white border border-[rgba(15,46,42,0.12)] text-[#0F2E2A] placeholder-[#0F2E2A]/35 text-sm focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-2xl bg-[#FF6B4A] text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider hover:bg-[#15413B] transition-all duration-300 shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Now'}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Section: Centered Heading Banner & Google Map */}
        <div ref={mapSectionRef} className="pt-8 border-t border-[rgba(15,46,42,0.1)] space-y-10">
          
          {/* Centered Intro Text */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2E2A]">
              Caring Dentistry, Close to Home
            </h2>
            <p className="text-base sm:text-lg font-light leading-relaxed text-[#0F2E2A]/80">
              Our clinic provides high-quality general, cosmetic, and specialty dental care in a welcoming environment. Whatever your needs may be, we’re here to help you achieve a healthy, confident smile.
            </p>
          </div>

          {/* Google Maps Location Frame */}
          <div className="w-full overflow-hidden rounded-[2.5rem] border border-[rgba(15,46,42,0.12)] shadow-xl h-[400px] sm:h-[450px]">
            <iframe
              title="Harbord Dentistry Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.1360068882046!2d-79.40428362382285!3d43.66092797109923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34c208c02c63%3A0x6b1db9ff7c0e66c!2s91%20Harbord%20St%2C%20Toronto%2C%20ON%20M5S%201G4%2C%20Canada!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full filter contrast-[1.02] opacity-95"
            />
          </div>

        </div>

      </div>
    </div>
  );
}