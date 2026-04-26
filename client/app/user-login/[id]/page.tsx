import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EmailLoginForm from "@/components/login/EmailLoginForm";
import LoginHeader from "@/components/login/LoginHeader";
import SocialLogins from "@/components/login/SocialLogins";
import AccessRestriction from "../../../components/login/AccessRestriction";

type LoginStatus =
  | { status: "invalid" }
  | { status: "login" }
  | { status: "redirect"; url: string };

type PageProps = {
  params: Promise<{ id: string }>;
};

const checkLoginStatus = async (appClientId: string): Promise<LoginStatus> => {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const cookieStore = await cookies();
  const ssoCookie = cookieStore.get("clura_sso_session");

  try {
    const res = await fetch(`${base}/v1/global-auth/check?appClientId=${appClientId}`, {
      headers: ssoCookie ? { Cookie: `clura_sso_session=${ssoCookie.value}` } : {},
      cache: "no-store",
    });
    if (!res.ok) return { status: "invalid" };
    return (await res.json()) as LoginStatus;
  } catch {
    return { status: "invalid" };
  }
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const loginStatus = await checkLoginStatus(id);

  if (loginStatus.status === "redirect") {
    redirect(loginStatus.url);
  }

  return (
    <div>
      {loginStatus.status === "login" ? (
        <div className="max-w-300 mx-auto flex min-h-[calc(100vh-50px)] items-center justify-center">
          <div className="h-120 flex w-fit flex-col items-center justify-center">
            <LoginHeader />
            <SocialLogins appClientId={id} />
            <EmailLoginForm />
          </div>
        </div>
      ) : (
        <AccessRestriction />
      )}
    </div>
  );
};

export default Page;
