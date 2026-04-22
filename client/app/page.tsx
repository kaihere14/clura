import Landing from "@/components/landing/Landing";

const page = () => {
  return (
    <div className="relative h-screen w-full [--pattern:var(--color-neutral-300)] dark:[--pattern:var(--color-neutral-700)]">
      <Landing />
    </div>
  );
};

export default page;
