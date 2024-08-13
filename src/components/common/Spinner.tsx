import React from "react";

export const Spinner = () => {
  return (
    <div className="spinner w-12 h-12 border-4 border-t-4 rounded-full">
      <style jsx>{`
        .spinner {
          border-top-color: #333;
          border-left-color: #333;
          border-bottom-color: #333;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
