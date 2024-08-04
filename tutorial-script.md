!! keep on going copy from main to without-effect, then remove them from main then paste them here

we need to keep track of mouse position

### start of 3d-hover.tsx

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
