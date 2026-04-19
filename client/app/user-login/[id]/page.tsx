import EmailLoginForm from "@/components/login/EmailLoginForm";
import LoginHeader from "@/components/login/LoginHeader";
import SocialLogins from "@/components/login/SocialLogins";
import AccessRestriction from "../../../components/login/AccessRestriction";

type PageProps = {
  params: Promise<{ id: string }>;
};

const validateId = async (appClientId: string): Promise<boolean> => {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${base}/v1/app/validate/${appClientId}`, {
      cache: "no-store",
    });
    if (!res.ok) return false;
    const { valid } = (await res.json()) as { valid: boolean };
    return valid;
  } catch {
    return false;
  }
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const isValidId = await validateId(id);

  return (
    <div>
      {isValidId ? (
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
