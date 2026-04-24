"use client";

import { IconBrandGithub } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SocialLoginsProps {
  appClientId?: string;
}

const SocialLogins = ({ appClientId }: SocialLoginsProps) => {
  const pathname = usePathname();
  const isUserLoginRoute = pathname?.startsWith("/user-login");

  const googleHref = isUserLoginRoute
    ? `${API_URL}/v1/global-auth/google?appClientId=${appClientId ?? ""}`
    : `${API_URL}/v1/auth/google`;

  const githubHref = isUserLoginRoute
    ? `${API_URL}/v1/global-auth/google?appClientId=${appClientId ?? ""}`
    : `${API_URL}/v1/auth/github`;

  return (
    <div className="mt-5 flex flex-col gap-4 sm:flex-row">
      <div
        onClick={() => {
          window.location.href = googleHref;
        }}
        className="text-md px-22 dark:text-shadow-2xs dark:text-shadow-neutral-700 flex cursor-pointer items-center gap-2 rounded-md border-2 border-neutral-200 bg-white py-3 shadow-[0_0_2px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(0,0,0,0.05)] transition-all hover:bg-neutral-50 md:px-11 dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-[0_0_2px_gray,inset_0_2px_4px_rgba(0,0,0,0.8)] dark:hover:bg-neutral-700"
      >
        <img src="/google.png" alt="" className="size-5" />
        Login With Google
      </div>
      <div
        onClick={() => {
          window.location.href = githubHref;
        }}
        className="text-md px-22 dark:text-shadow-2xs dark:text-shadow-neutral-700 flex cursor-pointer items-center gap-2 rounded-md border-2 border-neutral-200 bg-white py-3 shadow-[0_0_2px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(0,0,0,0.05)] transition-all hover:bg-neutral-50 md:px-11 dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-[0_0_2px_gray,inset_0_2px_4px_rgba(0,0,0,0.8)] dark:hover:bg-neutral-700"
      >
        <IconBrandGithub />
        Login With Github
      </div>
    </div>
  );
};

export default SocialLogins;
