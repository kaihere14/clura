import React from "react";

const LoginHeader = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 flex items-center justify-center gap-2 text-2xl font-bold">
        <img src="/clura.png" alt="logo" width={40} height={40} />
        Clura
      </div>
      <h1 className="text-3xl font-bold">Sign in to your account</h1>
    </div>
  );
};

export default LoginHeader;
