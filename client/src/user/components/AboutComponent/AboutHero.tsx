import React from "react";

const AboutHero: React.FC = () => {
  return (
    <section className="relative bg-slate-950 text-white py-10 overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-[300px] h-[300px] bg-blue-700/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-violet-700/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
            Về chúng tôi
          </span>
          <h1 className="text-3xl lg:text-4xl font-black leading-tight">
            <span className="text-white">Enggo</span>{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              E-Learning
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
