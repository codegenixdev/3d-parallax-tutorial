import React, { createContext, useContext, useRef, useState } from "react";
import { cn } from "./utils/cn";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};

export const CardContainer = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div className="flex items-center justify-center py-20">
        <div
          className={cn("relative flex items-center justify-center", className)}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
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
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Component ref={ref} className={className} {...rest}>
      {children}
    </Component>
  );
};
