import React from "react";

const AboutHero: React.FC = () => {
  return (
    <section className="relative bg-slate-950 text-white py-24 overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-700/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-700/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block text-amber-400 text-sm font-semibold uppercase tracking-wider mb-4">
            Về chúng tôi
          </span>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
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
