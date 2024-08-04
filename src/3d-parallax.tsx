import React from "react";
import { cn } from "./utils/cn";

export const CardContainer = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="flex items-center justify-center py-20">
      <div
        className={cn("relative flex items-center justify-center", className)}
      >
        {children}
      </div>
    </div>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={className}>{children}</div>;
};

export const CardItem = ({
  component: Component = "div",
  children,
  className,
  ...rest
}: {
  component?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) => {
  return (
    <Component className={cn("w-fit", className)} {...rest}>
      {children}
    </Component>
  );
};
