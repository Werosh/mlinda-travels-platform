"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex flex-col sm:flex-row gap-6 relative",
          defaultClassNames.months
        ),
        month: cn("space-y-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between px-2 z-10",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 rounded-full hover:bg-muted opacity-50 hover:opacity-100",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 rounded-full hover:bg-muted opacity-50 hover:opacity-100",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex justify-center pt-1 relative items-center h-8",
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          "text-[0.95rem] font-semibold",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground w-10 text-[0.8rem] font-medium pb-3 text-center",
          defaultClassNames.weekday
        ),
        week: cn("mt-2", defaultClassNames.week),
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 h-10 w-10",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-primary/10 rounded-l-full",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "bg-primary/10 rounded-none",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "bg-primary/10 rounded-r-full",
          defaultClassNames.range_end
        ),
        today: cn(
          "",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={React.useMemo(() => ({
        Root: ({ className, rootRef, ...props }: any) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }: any) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4", className)} {...props} />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: (props: any) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        ...components,
      }), [locale, components])}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      className={cn(
        "h-10 w-10 p-0 font-medium rounded-full transition-colors relative z-10",
        modifiers.selected && !modifiers.range_middle && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-sm scale-[0.98]",
        modifiers.range_middle && "bg-transparent text-foreground hover:bg-primary/20 focus:bg-primary/20",
        modifiers.today && !modifiers.selected && "bg-muted text-foreground font-semibold",
        modifiers.outside && "text-muted-foreground opacity-30",
        modifiers.disabled && "text-muted-foreground opacity-30",
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
