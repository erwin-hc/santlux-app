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
  month: number | string;
}

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 2017;

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

  const canGoPrev = startYear > MIN_YEAR;
  const canGoNext = startYear + 11 < CURRENT_YEAR;

  return (
    <div className="w-56 p-3">
      <div className="flex items-center justify-between mb-2">
        <button
          aria-label="Previous decade"
          disabled={!canGoPrev}
          onClick={() =>
            setStartYear((s) => Math.max(MIN_YEAR - (MIN_YEAR % 12), s - 12))
          }
          className="px-2 py-1 rounded hover:bg-slate-100"
        >
          ◀
        </button>
        <div className="text-sm font-medium">
          {years[0]} – {years[years.length - 1]}
        </div>
        <button
          aria-label="Next decade"
          disabled={!canGoNext}
          onClick={() => setStartYear((s) => s + 12)}
          className="px-2 py-1 rounded hover:bg-slate-100"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {years.map((y) => {
          const isOutOfRange = y < MIN_YEAR || y > CURRENT_YEAR;
          return (
            <button
              key={y}
              disabled={isOutOfRange}
              onClick={() => onSelect(y)}
              className={`py-2 rounded text-sm ${
                isOutOfRange
                  ? "opacity-20 cursor-not-allowed"
                  : "hover:bg-slate-100"
              }`}
              aria-label={`Select year ${y}`}
            >
              {y}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DatePickerInput({
  date,
  onDateChange,
  month,
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);
  const [focusedYear, setFocusedYear] = React.useState<number>(
    date ? date.getFullYear() : new Date().getFullYear(),
  );

  React.useEffect(() => {
    if (date) setFocusedYear(date.getFullYear());
  }, [date]);

  const value = date ? String(date.getFullYear()) : "";

  return (
    <Field className="w-[175px]">
      <InputGroup>
        <InputGroupInput
          className="capitalize font-medium"
          id="date-year"
          value={month + "/" + value}
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
                <span className="sr-only">Selecione o Ano</span>
              </InputGroupButton>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
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
                    <span className="text-lg">{new Date().getFullYear()}</span>
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
