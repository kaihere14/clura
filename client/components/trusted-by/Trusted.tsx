import React from "react";

const companies = [
  {
    name: "Vercel",
    logo: (
      <svg viewBox="0 0 76 65" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
      </svg>
    ),
  },
  {
    name: "Linear",
    logo: (
      <svg viewBox="0 0 100 100" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887 .5599.28957.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3103-.1438 4.5794-.4954 6.7927-.0496L2.491 39.9418c-.44531 2.2148-.80 4.484-.48921 6.9473ZM4.56626 32.5365c-.16979.3124-.14047.6878.07679.9703L66.4932 95.3637c.2825.2173.6579.2466.9703.0768 1.9286-1.0476 3.7933-2.2993 5.5764-3.7966L8.34336 26.96c-1.4973 1.7831-2.74893 3.6478-3.77710 5.5765ZM14.8591 18.0207c-.2007-.2007-.4773-.3075-.7606-.2896-.22.0137-.4382.0336-.6542.0601L81.9395 85.8456c.0265-.2161.0464-.4343.0601-.6542.0179-.2833-.0889-.5599-.2896-.7606L14.8591 18.0207ZM25.5626 10.2L89.8 74.4374c.8283.8283.9833 2.1266.3682 3.1356l-3.1006 4.9657L21.0657 17.6 25.5626 10.2Z" />
      </svg>
    ),
  },
  {
    name: "Resend",
    logo: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M1.5 8.5v-3A2.5 2.5 0 0 1 4 3h16a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 20 19h-7.5v2.5H15a.5.5 0 0 1 0 1H9a.5.5 0 0 1 0-1h2.5V19H4a2.5 2.5 0 0 1-2.5-2.5v-3h1V16.5A1.5 1.5 0 0 0 4 18h16a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 20 4H4A1.5 1.5 0 0 0 2.5 5.5v3h-1Zm3-1a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5v-5Zm1 .5v4h2v-4H5.5Zm5-.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5Zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5Zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Z" />
      </svg>
    ),
  },
  {
    name: "Supabase",
    logo: (
      <svg viewBox="0 0 109 113" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" />
        <path
          d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
          fillOpacity="0.2"
        />
        <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" />
      </svg>
    ),
  },
];

const Trusted = () => {
  return (
    <div className="flex flex-col gap-6 py-10">
      <h1 className="text-center text-sm font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Trusted By
      </h1>
      <div className="flex items-center justify-center gap-12">
        {companies.map(({ name, logo }) => (
          <div
            key={name}
            className="flex items-center gap-2.5 text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400"
          >
            {logo}
            <span className="text-sm font-semibold">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trusted;
