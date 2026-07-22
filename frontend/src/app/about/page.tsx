import About from '@/components/About';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export const metadata = {
  title: 'About Us | Harbord Dentistry',
  description: 'Learn about Dr. Shahrooz Baradaran (Dr. B), our team, and our fully accessible dental clinic in Toronto.',
};

export default function AboutPage() {
return (
    <main className="relative bg-[#0F2E2A] text-[#FAF7F2] min-h-screen pt-20">
      <Navbar />
      <About />
      <Footer />
    </main>
  );
}