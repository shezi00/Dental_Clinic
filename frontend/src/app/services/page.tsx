import Navbar from '@/components/Navbar';
import Services from '@/components/Services';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Services | Harbord Dentistry',
  description: 'Explore our dental services including preventative care, restorative, cosmetic, implants, wisdom teeth extractions, and emergency dental care.',
};

export default function ServicesPage() {
  return (
    <main className="relative bg-[#0F2E2A] text-[#FAF7F2] min-h-screen pt-20">
      <Navbar />
      <Services />
      <Footer />
    </main>
  );
}