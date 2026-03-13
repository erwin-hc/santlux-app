"use client";
import { ArrowLeft, ArrowRight, FileX, Search } from "lucide-react";
import { useIsAdmin } from "@/hooks/use-admin";
import { useModal as useModalHook } from "@/providers/modal-provider";
import { useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, ColumnFiltersState, getFilteredRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SkeletonTable from "@/components/skeleton-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ComboboxCustomItems } from "@/components/combobox";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  regCount?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  isAdmin?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = 0,
  pageIndex = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  loading,
  inputRef,
  searchTerm,
  onSearchChange,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const isAdmin = useIsAdmin();
  const modalContext = useModalHook();

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    meta: { isAdmin, modal: modalContext },
    pageCount: pageCount,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    state: {
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize });
        onPageChange(newState.pageIndex);
      }
    },
  });

  const infoPagina = `Página ${pageIndex + 1} de ${pageCount}`;

  return (
    <div>
      <div className="relative flex items-center py-4">
        <Search className="absolute ml-2 text-sidebar-ring/80 " />
        <Input
          ref={inputRef}
          id="imput-search-pedidos"
          placeholder="Procurar..."
          value={searchTerm}
          className="max-w-2xl pl-12 placeholder:text-sidebar-ring/50"
          onChange={(e) => {
            const value = e.target.value.toUpperCase().replace(/\./g, ",");
            onSearchChange(value);
          }}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "Procurar...")}
        />
      </div>
      <div className="overflow-hidden rounded-md border tracking-widest ">
        <Table className="bg-sidebar [&_td]:p-1 [&_th]:p-1 [&_tr]:h-8 ">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <SkeletonTable />
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
                <TableRow className="">
                  <TableCell colSpan={columns.length} className="w-full ">
                    <div className="flex justify-start items-center gap-2 min-h-50 px-20">
                      <FileX className="text-foreground" strokeWidth={0.75} size={40} />
                      <span>Sem resultados!</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}

          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length - 2}>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="cursor-pointer h-8"
                  >
                    <ArrowLeft />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="cursor-pointer h-8"
                  >
                    <ArrowRight />
                  </Button>
                  <Badge variant={"neutral"}>{infoPagina}</Badge>
                  <Badge variant={"entregue"}>
                    {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} Registro(s) Selecionado(s)
                  </Badge>
                </div>
              </TableCell>

              <TableCell colSpan={2}>
                <div className="flex items-center justify-center gap-2">
                  <Badge className="h-8" variant={"neutral"}>
                    Pedidos por página
                  </Badge>
                  <ComboboxCustomItems value={pageSize} onSelect={onPageSizeChange} />
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
