import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      error,
      icon,
      rightElement,
      className = "",
      type = "text",
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={id}
            className={`
            block w-full rounded-lg border-neutral-200 bg-white text-neutral-900 shadow-sm
            focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 ${
              icon ? "pl-10" : "px-3"
            } ${rightElement ? "pr-10" : ""}
            placeholder:text-neutral-400
            ${error ? "border-error focus:border-error focus:ring-error" : ""}
            ${className}
          `}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
