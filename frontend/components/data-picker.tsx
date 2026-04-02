"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate } from "@/lib/utils";

interface DatePickerInputProps {
  date: Date | undefined;
  onDateChange?: (date: Date | undefined) => void;
}

export function DatePickerInput({ date, onDateChange }: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(date || new Date());

  React.useEffect(() => {
    if (date) setMonth(date);
  }, [date]);

  const value = formatDate(String(date));

  return (
    <Field className="w-34">
      <InputGroup>
        <InputGroupInput
          id="date-required"
          value={value}
          readOnly
          placeholder="DD/MM/AAAA"
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
              <InputGroupButton id="date-picker" variant="ghost" size="icon-xs" aria-label="Select date">
                <CalendarIcon />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
              <Calendar
                mode="single"
                selected={date}
                month={month}
                onMonthChange={setMonth}
                onSelect={(newDate) => {
                  onDateChange?.(newDate);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
