import React from "react";
import GlobeDemo from "../globe-demo";

const OpenSource = () => {
  return (
    <div id="source" className="relative mb-20 md:mx-0 md:pl-6">
      <div className="border-1 top-15 z-99 absolute -left-8 hidden w-[87vw] border-dashed md:block"></div>
      <div className="border-1 z-99 absolute -left-8 bottom-5 hidden w-[87vw] border-dashed md:block"></div>
      <div className="border-1 z-99 absolute -right-1 top-7 hidden h-[60vh] border-dashed md:block"></div>
      <div className="border-1 z-99 absolute left-0 top-7 hidden h-[60vh] border-dashed md:block"></div>
      <h1 className="my-10 text-center text-3xl font-bold text-neutral-700 sm:text-4xl dark:text-neutral-100">
        Open Source
      </h1>
      <GlobeDemo />
    </div>
  );
};

export default OpenSource;
