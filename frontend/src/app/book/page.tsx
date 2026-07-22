import BookVisit from '@/components/BookVisit';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export const metadata = {
  title: 'Book Appointment | Harbord Dentistry',
  description: 'Schedule your dental visit online with Harbord Dentistry in Toronto. Fast and convenient online appointment request.',
};

export default function BookPage() {
  return (
     <main className="relative bg-[#0F2E2A] text-[#FAF7F2] min-h-screen pt-20">
       <Navbar />
       <BookVisit />
       <Footer />
     </main>
   );
}