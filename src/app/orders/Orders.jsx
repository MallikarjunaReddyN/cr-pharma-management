"use client"

import React, { useState, useEffect } from "react";
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
import { AddOrderModal, DeleteOrderModal, EditOrderModal } from "../../components/modal/OrderModals";
import { DetailsModal, orderLabels } from "../../components/modal/CommonModals";
import { getOrders } from "@/actions/OrderActions";
import { useAppContext } from "@/context";
import { useSession } from "next-auth/react";
import DayWeekSelector from "../DayWeekSelector";

const statusColorMap = {
  placed: "warning",
  confirmed: "primary",
  outfordelivery: "secondary",
  delivered: "success",
};

const columns = [
  {
    key: "item_name",
    label: "ITEM",
  },
  {
    key: "quantity",
    label: "QUANTITY",
  },
  {
    key: "customer_name",
    label: "CUSTOMER NAME",
  },
  {
    key: "customer_number",
    label: "CUSTOMER NUMBER",
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

const statusOptions = [
  { name: "Placed", uid: "placed" },
  { name: "Confirmed", uid: "confirmed" },
  { name: "Out For Delivery", uid: "outfordelivery" },
  { name: "Delivered", uid: "delivered" },
];

export default function Orders() {
  const { selectedDate, random } = useAppContext();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: detailsIsOpen, onOpen: detailsOnOpen, onOpenChange: detailsOnOpenChange, onClose: detailsOnClose } = useDisclosure();
  const { isOpen: editIsOpen, onOpen: editOnOpen, onOpenChange: editOnOpenChange, onClose: editOnClose } = useDisclosure();
  const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onOpenChange: deleteOnOpenChange, onClose: deleteOnClose } = useDisclosure();
  const [itemData, setItemData] = useState({});
  const [orders, setOrders] = useState([]);
  const hasSearchFilter = Boolean(filterValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      let orders = await getOrders(selectedDate ? selectedDate : new Date());
      setOrders(orders);
      setIsLoading(false);
    }
    fetchOrders();
  }, [selectedDate, random])


  const filteredItems = React.useMemo(() => {
    let filteredOrders = [...orders];

    if (hasSearchFilter) {
      filteredOrders = filteredOrders.filter((user) =>
        user.item.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredOrders = filteredOrders.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredOrders;
  }, [orders, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);


  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "item_name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case "customer_name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[item.status]} size="sm" variant="flat">
            {cellValue}
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
      <div className="flex flex-col gap-4 mt-3 ml-3 mr-3">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[24%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            size="sm"
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
            <Button className="text-white bg-[#00a69c]" endContent={<PlusIcon />} onPress={onOpen}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {orders.length} items</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              defaultValue={10}
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
    orders.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-4 flex justify-between items-center z-0 mb-[50px]">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
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
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, filteredItems, hasSearchFilter]);

  return (
    <>
      <DayWeekSelector />
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "min-h-[300px] h-full w-auto mx-5",
        }}
        selectionMode="single"
        selectedKeys={selectedKeys}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={isLoading ? "" : "No data to display"} items={items} isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}>
          {(order) => (
            <TableRow key={order.order_id}>
              {(columnKey) => <TableCell>{renderCell(order, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddOrderModal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
      <DetailsModal name="Order" labels={orderLabels} data={itemData} isOpen={detailsIsOpen} onOpenChange={detailsOnOpenChange} setItemData={setItemData} onClose={detailsOnClose} />
      <EditOrderModal data={itemData} isOpen={editIsOpen} onOpenChange={editOnOpenChange} setItemData={setItemData} statusOptions={statusOptions} onClose={editOnClose} />
      <DeleteOrderModal data={itemData} isOpen={deleteIsOpen} onOpenChange={deleteOnOpenChange} setItemData={setItemData} onClose={deleteOnClose} />
    </>
  );
}