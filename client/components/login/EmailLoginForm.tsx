"use client";
import { useState } from "react";

const EmailLoginForm = () => {
  const [email, setEmail] = useState("");

  return (
    <>
      <span className="border-1 mt-3 w-full border-dashed dark:border-neutral-800"></span>
      <div className="jutify-center flex w-full flex-col items-center">
        <div className="mt-3 rounded-xl border-2 border-neutral-800 p-[2px]">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-84 md:w-lg focus:ring-3 h-12 rounded-[9px] bg-neutral-100 pl-2 text-neutral-800 placeholder:text-neutral-800 focus:outline-none focus:ring-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:ring-neutral-700"
            placeholder="Enter your email"
            suppressHydrationWarning={true}
          />
        </div>
        <button
          onClick={() => console.log(email)}
          className="w-85 md:w-130 mt-2 h-10 cursor-pointer rounded-lg bg-[#111] text-sm font-medium leading-3 text-black text-neutral-200 transition-colors duration-150 ease-in-out hover:bg-[#111]/90 dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-300"
        >
          Continue with Email
        </button>
      </div>
    </>
  );
};

export default EmailLoginForm;
