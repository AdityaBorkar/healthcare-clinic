import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-[0.8125rem]/[1.4] font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-cyan-signal/30 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default:
          "h-9 gap-1.5 px-5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-10 [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-10 gap-1.5 px-6 text-sm has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 gap-1 px-4 text-xs has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-7 gap-1 rounded-full px-3 text-[0.6875rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3",
      },
      variant: {
        default:
          "border-cyan-edge bg-primary text-primary-foreground shadow-[var(--shadow-subtle)] hover:bg-cyan-edge",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20",
        ghost:
          "text-ink-black hover:bg-muted hover:text-ink-black aria-expanded:bg-muted aria-expanded:text-ink-black",
        link: "text-cyan-signal underline-offset-4 hover:text-cyan-edge hover:underline",
        outline:
          "border-stone-border bg-pure-white text-ink-black shadow-[var(--shadow-subtle)] hover:bg-muted hover:text-ink-black aria-expanded:bg-muted",
        secondary:
          "bg-muted text-ink-black hover:bg-stone-muted/60 aria-expanded:bg-stone-muted/60",
      },
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ className, size, variant }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
