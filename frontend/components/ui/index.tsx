"use client";

import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";

// Button Component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#050a07] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-[#39ff88] dark:text-[#06110b] dark:hover:bg-[#65ff9f] focus:ring-emerald-500",
    secondary: "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-100 dark:hover:bg-emerald-800/60 focus:ring-emerald-500",
    outline:
      "border-2 border-emerald-300 text-emerald-800 hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-500/50 dark:text-emerald-200 dark:hover:border-[#39ff88] dark:hover:bg-emerald-950/40 focus:ring-emerald-500",
    ghost: "text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 dark:text-emerald-200 dark:hover:text-[#39ff88] dark:hover:bg-emerald-950/40 focus:ring-emerald-500",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Card Component
interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ children, className = "", padding = "md" }: CardProps) {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };
  
  return (
    <div
      className={`rounded-xl border border-emerald-100 bg-white dark:border-emerald-500/25 dark:bg-[#07110c] shadow-sm ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

// Input Component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-emerald-800 dark:text-emerald-200">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-lg border border-emerald-200 dark:border-emerald-500/40 bg-white dark:bg-[#0b1a12] px-3 py-2 text-sm text-emerald-950 dark:text-emerald-100 transition-colors focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Textarea Component
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-emerald-800 dark:text-emerald-200">
          {label}
        </label>
      )}
      <textarea
        className={`w-full rounded-lg border border-emerald-200 dark:border-emerald-500/40 bg-white dark:bg-[#0b1a12] px-3 py-2 text-sm text-emerald-950 dark:text-emerald-100 transition-colors focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Badge Component
interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700",
    info: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200",
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// Avatar Component
interface AvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, alt, size = "md", className = "" }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };
  
  const initials = alt
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  
  return (
    <div
      className={`${sizes[size]} rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center overflow-hidden ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="font-medium text-emerald-700 dark:text-emerald-200">{initials}</span>
      )}
    </div>
  );
}

// Star Rating Component
interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRate,
  className = "",
}: StarRatingProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };
  
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = interactive
          ? starValue <= (hoverRating || rating)
          : starValue <= rating;
        const isHalf = !isFilled && starValue - 0.5 <= rating;
        
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${sizes[size]} ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isFilled ? "currentColor" : isHalf ? "url(#half)" : "none"}
              stroke="currentColor"
              strokeWidth={isFilled ? "0" : "2"}
              className={isFilled || isHalf ? "text-amber-400" : "text-emerald-200 dark:text-emerald-700"}
            >
              {isHalf && (
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              )}
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// Section Header Component
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ title, subtitle, centered = false, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-8 ${centered ? "text-center" : ""} ${className}`}>
      <h2 className="text-2xl font-bold text-emerald-950 dark:text-emerald-100">{title}</h2>
      {subtitle && <p className="mt-2 text-emerald-800/85 dark:text-emerald-200/85">{subtitle}</p>}
    </div>
  );
}

// Container Component
interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({ children, className = "", size = "lg" }: ContainerProps) {
  const sizes = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };
  
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}
