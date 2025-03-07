import React from "react";
import { FaSpinner } from "react-icons/fa";

const ProgressBar = ({ progress }) => {
  return (
    <div className="my-4 flex w-full items-center">
      {/* Icon loading xoay */}
      <FaSpinner className="mr-4 size-6 animate-spin text-blue-500" />

      {/* Thanh loading */}
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-4 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>

        {/* Gradient chuyển động để tăng hiệu ứng */}
        <div
          className="absolute left-0 top-0 h-4 w-full animate-[slide_2s_infinite] bg-gradient-to-r from-blue-300 via-transparent to-blue-300 opacity-30"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
