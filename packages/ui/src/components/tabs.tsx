"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className,
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
        underline:
          "w-full justify-start gap-0.5 rounded-none border-b bg-transparent p-0 group-data-horizontal/tabs:h-auto",
        sidebar: "w-full items-stretch gap-0.5 bg-transparent p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-muted-foreground-2 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:py-[calc(--spacing(1.25))] hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-secondary dark:data-active:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        "group-data-[variant=sidebar]/tabs-list:h-auto group-data-[variant=sidebar]/tabs-list:w-full group-data-[variant=sidebar]/tabs-list:flex-none group-data-[variant=sidebar]/tabs-list:items-center group-data-[variant=sidebar]/tabs-list:justify-start group-data-[variant=sidebar]/tabs-list:whitespace-normal group-data-[variant=sidebar]/tabs-list:rounded-md group-data-[variant=sidebar]/tabs-list:bg-transparent group-data-[variant=sidebar]/tabs-list:py-3 group-data-[variant=sidebar]/tabs-list:pr-3 group-data-[variant=sidebar]/tabs-list:pl-6.5 group-data-[variant=sidebar]/tabs-list:text-left group-data-[variant=sidebar]/tabs-list:font-normal group-data-[variant=sidebar]/tabs-list:text-sm group-data-[variant=sidebar]/tabs-list:hover:bg-accent group-data-[variant=sidebar]/tabs-list:hover:text-foreground-hi group-data-[variant=sidebar]/tabs-list:data-active:border-border-4 group-data-[variant=sidebar]/tabs-list:data-active:bg-secondary group-data-[variant=sidebar]/tabs-list:data-active:text-foreground-hi dark:group-data-[variant=sidebar]/tabs-list:data-active:border-border-4 dark:group-data-[variant=sidebar]/tabs-list:data-active:bg-secondary dark:group-data-[variant=sidebar]/tabs-list:data-active:text-foreground-hi group-data-[variant=sidebar]/tabs-list:after:inset-y-3 group-data-[variant=sidebar]/tabs-list:after:right-auto group-data-[variant=sidebar]/tabs-list:after:left-3 group-data-[variant=sidebar]/tabs-list:after:w-0.75 group-data-[variant=sidebar]/tabs-list:after:rounded-xs group-data-[variant=sidebar]/tabs-list:after:bg-primary group-data-[variant=sidebar]/tabs-list:data-active:after:opacity-100",
        "group-data-[variant=underline]/tabs-list:h-9 group-data-[variant=underline]/tabs-list:flex-none group-data-[variant=underline]/tabs-list:rounded-none group-data-[variant=underline]/tabs-list:border-0 group-data-[variant=underline]/tabs-list:bg-transparent group-data-[variant=underline]/tabs-list:px-3.5 group-data-[variant=underline]/tabs-list:font-normal group-data-[variant=underline]/tabs-list:text-muted-foreground-3 group-data-[variant=underline]/tabs-list:text-sm group-data-[variant=underline]/tabs-list:hover:text-foreground-hi group-data-[variant=underline]/tabs-list:data-active:bg-transparent group-data-[variant=underline]/tabs-list:data-active:text-foreground-hi dark:group-data-[variant=underline]/tabs-list:data-active:border-transparent dark:group-data-[variant=underline]/tabs-list:data-active:bg-transparent dark:group-data-[variant=underline]/tabs-list:data-active:text-foreground-hi group-data-[variant=underline]/tabs-list:after:-bottom-px group-data-[variant=underline]/tabs-list:after:bg-primary group-data-[variant=underline]/tabs-list:data-active:after:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-xs/relaxed outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
