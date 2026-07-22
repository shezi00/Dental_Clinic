import ContactNav from '@/components/ContactNav';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export const metadata = {
  title: 'Contact Us | Harbord Dentistry',
  description: 'Get in touch with Harbord Dentistry at 91 Harbord Street, Toronto. Schedule an appointment or ask a question.',
};

export default function ContactPage() {
  return (
     <main className="relative bg-[#0F2E2A] text-[#FAF7F2] min-h-screen pt-20">
       <Navbar />
       <ContactNav />
       <Footer />
     </main>
   );
}