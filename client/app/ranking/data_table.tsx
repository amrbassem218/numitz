"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
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
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MdOutlineSort } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function RankingDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableSortingRemoval: false,
    state: {
      sorting,
      columnFilters,
    },
  });
  const problemsSortingMethods = ["custom", "difficulty", "precentage_solved"];
  const [usedSortingMethod, setUsedSortingMehtod] = useState<string>(
    problemsSortingMethods[0],
  );
  const handleSortingMethodChange = (meth: string) => {
    if (meth) {
      if (meth !== usedSortingMethod) {
        setUsedSortingMehtod(meth);
      }
      if (meth.toLowerCase() !== "custom") {
        table.getColumn(meth)?.toggleSorting();
      }
    }
  };
  return (
    <div>
      <div className="flex items-center gap-2">
        {/* Searching */}
        <div className="flex items-center py-4">
          <Input
            placeholder="Search Problem..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        {/* Sorting */}
        <div className="p-2 bg-bg rounded-full cursor-pointer hover:bg-muted-foreground/25 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MdOutlineSort className="w-5 h-5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {problemsSortingMethods.map((meth) => (
                  <DropdownMenuItem
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => handleSortingMethodChange(meth)}
                  >
                    {meth}
                    {meth === usedSortingMethod && <Check />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md">
        <Table className="[&_td]:text-center [&_th]:text-center">
          <TableBody className="">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-none border border_green-500 h-12 cursor-pointer"
                  // TODO: Figure out the problem rerouting architecture
                  onClick={() => router.push(`/`)}
                >
                  {row.getVisibleCells().map((cell, j) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "max-w-fit",
                        i % 2 === 0 && "bg-bg-light",
                        j == row.getVisibleCells().length - 1 && "rounded-r-md",
                        j == 0 && "rounded-l-md",
                        "",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
