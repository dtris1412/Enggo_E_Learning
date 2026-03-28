import { Link } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";
import { FLASHCARD_COLORS } from "./homeConstants";

interface Props {
  flashcardSets: any[];
}

const HomeFlashcards: React.FC<Props> = ({ flashcardSets }) => {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-violet-600 text-sm font-semibold uppercase tracking-wider">
              Thẻ học từ vựng
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">
              Flashcard thông minh
              <br />
              <span className="text-violet-600">ghi nhớ siêu nhanh</span>
            </h2>
          </div>
          <Link
            to="/flashcards"
            className="inline-flex items-center gap-2 text-violet-600 font-semibold hover:gap-3 transition-all text-sm"
          >
            Thư viện flashcard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {flashcardSets.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <div
                key={k}
                className="aspect-[4/3] bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {flashcardSets.slice(0, 6).map((set, i) => (
              <Link
                to={`/flashcards/${set.flashcard_set_id}`}
                key={set.flashcard_set_id}
                className={`group relative rounded-md overflow-hidden aspect-[4/3] flex flex-col justify-end hover:shadow-lg hover:-translate-y-0.5 transition-all bg-gradient-to-br ${FLASHCARD_COLORS[i % FLASHCARD_COLORS.length]}`}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <div className="relative p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Layers className="w-3 h-3 text-white/80" />
                    <span className="text-white/80 text-xs">
                      {set.total_cards} thẻ
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-xs leading-tight line-clamp-2">
                    {set.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create prompt */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-violet-50 border border-violet-100 rounded-lg px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white border border-violet-200 rounded-md flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">
                Tạo bộ thẻ của riêng bạn
              </div>
              <div className="text-xs text-slate-500">
                Học từ vựng theo chủ đề, ôn tập bất cứ lúc nào
              </div>
            </div>
          </div>
          <Link
            to="/flashcards/create"
            className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors whitespace-nowrap shrink-0"
          >
            Tạo ngay
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeFlashcards;
