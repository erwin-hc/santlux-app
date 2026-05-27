"use client";

import { FileX } from "lucide-react";
import { useModal as useModalHook } from "@/providers/modal-provider";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonTableRomaneio from "@/components/skeleton-table-romaneio";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { DatePickerInput } from "@/components/data-picker";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { transpConfig, TranspKey } from "@/app/painel/pedidos/columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  date: Date | undefined;
  loading?: boolean;
  isAdmin?: boolean;
  error?: string;
  onDateChange?: (date: Date | undefined) => void;
}

export function DataTable<
  TData extends { dtentrega?: string | Date; transportadora?: string },
  TValue,
>({
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

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const stats = data.reduce(
    (acc, item) => {
      const nome = item.transportadora || "default";
      acc[nome] = (acc[nome] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const transportadorasEntries = Object.entries(stats)
    .map(([id, count]) => {
      const key = id as TranspKey;
      const config = transpConfig[key] || transpConfig.default;
      return {
        id: key,
        count,
        label: config.label,
        variant: config.variant,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  useEffect(() => {}, [selectedDate, setSelectedDate]);

  return (
    <Card className="px-1 border-none shadow-none">
      <CardHeader>
        <div className="border-b pb-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-4 flex-col sm:flex-row">
            <CardTitle>{formatDate(String(date))}</CardTitle>
            {!loading && (
              <CardDescription>
                <Badge variant={"neutral"} className="text-sm ">
                  {data.length} Pedido(s)
                </Badge>
              </CardDescription>
            )}
          </div>
          <DatePickerInput date={date} onDateChange={onDateChange} />
        </div>

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-2">
            {transportadorasEntries.map((transp) => {
              return (
                <Card key={transp.id} className="p-2 m-0">
                  <CardHeader className="p-0 m-0 gap-0">
                    <div className="flex justify-between items-center">
                      <div className="flex justify-center items-center gap-2">
                        <Badge
                          variant={transp.variant}
                          className="size-6 rounded-full border-none"
                        />
                        <span>{transp.label}</span>
                      </div>
                      <Badge
                        variant={transp.variant}
                        className="flex items-center justify-center border size-7 text-sm rounded-full font-bold"
                      >
                        {transp.count}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </CardHeader>

      <div className="overflow-hidden rounded-md border mx-2 mb-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-[12px] font-semibold "
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {loading ? (
            <TableBody className="divide-y divide-border">
              <TableRow>
                <TableCell colSpan={columns.length} className="m-0 ">
                  <SkeletonTableRomaneio />
                  <SkeletonTableRomaneio />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {table.getRowModel()?.rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="pointer-events-none">
                  <TableCell colSpan={columns.length} className="w-full">
                    <div className="flex justify-start items-center  min-h-84 px-20  ">
                      <FileX
                        className="text-foreground"
                        strokeWidth={0.75}
                        size={40}
                      />
                      <span>
                        Sem romaneio
                        {/* {" - "}
                        <span className="underline">
                          {formatDate(String(date))}!
                        </span> */}
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
