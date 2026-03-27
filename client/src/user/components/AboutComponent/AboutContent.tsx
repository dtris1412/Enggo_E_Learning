import React from "react";
import AboutHero from "./AboutHero";
import AboutProblemSolution from "./AboutProblemSolution";
import AboutFeatures from "./AboutFeatures";
import AboutCertifications from "./AboutCertifications";
import AboutResearch from "./AboutResearch";
import AboutAudience from "./AboutAudience";
import AboutAchievements from "./AboutAchievements";

const AboutContent: React.FC = () => {
  return (
    <div>
      <AboutHero />
      <AboutProblemSolution />
      <AboutFeatures />
      <AboutCertifications />
      <AboutResearch />
      <AboutAudience />
      <AboutAchievements />
    </div>
  );
};

export default AboutContent;
