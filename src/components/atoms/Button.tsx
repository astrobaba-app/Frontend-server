import React, { CSSProperties } from "react";

import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface CustomColorVariant {
  backgroundColor: string;
  textColor: string;
  hoverBackgroundColor?: string;
}

interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "custom";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  customColors?: CustomColorVariant;
  customStyles?: CSSProperties;
}

type ConditionalProps =
  | { href: string; onClick?: never }
  | {
      href?: never;
      onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    };

type CustomButtonProps = BaseButtonProps & ConditionalProps;

const LoadingSpinner: React.FC = () => (
  <AiOutlineLoading3Quarters className="animate-spin h-4 w-4" />
);

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  className = "",
  disabled,
  customColors,
  customStyles,
  href,
  onClick,
  ...props
}: CustomButtonProps) {
  const baseClasses =
    "font-semibold cursor-pointer rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 ";

  const variantClasses = {
    primary: "bg-[#F0DF20] hover:bg-[#e5d41f] text-gray-900",
    secondary: "bg-gray-300 hover:bg-gray-400 text-gray-900",
    outline: "border-2 border-[#F0DF20] text-gray-900 hover:bg-[#F0DF20]/10",
    ghost: "text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    custom: "",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3",
    lg: "px-6 py-3.5 text-lg",
  };

  const disabledClasses =
    disabled || loading ? "opacity-50 cursor-not-allowed" : "";
  const widthClass = fullWidth ? "w-full" : "";
  const finalStyles: CSSProperties = {
    ...customStyles,
    ...(variant === "custom" &&
      customColors && {
        backgroundColor: customColors.backgroundColor,
        color: customColors.textColor,
      }),
  };

  const buttonContent = (
    <>
      {loading ? <LoadingSpinner /> : icon}
      {children}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClasses} ${className}`}
        style={finalStyles}
        onClick={disabled || loading ? (e) => e.preventDefault() : undefined}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClasses} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      style={finalStyles}
      {...props}
    >
      {buttonContent}
    </button>
  );
}
