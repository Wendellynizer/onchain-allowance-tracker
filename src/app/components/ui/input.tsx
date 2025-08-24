import { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={`
          flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3
          text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed 
          disabled:opacity-50 ${className}
        `}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };