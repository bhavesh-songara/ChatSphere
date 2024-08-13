export const ThreeDots = (props: { dotClassName?: string }) => {
  const { dotClassName } = props;

  return (
    <div className="dot-container">
      {Array.from({ length: 3 }).map((_, index) => {
        return (
          <div key={index} className={`dot bg-gray-600 ${dotClassName}`}></div>
        );
      })}

      <style jsx>{`
        .dot-container {
          display: flex;
          align-items: center;
        }

        .dot {
          width: 8px;
          height: 8px;
          margin: 0 2px;
          border-radius: 50%;
          animation: dot-up-down 0.8s infinite alternate;
        }

        @keyframes dot-up-down {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-5px);
          }
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};
