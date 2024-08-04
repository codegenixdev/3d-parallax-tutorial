# 3D Parallax in React

This cool 3d parallax hover effect can be achieved with pure React and Tailwind.
It creates an illusion that different components and layers have depth and it seems that they are detached from the background.
You can see a live demo of it in the description down below.

## start of 3d-hover.tsx

we need to keep track of mouse position

```typescript
const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);
```

```typescript
const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
```

```jsx
export const CardContainer = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isMouseEntered, setIsMouseEntered] = useState(false); // [!code ++]

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}> {/* [!code ++] */}
      <div className="flex items-center justify-center py-20">
        <div
          className={cn("relative flex items-center justify-center", className)}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider> {/* [!code ++] */}
  );
};
```

```jsx
export const CardContainer = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); // [!code ++]

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className="flex items-center justify-center py-20"
      >
        <div
          ref={containerRef} // [!code ++]
          onMouseEnter={handleMouseEnter} // [!code ++]
          onMouseMove={handleMouseMove} // [!code +_]
          onMouseLeave={handleMouseLeave} // [!code ++]
          className={cn("relative flex items-center justify-center", className)}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};
```

```jsx
export const CardContainer = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => { // [!code ++]
    if (!containerRef.current) return;// [!code ++]
    const { left, top, width, height } =// [!code ++]
      containerRef.current.getBoundingClientRect();// [!code ++]
    const x = (e.clientX - left - width / 2) / 25;// [!code ++]
    const y = (e.clientY - top - height / 2) / 25;// [!code ++]
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;// [!code ++]
  };// [!code ++]

  const handleMouseEnter = () => {// [!code ++]
    setIsMouseEntered(true);// [!code ++]
    if (!containerRef.current) return;// [!code ++]
  };// [!code ++]

  const handleMouseLeave = () => {// [!code ++]
    if (!containerRef.current) return;// [!code ++]
    setIsMouseEntered(false);// [!code ++]
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;// [!code ++]
  };// [!code ++]

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className="flex items-center justify-center py-20"
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn("relative flex items-center justify-center", className)}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};
```

```jsx
export const CardContainer = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        style={{ // [!code ++]
          perspective: "1000px",// [!code ++]
        }}// [!code ++]
        className="flex items-center justify-center py-20"
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn("relative flex items-center justify-center", className)} // [!code --]
          style={{// [!code ++]
            transformStyle: "preserve-3d",// [!code ++]
          }}// [!code ++]
          className={cn(// [!code ++]
            "relative flex items-center justify-center transition-all duration-200 ease-linear",// [!code ++]
            className,// [!code ++]
          )}// [!code ++]
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};
```

```jsx
export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div
    className={className} // [!code --]

    className={cn(// [!code ++]
      "[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]",// [!code ++]
      className,// [!code ++]
    )}// [!code ++]
  >{children}</div>;
};
```

```jsx
export const CardItem = ({
  component: Component = "div",
  children,
  className,
  translateZ = 0, // [!code ++]
  ...rest
}: {
  component?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateZ?: number | string; // [!code ++]
  [key: string]: unknown;
}) => {
  const ref = useRef<HTMLDivElement>(null); // [!code ++]

  return (
    <Component
      ref={ref} // [!code ++]
      className={cn("w-fit", className)}// [!code --]
      className={cn("w-fit transition duration-200 ease-linear", className)} // [!code ++]
      {...rest}>
      {children}
    </Component>
  );
};
```

```jsx
export const CardItem = ({
  component: Component = "div",
  children,
  className,
  translateZ = 0,
  ...rest
}: {
  component?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateZ?: number | string;
  [key: string]: unknown;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isMouseEntered] = useMouseEnter(); // [!code ++]

  const handleAnimations = useCallback(() => {// [!code ++]
    if (!ref.current) return;// [!code ++]
    if (isMouseEntered) {// [!code ++]
      ref.current.style.transform = `translateZ(${translateZ}px)`;// [!code ++]
    } else {// [!code ++]
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;// [!code ++]
    }// [!code ++]
  }, [isMouseEntered, translateZ]);// [!code ++]

  useEffect(() => {// [!code ++]
    handleAnimations();// [!code ++]
  }, [handleAnimations]);// [!code ++]

  return (
    <Component
      ref={ref}
      className={cn("w-fit transition duration-200 ease-linear", className)}
      {...rest}>
      {children}
    </Component>
  );
};
```

```jsx
export default function App() {
  return (
    <div className="h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ba78bd] to-[#613177]">
      <CardContainer className="inter-var">
        <CardBody className="group/card flex flex-col gap-5 rounded-xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ba78bd] to-[#613177] p-6 hover:shadow-lg">
          <CardItem
            translateZ="200" // [!code ++]
            className="mt-4 w-full"
          >
            <img
              src={product.src}
              className="h-60 w-full rounded-xl object-contain drop-shadow-lg group-hover/card:drop-shadow-xl"
              alt={product.title}
            />
          </CardItem>

          <CardItem
            translateZ="100" // [!code ++]
            className="text-5xl font-bold text-gray-50"
          >
            {product.title}
          </CardItem>

          <CardItem
            translateZ="150" // [!code ++]
            className="mt-2 max-w-sm text-xl font-semibold text-[#ffdb78]"
            component="p"
          >
            {product.description}
          </CardItem>
          <div className="mt-20 flex w-full items-center justify-between">
            <CardItem
              translateZ="50" // [!code ++]
              component="a"
              href="/"
              className="rounded-xl px-4 text-lg font-normal dark:text-white"
            >
              Share
            </CardItem>
            <CardItem
              translateZ="50" // [!code ++]
              className="self-start text-xl text-[#ffdb78]"
            >
              {product.price}
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
}
```
