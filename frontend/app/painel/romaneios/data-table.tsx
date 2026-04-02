"use client";

import { FileX } from "lucide-react";
import { useModal as useModalHook } from "@/providers/modal-provider";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SkeletonTable from "@/components/skeleton-table";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { DatePickerInput } from "@/components/data-picker";
import { useState, useEffect } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  date: Date | undefined;
  loading?: boolean;
  isAdmin?: boolean;
  onDateChange?: (date: Date | undefined) => void;
}

export function DataTable<TData extends { dtentrega?: string | Date; transportadora?: string }, TValue>({
  columns,
  data,
  date,
  loading,
  isAdmin,
  onDateChange,
}: DataTableProps<TData, TValue>) {
  const modalContext = useModalHook();

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    meta: { modal: modalContext, isAdmin },
    getCoreRowModel: getCoreRowModel(),
  });

  const uniqueTransp = Array.from(new Set(data.map((item) => item.transportadora))).sort();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {}, [selectedDate, setSelectedDate]);

  return (
    <Card className="px-1 ">
      <CardHeader>
        <div className="border-b pb-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-2 flex-col sm:flex-row">
            <CardTitle>{formatDate(String(date))}</CardTitle>
            <CardDescription>{data.length} Pedido(s)</CardDescription>
          </div>
          <DatePickerInput date={date} onDateChange={onDateChange} />
        </div>
      </CardHeader>

      <div className="overflow-hidden rounded-md border mx-6 bg-sidebar">
        <Table className="text-[12px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-[12px] font-semibold ">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {loading ? (
            <TableBody className="divide-y divide-border">
              <TableRow>
                <TableCell colSpan={columns.length} className="m-0">
                  <SkeletonTable />
                  <SkeletonTable />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {table.getRowModel()?.rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="pointer-events-none">
                  <TableCell colSpan={columns.length} className="w-full">
                    <div className="flex justify-start items-center gap-2 min-h-96 px-20  ">
                      <FileX className="text-foreground" strokeWidth={0.75} size={40} />
                      <span>
                        Sem romaneio <span className="underline"> {formatDate(String(date))}!</span>
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
    </Card>
  );
}
