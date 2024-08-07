## Watch Video on Youtube

<YoutubeEmbed src="https://www.youtube.com/embed/SVQiDX0CbDs" />

This cool 3d parallax hover effect can be achieved with pure React and Tailwind.
It creates an illusion that different components and layers have depth and it seems that they are detached from the background.

## Short Video Demo

We will create a reusable and maintainable component for it to use it in our whole project wherever that we want.

## Setup

### Prerequisites

NODE 18 and above

### Installation

Clone this repository containing starting project (without 3D parallax effect).

```bash
git clone https://github.com/codegenixdev/3d-parallax-tutorial.git
```

Change directory to the project folder

```bash
cd 3d-parallax-tutorial
```

Install node packages

```bash
npm install
```

Run the development server

```bash
npm run dev
```

And now if you head over to the [text](http://localhost:5173) you will see the project is running with a simple card which it has the properties of a modern shoe. The problem here is that if you hover over it, it does not have the 3d effect that we want. So we need to implement it.

But before we continue, hit the like button down below and don't forget to subscribe.

## Overview

The cloned project is a very simple React project created with Vite and with pre-configured Tailwind CSS and a few utility files, some Eslint rules and Prettier config (which sorts the class names of Tailwind classes and you need to have Eslint and Prettier extension/plugin installed on your IDE which is optionals).

These are the important files and folders of base project:

├── src
│ ├── 3d-parallax.tsx
│ ├── App.tsx
│ ├── data.json
├── public
│ ├── shoe-1.png
├── .prettierrc
└── .eslintrc.cjs

## Steps

Open the 3d-parallax.tsx.
We have 3 components here, CardContainer, CardBody and CardItem which are responsible to organize the component and making it reusable and maintainable.
So I decided to divide this component into 3 different component. For now the are here as skeleton and we need to add the 3d hover effect functionality to them.

### Track The User's Mouse Position

We need to keep track of the user's mouse position and use it inside other components. So creating a context for it is reasonable.

```typescript title=3d-parallax.tsx
const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);
```

Also we need to create a hook to consume the provided context.

```typescript title=3d-parallax.tsx
const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
```

### Card Container

Now for the CardContainer, we need wrap it inside the context that we just created.

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

After that we add the containerRef to the child div to control the components using the mouse events handlers.

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
          onMouseMove={handleMouseMove} // [!code ++]
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

Then initialize the mouse events handlers functions.

```jsx
export const CardContainer = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseEnter = () => {// [!code ++]
    setIsMouseEntered(true);// [!code ++]
    if (!containerRef.current) return;// [!code ++]
  };// [!code ++]

  const containerRef = useRef<HTMLDivElement>(null);
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => { // [!code ++]
    if (!containerRef.current) return;// [!code ++]
    const { left, top, width, height } =// [!code ++]
      containerRef.current.getBoundingClientRect();// [!code ++]
    const x = (e.clientX - left - width / 2) / 25;// [!code ++]
    const y = (e.clientY - top - height / 2) / 25;// [!code ++]
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;// [!code ++]
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

Then we add perspective property to the style property of container using inline style because currently does not have perspective utility by default.
We need to add this style to add depth and 3d-like feeling to the different layers of out card.

Then by adding transformStyle to the child div, we can specify the children to be rendered in 3d space not flattened on its container.
Also we add some classNames to add smooth animations while switching between different states of our component

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

For CardBody component we need to make the div itself and all of its direct children using `&>*` to be rendered in 3d world.

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

Now for the most important component of the process, first we need to specify a property called translateZ to specify the amount of depth that we want to add to each CardItems that we need.
Also add the classNames for smooth animations and also a ref property to control the CardItem more programmatically.

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

Now by the help of the context which is the mouse position state, our ref and a handler function, we can control the component with the most amount of control.

Also we need to put it on an useEffect to run it on each re render.

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

Now that's for the entire 3d parallax component.
Now using it is very simple. Just head over to the App component and wherever that you want, you can a the translateZ property and specify it with the amount of depth that you want.

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

Now you can re-use this component wherever that you want in your whole application. Just don't forget to put CardItem and CardBody inside the CardContainer to have access to the context of the parent, other wise you will get an exception.
Thanks for watching. See you in the next video.
