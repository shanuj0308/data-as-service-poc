// import { Button } from "@/components/ui/button";
// import { ArrowRight, Blocks, Settings2 } from "lucide-react";
import { useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Columns3,
  DownloadIcon,
  MoreHorizontal,
  RefreshCcw,
  SearchIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DownloadDialog } from "@/components/layout/download-dialog";

const data: Payment[] = [
  {
    application_folder: "m5gr84i9",
    completed_at: "11 / 11 / 2020",
    legal_hold: "Yes",
    type: "Structured",
    gxp: "Gxp",
  },
  {
    application_folder: "3u1reuv4",
    completed_at: "10 / 11 / 2019",
    legal_hold: "No",
    type: "Unstructured",
    gxp: "Gxp High",
  },
  {
    application_folder: "derv1ws0",
    completed_at: "11 / 11 / 2020",
    legal_hold: "Yes",
    type: "Structured",
    gxp: "Gxp Medium",
  },
  {
    application_folder: "5kma53ae",
    completed_at: "10 / 11 / 2019",
    legal_hold: "No",
    type: "Unstructured",
    gxp: "Non-Gxp",
  },
  {
    application_folder: "bhqecj4p",
    completed_at: "11 / 11 / 2022",
    legal_hold: "Yes",
    type: "Unstructured",
    gxp: "Gxp",
  },
  {
    application_folder: "5kma53ae",
    completed_at: "10 / 11 / 2019",
    legal_hold: "No",
    type: "Unstructured",
    gxp: "Non-Gxp",
  },
  {
    application_folder: "bhqecj4p",
    completed_at: "11 / 11 / 2022",
    legal_hold: "Yes",
    type: "Unstructured",
    gxp: "Gxp",
  },
  {
    application_folder: "5kma53ae",
    completed_at: "10 / 11 / 2019",
    legal_hold: "No",
    type: "Unstructured",
    gxp: "Non-Gxp",
  },
  {
    application_folder: "bhqecj4p",
    completed_at: "11 / 11 / 2022",
    legal_hold: "Yes",
    type: "Unstructured",
    gxp: "Gxp",
  },
  {
    application_folder: "5kma53ae",
    completed_at: "10 / 11 / 2019",
    legal_hold: "No",
    type: "Unstructured",
    gxp: "Non-Gxp",
  },
  {
    application_folder: "bhqecj4p",
    completed_at: "11 / 11 / 2022",
    legal_hold: "Yes",
    type: "Unstructured",
    gxp: "Gxp",
  },
  {
    application_folder: "5kma53ae",
    completed_at: "10 / 11 / 2019",
    legal_hold: "No",
    type: "Unstructured",
    gxp: "Non-Gxp",
  },
  {
    application_folder: "bhqecj4p",
    completed_at: "11 / 11 / 2022",
    legal_hold: "Yes",
    type: "Unstructured",
    gxp: "Gxp",
  },
];

export type Payment = {
  application_folder: string;
  completed_at: string;
  legal_hold: "Yes" | "No";
  type: "Structured" | "Unstructured";
  gxp: "Gxp" | "Gxp Medium" | "Gxp High" | "Non-Gxp";
};

// eslint-disable-next-line react-refresh/only-export-components
export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "application_folder",
    header: "App Folder",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("application_folder")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "completed_at",
    header: "Completed At",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("completed_at")}</div>
    ),
  },
  {
    accessorKey: "legal_hold",
    header: "Legal Hold",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("legal_hold")}</div>
    ),
  },
  {
    accessorKey: "gxp",
    header: "GxP",
    cell: ({ row }) => <div className="capitalize">{row.getValue("gxp")}</div>,
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const archiveData = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(archiveData.application_folder)
              }
            >
              Copy App Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Database</DropdownMenuItem>
            <DropdownMenuItem>View Reports</DropdownMenuItem>
            <DropdownMenuItem>View Folders</DropdownMenuItem>

            <DownloadDialog
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Download
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState<string>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    // rowCount: data.length, // Set the number of rows per page
    // pageCount: Math.ceil(data.length / 2), // Set the total number of pages
  });

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-screen-lg mx-auto px-6">
        <h1 className="text-2xl leading-10 sm:text-3xl md:text-[30px] md:leading-[3.25rem] font-black tracking-tight">
          Archival Dashboard
        </h1>
        <div className="w-full">
          <div className="flex items-center gap-2 py-4">
            <Input
              placeholder="Filter apps..."
              value={
                (table
                  .getColumn("application_folder")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("application_folder")
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Columns3 /> Columns <ChevronDown className="ml-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="relative">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                    placeholder="Search"
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <SearchIcon className="absolute inset-y-0 my-auto left-2 h-4 w-4" />
                </div>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    if (
                      searchQuery &&
                      !column.id
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    ) {
                      return null;
                    }

                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                        onSelect={(e) => e.preventDefault()}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    table.resetColumnVisibility();
                    setSearchQuery("");
                  }}
                >
                  <RefreshCcw /> Reset
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
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
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="odd:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
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
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
