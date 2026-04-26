import Features from "@/components/landing/Features";
import Landing from "@/components/landing/Hero";
import OpenSource from "@/components/landing/OpenSource";
import CTA from "@/components/landing/CTA";
import Trusted from "@/components/trusted-by/Trusted";
import Footer from "@/components/landing/Footer";

const page = () => {
  return (
    <div className="relative mx-auto min-h-screen w-full [--pattern:var(--color-neutral-300)] md:max-w-[1200px] dark:[--pattern:var(--color-neutral-700)]">
      <Landing />
      <Trusted />
      <Features />
      <OpenSource />
      <CTA />
      <Footer />
    </div>
  );
};

export default page;
