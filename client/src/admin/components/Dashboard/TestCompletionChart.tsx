import React from "react";

interface TestCompletionChartProps {
  totalAttempts: number;
  completedTests: number;
  completionRate: number;
}

const TestCompletionChart: React.FC<TestCompletionChartProps> = ({
  totalAttempts,
  completedTests,
  completionRate,
}) => {
  const circumference = 2 * Math.PI * 60; // radius = 60 (reduced from 70)
  const strokeDashoffset =
    circumference - (completionRate / 100) * circumference;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Tỷ lệ hoàn thành
      </h2>
      <div className="flex flex-col items-center justify-center flex-1">
        {/* SVG Circle Chart */}
        <div className="relative w-44 h-44 mb-4">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="88"
              cy="88"
              r="60"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="16"
            />
            {/* Progress circle */}
            <circle
              cx="88"
              cy="88"
              r="60"
              fill="none"
              stroke="#000000"
              strokeWidth="16"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Center percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {completionRate}%
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Hoàn thành</p>
            </div>
          </div>
        </div>

        {/* Stats below chart */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 border border-green-100">
            <span className="text-xs text-gray-700">Đã hoàn thành</span>
            <span className="font-semibold text-green-700 text-sm">
              {completedTests.toLocaleString("vi-VN")}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-xs text-gray-700">Tổng lượt thi</span>
            <span className="font-semibold text-gray-900 text-sm">
              {totalAttempts.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCompletionChart;
