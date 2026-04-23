import React from "react";
import GlobeDemo from "../globe-demo";

const OpenSource = () => {
  return (
    <div className="relative mx-10 mb-20 md:mx-0">
      <div className="border-1 top-15 z-99 absolute -left-20 w-[91vw] border-dashed"></div>
      <div className="border-1 z-99 absolute -left-20 bottom-5 w-[91vw] border-dashed"></div>
      <div className="border-1 z-99 absolute -right-1 top-7 h-[60vh] border-dashed"></div>
      <div className="border-1 z-99 absolute -left-10 top-7 h-[60vh] border-dashed"></div>
      <h1 className="my-10 text-center text-4xl font-bold text-neutral-700">OpenSource</h1>
      <GlobeDemo />
    </div>
  );
};

export default OpenSource;
