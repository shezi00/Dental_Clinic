'use client';

import React from 'react';

export default function Contact() {
  return (
    <div className="panel-wrap relative min-h-screen py-20 flex items-center">
      <section
        className="panel contact sticky top-0 min-h-screen w-full overflow-hidden flex flex-col justify-center bg-[#FAF7F2] text-[#0F2E2A] rounded-t-[56px] shadow-[0_-30px_60px_rgba(0,0,0,0.18)] z-[6]"
        data-theme="light"
        id="contact"
      >
        <div className="panel-inner max-w-[1280px] w-full mx-auto px-[clamp(1.25rem,5vw,4rem)] flex flex-col items-center text-center py-10">
          {/* Header Text */}
          <div className="contact-header max-w-2xl mb-8 sm:mb-10">
            <p className="eyebrow text-xs tracking-[0.22em] uppercase font-semibold opacity-70 mb-3 justify-center flex items-center gap-2.5">
              CONTACT US
            </p>
            <h2 className="font-sans text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight uppercase text-[#0F2E2A] mb-3">
              GET IN TOUCH WITH US
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#1F5C52] opacity-85 font-normal">
              Looking for a trusted dentist in Toronto? Our clinic offers compassionate care and modern treatments for patients of all ages. Contact us today to get started.
            </p>
          </div>

          {/* 3 Contact Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl mb-8">
            {/* Card 1: Phone */}
            <div className="contact-card bg-white border border-[rgba(15,46,42,0.12)] rounded-3xl p-5 sm:p-6 flex items-center gap-4 text-left shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#608b84] text-white flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 010.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-[#0F2E2A]">Contact Details</h3>
                <p className="text-xs sm:text-sm text-[#1F5C52] opacity-90 mt-0.5 font-medium">416 546 5416</p>
              </div>
            </div>

            {/* Card 2: Address */}
            <div className="contact-card bg-white border border-[rgba(15,46,42,0.12)] rounded-3xl p-5 sm:p-6 flex items-center gap-4 text-left shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#608b84] text-white flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-[#0F2E2A]">Address</h3>
                <p className="text-xs sm:text-sm text-[#1F5C52] opacity-90 mt-0.5 font-medium">91 Harbord Street, Toronto, ON M5S 1G4</p>
              </div>
            </div>

            {/* Card 3: Email */}
            <div className="contact-card bg-white border border-[rgba(15,46,42,0.12)] rounded-3xl p-5 sm:p-6 flex items-center gap-4 text-left shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#608b84] text-white flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-[#0F2E2A]">Email Us</h3>
                <p className="text-xs sm:text-sm text-[#1F5C52] opacity-90 mt-0.5 font-medium">info@harborddentistry.com</p>
              </div>
            </div>
          </div>

          {/* Google Map - 91 Harbord St */}
          <div className="contact-map w-full max-w-5xl h-[220px] sm:h-[280px] rounded-3xl overflow-hidden border border-[rgba(15,46,42,0.12)] shadow-md">
            <iframe
              title="Harbord Dentistry Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.136894374304!2d-79.40546192382112!3d43.66092085161309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34c718a35555%3A0x6b8769151525a1e2!2s91%20Harbord%20St%2C%20Toronto%2C%20ON%20M5S%201G4%2C%20Canada!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}