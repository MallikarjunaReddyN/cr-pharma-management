"use client"

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Tooltip,
  useDisclosure,
  Spinner
} from "@nextui-org/react";
import { DeleteIcon } from "../../components/logos/DeleteIcon";
import { EditIcon } from "../../components/logos/EditIcon";
import { EyeIcon } from "../../components/logos/EyeIcon";
import { ChevronDownIcon } from "../../components/logos/ChevronDownIcon";
import { SearchIcon } from "../../components/logos/SearchIcon";
import { PlusIcon } from "../../components/logos/PlusIcon";
import { capitalize } from "../../utils/utils";
import { DetailsModal, borrowLabels } from "../../components/modal/CommonModals";
import { AddBorrowModal, DeleteBorrowModal, EditBorrowModal } from "../../components/modal/BorrowModals";
import { getBorrows } from "@/actions/BorrowActions";
import { useAppContext } from "@/context";
import DayWeekSelector from "../DayWeekSelector";
import { useSession } from "next-auth/react";

const statusColorMap = {
  paid: "success",
  partial: "primary",
  unpaid: "warning",
  credit: "success",
  debit: "secondary"
};

const columns = [
  {
    key: "customer_name",
    label: "CUSTOMER NAME",
  },
  {
    key: "amount",
    label: "AMOUNT",
  },
  {
    key: "type",
    label: "TYPE",
  },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];

const columnsWithDeleted = [...columns, { key: "deletedBy", label: "DELETED" }];

const statusOptions = [
  { name: "Unpaid", uid: "unpaid" },
  { name: "Partial", uid: "partial" },
  { name: "Paid", uid: "paid" },
];

const typeOptions = [
  { name: "Credit", uid: "credit" },
  { name: "Debit", uid: "debit" },
];

export default function Borrows() {
  const { selectedDate } = useAppContext();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: detailsIsOpen, onOpen: detailsOnOpen, onOpenChange: detailsOnOpenChange, onClose: detailsOnClose } = useDisclosure();
  const { isOpen: editIsOpen, onOpen: editOnOpen, onOpenChange: editOnOpenChange, onClose: editOnClose } = useDisclosure();
  const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onOpenChange: deleteOnOpenChange, onClose: deleteOnClose } = useDisclosure();
  const [itemData, setItemData] = useState({});
  const [borrows, setBorrows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [random, setRandom] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchBorrows() {
      setIsLoading(true);
      let borrows = await getBorrows(selectedDate ? selectedDate : new Date(), filterValue, session?.user?.isAdmin);
      setBorrows(borrows);
      setIsLoading(false);
    }
    fetchBorrows();
  }, [selectedDate, random, filterValue])
  const filteredItems = React.useMemo(() => {
    let filteredBorrows = [...borrows];

    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredBorrows = filteredBorrows.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    if (typeFilter !== "all" && Array.from(typeFilter).length !== typeOptions.length) {
      filteredBorrows = filteredBorrows.filter((user) =>
        Array.from(typeFilter).includes(user.type),
      );
    }

    return filteredBorrows;
  }, [borrows, filterValue, statusFilter, typeFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);


  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "customer":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-xs capitalize">{cellValue}</p>
          </div>
        );
      case "amount":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-xs capitalize">{cellValue}</p>
          </div>
        );
      case "type":
        return (
          <Chip className="capitalize" color={statusColorMap[item.type]} size="sm" variant="dot">
            {cellValue}
          </Chip>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[item.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "deletedBy":
        return (
          cellValue && <Chip className="capitalize" color="danger" size="sm" variant="flat">
            {cellValue && "Deleted"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-5">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => { setItemData(item); detailsOnOpen(); }}
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => { setItemData(item); editOnOpen(); }}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <span className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => { setItemData(item); deleteOnOpen(); }}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 ml-3 mr-3">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="max-w-xs"
            placeholder="Search by customer name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            size="xs"
          />
          <div className="flex gap-3 z-0">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button size="sm" endContent={<ChevronDownIcon className="text-xs" />} variant="flat">
                  Type
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={typeFilter}
                selectionMode="multiple"
                onSelectionChange={setTypeFilter}
              >
                {typeOptions.map((type) => (
                  <DropdownItem key={type.uid} className="capitalize">
                    {capitalize(type.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button size="sm" endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button size="sm" className="text-white bg-[#00a69c]" endContent={<PlusIcon />} onPress={onOpen}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-xs">Total {borrows.length} items</span>
          <label className="flex items-center text-default-400 text-xs">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-xs"
              onChange={onRowsPerPageChange}
              defaultValue={5}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    onRowsPerPageChange,
    borrows.length,
    onSearchChange,
    typeFilter
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-4 flex justify-between items-center z-0 mx-2 mb-[50px]">
        <Button isDisabled={pages === 1 || borrows.length == 0} size="sm" variant="flat" onPress={onPreviousPage}>
          Previous
        </Button>
        <Pagination
          isCompact
          showControls
          classNames={{
            cursor: "bg-[#00a69c]"
          }}
          page={page}
          total={pages}
          onChange={setPage}
        />
        <Button isDisabled={pages === 1 || borrows.length == 0} size="sm" variant="flat" onPress={onNextPage}>
          Next
        </Button>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, filteredItems]);

  return (
    <>
      <DayWeekSelector />
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "min-h-[260px] w-auto mx-5",
        }}
        selectionMode="single"
        selectedKeys={selectedKeys}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={session?.user?.isAdmin ? columnsWithDeleted : columns}>
          {(column) => (
            <TableColumn
              key={column.ket}
              align={column.ket === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
              className="text-[9px]"
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={isLoading ? "" : "No data to display"} items={items} isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}>
          {(item) => (
            <TableRow key={item.borrow_id}>
              {(columnKey) => <TableCell className="text-xs">{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddBorrowModal isOpen={isOpen} onOpenChange={onOpenChange} typeOptions={typeOptions} onClose={onClose} setRandom={setRandom} />
      <DetailsModal name="Borrow" labels={borrowLabels} data={itemData} isOpen={detailsIsOpen} onOpenChange={detailsOnOpenChange} setItemData={setItemData} onClose={detailsOnClose} />
      <EditBorrowModal data={itemData} isOpen={editIsOpen} onOpenChange={editOnOpenChange} setItemData={setItemData} statusOptions={statusOptions} onClose={editOnClose} setRandom={setRandom} />
      <DeleteBorrowModal data={itemData} isOpen={deleteIsOpen} onOpenChange={deleteOnOpenChange} setItemData={setItemData} onClose={deleteOnClose} setRandom={setRandom} />
    </>
  );
}