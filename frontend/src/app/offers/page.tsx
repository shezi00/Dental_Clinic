import Offers from '@/components/Offers';
import Navbar from '@/components/Navbar';

import Footer from '@/components/Footer';
export const metadata = {
  title: 'Special Offers | Harbord Dentistry',
  description: 'Special discounts for students, new graduates, and seniors at Harbord Dentistry in Toronto.',
};

export default function OffersPage() {
  return (
      <main className="relative bg-[#0F2E2A] text-[#FAF7F2] min-h-screen pt-20">
        <Navbar />
        <Offers/>
        <Footer />
      </main>
    );
}