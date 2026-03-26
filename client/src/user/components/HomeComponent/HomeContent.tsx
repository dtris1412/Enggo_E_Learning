import { useEffect } from "react";
import { useBlog } from "../../contexts/blogContext";
import { useRoadmap } from "../../contexts/roadmapContext";
import { useFlashcard } from "../../contexts/flashcardContext";
import HomeHero from "./HomeHero";
import HomeRoadmaps from "./HomeRoadmaps";
import HomeBlog from "./HomeBlog";
import HomeFlashcards from "./HomeFlashcards";
import HomeWhyUs from "./HomeWhyUs";
import HomeCTA from "./HomeCTA";

const HomeContent: React.FC = () => {
  const { blogs, fetchBlogsPaginated } = useBlog();
  const { roadmaps, fetchRoadmapsPaginated } = useRoadmap();
  const { flashcardSets, fetchFlashcardSetsPaginated } = useFlashcard();

  useEffect(() => {
    fetchBlogsPaginated("", 1, 4);
    fetchRoadmapsPaginated("", 1, 4);
    fetchFlashcardSetsPaginated("", 1, 6, "public");
  }, []);

  return (
    <div className="bg-white">
      <HomeHero roadmaps={roadmaps} />
      <HomeRoadmaps roadmaps={roadmaps} />
      <HomeBlog blogs={blogs} />
      <HomeFlashcards flashcardSets={flashcardSets} />
      <HomeWhyUs />
      <HomeCTA />
    </div>
  );
};

export default HomeContent;
