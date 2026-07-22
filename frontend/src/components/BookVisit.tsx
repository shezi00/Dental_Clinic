'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { submitAppointment } from '@/services/api';

export default function BookVisit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLImageElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const formFieldsRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredDays: [] as string[],
    preferredTime: [] as string[],
    isNewPatient: 'Yes',
    isInPain: 'No',
    reasonForVisit: 'New Patient Exam / Comprehensive Checkup',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: '',
  });

  const dentalServices = [
    'New Patient Exam / Comprehensive Checkup',
    'Teeth Cleaning & Hygiene (Scaling)',
    'Emergency Dental Care',
    'Cosmetic Dentistry (Whitening & Veneers)',
    'Tooth Extractions & Wisdom Teeth',
    'Root Canal Therapy',
    'Dental Crowns & Bridges',
    'Dental Implants',
    'Invisalign & Clear Aligners',
    'Pediatric / Children Dentistry',
    'Seniors & Mobile Dentistry Care',
    'Other Special Consultation',
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero Entrance & Scroll Parallax
      if (heroRef.current && heroBgRef.current && heroTextRef.current) {
        gsap.fromTo(
          heroTextRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.1,
          }
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

      // 2. Form Card Reveal
      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
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

      // 3. Staggered Inner Form Fields Entrance
      if (formFieldsRef.current) {
        const fieldGroups = formFieldsRef.current.children;
        gsap.fromTo(
          fieldGroups,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: formCardRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleDayChange = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter((d) => d !== day)
        : [...prev.preferredDays, day],
    }));
  };

  const handleTimeChange = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredTime: prev.preferredTime.includes(time)
        ? prev.preferredTime.filter((t) => t !== time)
        : [...prev.preferredTime, time],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    // Map UI state to backend contract expectations
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      isNewPatient: formData.isNewPatient === 'Yes',
      isInPain: formData.isInPain === 'Yes',
      reasonForVisit: formData.reasonForVisit,
      additionalNotes: formData.message,
      preferredDays: formData.preferredDays,
      preferredTimes: formData.preferredTime,
    };

    try {
      // Clean API call via central service
      await submitAppointment(payload);

      setStatusMsg({
        type: 'success',
        text: 'Thank you! Your appointment request has been sent. We will confirm your visit shortly.',
      });

      // Reset form on success
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        preferredDays: [],
        preferredTime: [],
        isNewPatient: 'Yes',
        isInPain: 'No',
        reasonForVisit: 'New Patient Exam / Comprehensive Checkup',
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
      
      {/* Hero Banner Header */}
      <section
        ref={heroRef}
        className="relative w-full bg-[#0F2E2A] text-[#FAF7F2] pt-32 pb-20 px-[clamp(1.25rem,5vw,4rem)] rounded-b-[3.5rem] sm:rounded-b-[5rem] overflow-hidden shadow-2xl"
      >
        <img
          ref={heroBgRef}
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80"
          alt="Harbord Dentistry Booking"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F2E2A]/70 via-[#0F2E2A]/60 to-[#0F2E2A]/85 pointer-events-none" />

        <div ref={heroTextRef} className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF6B4A]/20 text-[#FF6B4A] border border-[#FF6B4A]/30 text-xs font-semibold uppercase tracking-widest mb-4">
            Easy Online Scheduling
          </span>
          <h1 className="font-serif text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold tracking-tight mb-4 text-[#FAF7F2] drop-shadow-md">
            Book your dental visit online with Harbord Dentistry
          </h1>
          <p className="text-base sm:text-lg font-light leading-relaxed text-[#FAF7F2]/90 max-w-2xl mx-auto drop-shadow-sm">
            Fill out the form below to request your dental appointment. We’ll confirm your time and send you a reminder.
          </p>
        </div>
      </section>

      {/* Booking Form Box */}
      <div className="max-w-[1100px] mx-auto py-16 px-[clamp(1.25rem,5vw,4rem)]">
        <div
          ref={formCardRef}
          className="bg-white/80 backdrop-blur-md border border-[rgba(15,46,42,0.1)] rounded-[2.5rem] p-8 sm:p-12 shadow-xl"
        >
          {statusMsg.text && (
            <div
              className={`mb-8 p-4 rounded-2xl text-sm font-medium ${
                statusMsg.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          <form ref={formFieldsRef} onSubmit={handleSubmit} className="space-y-8">
            
            {/* Top Row: Full Name, Email, Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[rgba(15,46,42,0.12)] text-[#0F2E2A] placeholder-[#0F2E2A]/35 text-sm focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] transition-all"
                />
              </div>

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
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[rgba(15,46,42,0.12)] text-[#0F2E2A] placeholder-[#0F2E2A]/35 text-sm focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2E2A]/90 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter Your Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[rgba(15,46,42,0.12)] text-[#0F2E2A] placeholder-[#0F2E2A]/35 text-sm focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] transition-all"
                />
              </div>
            </div>

            {/* Checkboxes Row: Preferred Day(s) & Preferred Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              
              {/* Preferred Day(s) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2E2A]/90 mb-3">
                  Preferred Day(s)
                </label>
                <div className="grid grid-cols-2 gap-2 text-sm text-[#0F2E2A]/80 font-medium">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                    <label key={day} className="flex items-center gap-2.5 cursor-pointer hover:text-[#0F2E2A]">
                      <input
                        type="checkbox"
                        checked={formData.preferredDays.includes(day)}
                        onChange={() => handleDayChange(day)}
                        className="w-4 h-4 rounded text-[#FF6B4A] focus:ring-[#FF6B4A] border-[rgba(15,46,42,0.2)] accent-[#FF6B4A]"
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2E2A]/90 mb-3">
                  Preferred Time
                </label>
                <div className="space-y-2 text-sm text-[#0F2E2A]/80 font-medium">
                  {['Morning', 'Noon', 'Afternoon', 'Evening'].map((time) => (
                    <label key={time} className="flex items-center gap-2.5 cursor-pointer hover:text-[#0F2E2A]">
                      <input
                        type="checkbox"
                        checked={formData.preferredTime.includes(time)}
                        onChange={() => handleTimeChange(time)}
                        className="w-4 h-4 rounded text-[#FF6B4A] focus:ring-[#FF6B4A] border-[rgba(15,46,42,0.2)] accent-[#FF6B4A]"
                      />
                      <span>{time}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Radios Row: Are you a new patient? & Are you in pain? */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              
              {/* Are you a new patient? */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2E2A]/90 mb-3">
                  Are you a new patient?
                </label>
                <div className="flex items-center gap-6 text-sm text-[#0F2E2A]/80 font-medium">
                  {['Yes', 'No'].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer hover:text-[#0F2E2A]">
                      <input
                        type="radio"
                        name="newPatient"
                        value={option}
                        checked={formData.isNewPatient === option}
                        onChange={(e) => setFormData({ ...formData, isNewPatient: e.target.value })}
                        className="w-4 h-4 text-[#FF6B4A] focus:ring-[#FF6B4A] accent-[#FF6B4A]"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Are you in pain? */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2E2A]/90 mb-3">
                  Are you in pain?
                </label>
                <div className="flex items-center gap-6 text-sm text-[#0F2E2A]/80 font-medium">
                  {['Yes', 'No'].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer hover:text-[#0F2E2A]">
                      <input
                        type="radio"
                        name="inPain"
                        value={option}
                        checked={formData.isInPain === option}
                        onChange={(e) => setFormData({ ...formData, isInPain: e.target.value })}
                        className="w-4 h-4 text-[#FF6B4A] focus:ring-[#FF6B4A] accent-[#FF6B4A]"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Dropdown: Reason For Visit (Populated with Services) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2E2A]/90 mb-2">
                Reason For Visit
              </label>
              <div className="relative">
                <select
                  value={formData.reasonForVisit}
                  onChange={(e) => setFormData({ ...formData, reasonForVisit: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[rgba(15,46,42,0.12)] text-[#0F2E2A] text-sm focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] transition-all appearance-none cursor-pointer pr-10"
                >
                  {dentalServices.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#0F2E2A]/60">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2E2A]/90 mb-2">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Write Message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[rgba(15,46,42,0.12)] text-[#0F2E2A] placeholder-[#0F2E2A]/35 text-sm focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 rounded-2xl bg-[#FF6B4A] text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider hover:bg-[#15413B] transition-all duration-300 shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Book Appointment'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}