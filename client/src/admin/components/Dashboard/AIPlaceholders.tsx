import React from "react";
import { Brain, Bot, Sparkles } from "lucide-react";

const AIPlaceholders: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-3">
        Dữ liệu AI (sẽ bổ sung)
      </h2>
      <div className="grid grid-cols-1 gap-3">
        <div className="rounded-lg border border-dashed border-gray-300 p-3 bg-gray-50">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-4 w-4 text-indigo-600" />
            <p className="text-sm font-medium text-gray-900">AI Usage</p>
          </div>
          <p className="text-xs text-gray-500">
            Khung dữ liệu tần suất sử dụng AI.
          </p>
        </div>
        <div className="rounded-lg border border-dashed border-gray-300 p-3 bg-gray-50">
          <div className="flex items-center gap-2 mb-1">
            <Bot className="h-4 w-4 text-emerald-600" />
            <p className="text-sm font-medium text-gray-900">AI Accuracy</p>
          </div>
          <p className="text-xs text-gray-500">
            Khung dữ liệu chất lượng phản hồi AI.
          </p>
        </div>
        <div className="rounded-lg border border-dashed border-gray-300 p-3 bg-gray-50">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <p className="text-sm font-medium text-gray-900">AI Suggestions</p>
          </div>
          <p className="text-xs text-gray-500">
            Khung dữ liệu gợi ý học tập từ AI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIPlaceholders;
