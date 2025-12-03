import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

interface IndeterminateCheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

const IndeterminateCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  IndeterminateCheckboxProps
>(({ className, indeterminate, ...props }, ref) => {
  // Use a ref to access the DOM element
  const checkboxRef = React.useRef<HTMLButtonElement>(null);
  
  // Forward the ref
  React.useImperativeHandle(ref, () => checkboxRef.current!);
  
  // Set the indeterminate property on the DOM element
  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.dataset.state = indeterminate ? 'indeterminate' : props.checked ? 'checked' : 'unchecked';
    }
  }, [indeterminate, props.checked]);

  return (
    <CheckboxPrimitive.Root
      ref={checkboxRef}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        {indeterminate ? (
          <Minus className="h-3 w-3" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
IndeterminateCheckbox.displayName = "IndeterminateCheckbox"

export { IndeterminateCheckbox }