"use client"

import { convertUserIntoAdmin, deleteUser, getUsers } from '@/actions/UserActions';
import { DeleteIcon } from '@/components/logos/DeleteIcon';
import { EditIcon } from '@/components/logos/EditIcon';
import { Button, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { useSession } from "next-auth/react";

const columns = [
    {
        key: "email",
        label: "EMAIL",
    },
    {
        key: "phone_number",
        label: "PHONE NUMBER",
    },
    {
        key: "isAdmin",
        label: "ADMIN",
    },
    {
        key: "actions",
        label: "ACTIONS",
    },
];

export default function Users() {
    const { data: session } = useSession();
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [userRandom, setUserRandom] = useState(0);

    useEffect(() => {
        async function fetchUsers() {
            setDataIsLoading(true);
            let users = await getUsers(session?.user?.isAdmin);
            setUsers(users);
            setDataIsLoading(false);
        }
        fetchUsers();
    }, [userRandom]);

    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];
        switch (columnKey) {
            case "email":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-xs">{cellValue}</p>
                    </div>
                );
            case "isAdmin":
                return (
                    <Chip className="capitalize" color={cellValue ? "success" : "danger"} size="sm" variant="flat">
                        {cellValue ? "Yes" : "No"}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-5">
                        {!item?.isAdmin && <Button size='sm' type="submit" className="bg-[#00a69c] text-white font-bold" onPress={() => { convertUserIntoAdmin(item?.email, session?.user?.email); setUserRandom(Math.floor((Math.random() * 1000000) + 1)); }}>
                            Make Admin
                        </Button>}

                        <Button size='sm' type="submit" color="danger" className="text-white font-bold" onPress={() => { deleteUser(item?.email, session?.user?.email); setUserRandom(Math.floor((Math.random() * 1000000) + 1)); }}>
                            Delete
                        </Button>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <div>
            <Table aria-label="table with users"
                classNames={{
                    wrapper: ["max-w-4xl"],
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody emptyContent={dataIsLoading ? "" : "No users to display"} items={users}>
                    {(user) => (
                        <TableRow key={user?.email}>
                            {(columnKey) => <TableCell>{renderCell(user, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
