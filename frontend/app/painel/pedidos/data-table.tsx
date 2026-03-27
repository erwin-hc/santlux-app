"use client";
import { ArrowLeft, ArrowRight, FileX, Search, Trash2 } from "lucide-react";
import { useIsAdmin } from "@/hooks/use-admin";
import { useModal as useModalHook } from "@/providers/modal-provider";
import { useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, ColumnFiltersState, getFilteredRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SkeletonTable from "@/components/skeleton-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComboboxCustomItems } from "@/components/combobox";
import { SwitchEntregue } from "@/components/switch";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

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
    meta: { isAdmin, modal: modalContext, isSearching: searchTerm.length > 0 },
    pageCount: pageCount,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: (row) => {
      const data = row.original as TData & { nnota?: unknown };
      const temNota = !!data.nnota;
      const isSearching = searchTerm.length > 0;
      return temNota && isSearching;
    },
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
      <div className="relative flex items-center pb-2">
        <InputGroup className="max-w-xl h-11">
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>

          <InputGroupInput
            ref={inputRef}
            id="imput-search-pedidos"
            placeholder="Procurar..."
            value={searchTerm}
            className="placeholder:text-sidebar-ring/50"
            onChange={(e) => {
              const value = e.target.value.toUpperCase().replace(/\./g, ",");
              onSearchChange(value);
              onPageChange(0);
            }}
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Procurar...")}
          />
          <InputGroupAddon align="inline-end">
            <Button
              variant={"ghost"}
              size={"icon-sm"}
              className="cursor-pointer"
              onClick={() => {
                onSearchChange("");
                table.resetColumnFilters();
                table.resetRowSelection();
                onPageChange(0);
                setTimeout(() => {
                  window.dispatchEvent(new Event("refresh-pedidos"));
                }, 0);
              }}
            >
              <Trash2 />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table className="bg-sidebar [&_td]:p-1 [&_th]:p-1 [&_tr]:h-10.5">
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

                  {table.options.meta?.isSearching && table.getFilteredRowModel().rows.length > 1 && (
                    <div className="flex items-center">
                      {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <div className="flex items-center justify-center gap-2">
                          <Badge variant={"LG"} className="gap-2 h-8 animate-in fade-in slide-in-from-left-2">
                            <SwitchEntregue
                              isChecked={false}
                              handleClick={() => {
                                const selectedData = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
                                table.options.meta?.modal?.openModal("updateEntregaSelecao", selectedData);
                                onSearchChange("");
                                table.resetRowSelection();
                              }}
                            />
                            <span className="cursor-default">Marcar Entregue? {table.getFilteredSelectedRowModel().rows.length} selecionados!</span>
                          </Badge>

                          <Badge variant={"AF"} className="gap-2 h-8 animate-in fade-in slide-in-from-left-2">
                            <SwitchEntregue
                              isChecked={false}
                              handleClick={() => {
                                const selectedData = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
                                table.options.meta?.modal?.openModal("updatePrevisaoSelecao", selectedData);
                                onSearchChange("");
                                table.resetRowSelection();
                              }}
                            />
                            <span className="cursor-default">Alterar Previsão? {table.getFilteredSelectedRowModel().rows.length} Selecionados!</span>
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
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
