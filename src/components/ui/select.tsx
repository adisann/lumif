"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectProps = Omit<
  SelectPrimitive.Root.Props<string, false>,
  "onValueChange"
> & {
  onValueChange?: (value: string) => void;
};

function Select({ onValueChange, ...props }: SelectProps) {
  return (
    <SelectPrimitive.Root<string, false>
      data-slot="select"
      onValueChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onValueChange?.(nextValue);
        }
      }}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "group inline-flex h-9 items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-2xs transition-colors hover:border-primary/45 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="truncate text-left">{children}</span>
      <SelectPrimitive.Icon className="shrink-0 text-muted-foreground transition-transform duration-150 group-data-[popup-open]:rotate-180">
        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectValue({ ...props }: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectContent({
  className,
  children,
  align = "start",
  sideOffset = 6,
  ...props
}: SelectPrimitive.Popup.Props & {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        align={align}
        side="bottom"
        sideOffset={sideOffset}
        alignItemWithTrigger={false}
        className="isolate z-[140]"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "z-[140] min-w-[max(var(--anchor-width),140px)] max-w-[320px] origin-(--transform-origin) overflow-hidden rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl ring-1 ring-black/5 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          <SelectPrimitive.List className="max-h-60 overflow-y-auto space-y-0.5">
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex min-h-[36px] cursor-pointer select-none items-center justify-between gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium text-foreground outline-hidden transition-colors data-[highlighted]:bg-surface-soft data-[highlighted]:text-foreground data-[selected]:bg-primary-light data-[selected]:font-bold data-[selected]:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="truncate">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="inline-flex shrink-0 items-center text-primary">
        <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
