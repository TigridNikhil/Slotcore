import React from "react";

export default function Card({
  children,
  className = "",
  noPadding = false,
  ...props
}) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-neutral-200 shadow-sm
        ${!noPadding ? "p-6" : ""} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
