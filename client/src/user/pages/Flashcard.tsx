import React from "react";
import FlashcardList from "../components/FlashcardComponent/FlashcardList";
import FlashcardSidebar from "../components/FlashcardComponent/FlashcardSidebar";

const Flashcard: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <FlashcardSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <FlashcardList />
      </div>
    </div>
  );
};

export default Flashcard;
