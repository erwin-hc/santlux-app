"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight }  from "lucide-react";
import SkeletonTable from "@/components/skeleton-table";
import { useIsAdmin } from "@/hooks/use-admin";


import {
  ColumnDef,
  flexRender,
  getCoreRowModel,  
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { ComboboxCustomItems } from "@/components/combobox";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount?: number 
  pageIndex?: number
  pageSize?: number
  regCount?: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  loading?:boolean
  isAdmin?:boolean
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
}: DataTableProps<TData, TValue>) {
  const isAdmin = useIsAdmin();
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,  
    meta: { isAdmin },
    pageCount: pageCount,    
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, 
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {      
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize })
        onPageChange(newState.pageIndex)
      }
    },
    
  })

  const infoPagina = `Página ${pageIndex + 1} de ${pageCount}`

  return (
    <div>
    <div className="overflow-hidden rounded-md border tracking-widest">
      <Table >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

         {loading ? 
         (<TableBody>
          <TableRow>
            <TableCell colSpan={columns.length}>
                <SkeletonTable/>
                <SkeletonTable/>
                <SkeletonTable/>
            </TableCell>
          </TableRow>
          </TableBody>) 
         : 
         (
          <TableBody>
          {table.getRowModel()?.rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="">
              <TableCell colSpan={columns.length} className="text-center h-24">
                Sem resultados!
              </TableCell>
            </TableRow>
          )}
        </TableBody>

         )
         } 


          
          <TableFooter>
          <TableRow >
            <TableCell colSpan={columns.length -2}>    
                <div className="flex gap-2">
                    <Button      
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="cursor-pointer rigcinza"
                    ><ArrowLeft/></Button>

                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="cursor-pointer rigcinza"
                    ><ArrowRight /></Button>
                    <Badge variant={"neutral"}>{infoPagina}</Badge>
                  </div>

            </TableCell>
            <TableCell colSpan={2}>
              <div className="flex items-center justify-center gap-2">
                <Badge variant={"neutral"}>Pedidos por página</Badge>
                <ComboboxCustomItems 
                value={pageSize} 
                onSelect={onPageSizeChange}
                />

              </div>
            </TableCell>
          </TableRow>
          </TableFooter>
      </Table>
    </div>
        



  </div>  
  )
}