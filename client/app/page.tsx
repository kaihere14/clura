import Features from "@/components/landing/Features";
import Landing from "@/components/landing/Hero";

const page = () => {
  return (
    <div className="relative mx-auto h-screen w-full max-w-[1200px] [--pattern:var(--color-neutral-300)] dark:[--pattern:var(--color-neutral-700)]">
      <Landing />
      <Features />
    </div>
  );
};

export default page;
