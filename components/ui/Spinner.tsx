import React from "react";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md" }) => {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-t-blue-500 border-r-blue-500 border-b-blue-500/30 border-l-blue-500/30`}
    ></div>
  );
};

export default Spinner;
