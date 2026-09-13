import { useEffect } from "react";
import Lenis from "lenis";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import BuiltForIndia from "@/components/landing/BuiltForIndia";
import WaitlistSection from "@/components/landing/WaitlistSection";
import Footer from "@/components/landing/Footer";
import AdminPage from "@/pages/AdminPage";

function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <BuiltForIndia />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -72 });
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#080808] text-zinc-200 font-sans antialiased selection:bg-white/20 selection:text-white">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Toaster theme="dark" position="bottom-center" />
      </div>
    </BrowserRouter>
  );
}
