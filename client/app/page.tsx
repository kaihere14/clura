import Features from "@/components/landing/Features";
import Landing from "@/components/landing/Hero";
import OpenSource from "@/components/landing/OpenSource";
import CTA from "@/components/landing/CTA";
import Trusted from "@/components/trusted-by/Trusted";

const page = () => {
  return (
    <div className="relative mx-auto h-screen w-full max-w-[1200px] [--pattern:var(--color-neutral-300)] dark:[--pattern:var(--color-neutral-700)]">
      <Landing />
      <Trusted />
      <Features />
      <OpenSource />
      <CTA />
    </div>
  );
};

export default page;
