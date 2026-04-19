import React from "react";
import LoginHeader from "../../components/login/LoginHeader";
import SocialLogins from "../../components/login/SocialLogins";
import EmailLoginForm from "../../components/login/EmailLoginForm";

const page = () => {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-50px)] max-w-[1200px] items-center justify-center">
      <div className="h-120 flex w-fit flex-col items-center justify-center">
        <LoginHeader />
        <SocialLogins />
        <EmailLoginForm />
      </div>
    </div>
  );
};

export default page;
