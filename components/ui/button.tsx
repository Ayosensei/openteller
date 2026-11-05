"use client";

import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";

type ButtonVariant = "primary" | "secondary" | "inverse" | "ghost";

export interface ButtonProps extends AriaButtonProps {
  variant?: ButtonVariant;
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      {...props}
      className={`button button--${variant}${typeof className === "string" ? ` ${className}` : ""}`}
    />
  );
}
