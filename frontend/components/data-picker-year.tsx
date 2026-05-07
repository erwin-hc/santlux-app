"use client";
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";

interface DatePickerInputProps {
  date: Date | undefined;
  onDateChange?: (date: Date | undefined) => void;
}

function YearPicker({
  initialYear,
  onSelect,
}: {
  initialYear: number;
  onSelect: (y: number) => void;
}) {
  const [startYear, setStartYear] = React.useState(
    () => Math.floor(initialYear / 12) * 12,
  );

  React.useEffect(() => {
    setStartYear(Math.floor(initialYear / 12) * 12);
  }, [initialYear]);

  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

  return (
    <div className="w-56 p-3">
      <div className="flex items-center justify-between mb-2">
        <button
          aria-label="Previous decade"
          onClick={() => setStartYear((s) => s - 12)}
          className="px-2 py-1 rounded hover:bg-slate-100"
        >
          ◀
        </button>
        <div className="text-sm font-medium">
          {years[0]} – {years[years.length - 1]}
        </div>
        <button
          aria-label="Next decade"
          onClick={() => setStartYear((s) => s + 12)}
          className="px-2 py-1 rounded hover:bg-slate-100"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => onSelect(y)}
            className="py-2 rounded hover:bg-slate-100 text-sm"
            aria-label={`Select year ${y}`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DatePickerInput({ date, onDateChange }: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);
  const [focusedYear, setFocusedYear] = React.useState<number>(
    date ? date.getFullYear() : new Date().getFullYear(),
  );

  React.useEffect(() => {
    if (date) setFocusedYear(date.getFullYear());
  }, [date]);

  const value = date ? String(date.getFullYear()) : "";

  return (
    <Field className="w-24">
      <InputGroup>
        <InputGroupInput
          id="date-year"
          value={value}
          readOnly
          placeholder="AAAA"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id="date-picker"
                variant="ghost"
                size="icon-xs"
                aria-label="Select year"
              >
                <CalendarIcon />
                <span className="sr-only">Select year</span>
              </InputGroupButton>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <div>
                <YearPicker
                  initialYear={focusedYear}
                  onSelect={(year) => {
                    const yearOnly = new Date(year, 0, 1);
                    onDateChange?.(yearOnly);
                    setFocusedYear(year);
                    setOpen(false);
                  }}
                />

                <div className="p-2">
                  <Button
                    onClick={() => {
                      const todayYear = new Date().getFullYear();
                      onDateChange?.(new Date(todayYear, 0, 1));
                      setFocusedYear(todayYear);
                      setOpen(false);
                    }}
                    className="mt-2 w-full text-xs font-medium"
                  >
                    HOJE
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
