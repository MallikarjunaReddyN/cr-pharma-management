"user client"

import { Button, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'sonner';
import { useSession } from "next-auth/react";
import { addAllowedUser, deleteAllowedUser, getAllowedUsers } from '@/actions/AllowedUserActions';
import { DeleteIcon } from '@/components/logos/DeleteIcon';
import { deleteUser } from '@/actions/UserActions';


const columns = [
    {
        key: "email",
        label: "EMAIL",
    },
    {
        key: "actions",
        label: "ACTIONS",
    },
];

const allowedUserSchema = yup.object({
    email: yup.string().required('Email is required').email("Invalid email address")
})

export default function AllowedUsers() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [allowedUsers, setAllowedUsers] = useState([]);
    const [userRandom, setUserRandom] = useState(0);
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(allowedUserSchema),
    });

    const onSubmit = async (formData) => {
        setIsLoading(true);
        addAllowedUser(formData, session?.user?.email).then(response => {
            console.log(response);
            const { code, error, data } = response;
            if (code != '200') {
                toast.error(error);
                setIsLoading(false);
            } else {
                toast.success('Allowed user successfully for registration!');
                setIsLoading(false);
                setUserRandom(Math.floor((Math.random() * 1000000) + 1));
            }
        }).catch(err => {
            setIsLoading(false);
            console.log('err', err);
        })
    }

    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];
        switch (columnKey) {
            case "email":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-xs">{cellValue}</p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-5">
                        <Tooltip color="danger" content="Delete">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50"
                                onClick={() => { deleteAllowedUser(item?.email, session?.user?.email); setUserRandom(Math.floor((Math.random() * 1000000) + 1)); }}
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


    useEffect(() => {
        async function fetchAllowedUsers() {
            console.log("coming...")
            setDataIsLoading(true);
            let allowedUsers = await getAllowedUsers(session?.user?.isAdmin);
            setAllowedUsers(allowedUsers);
            setDataIsLoading(false);
        }
        fetchAllowedUsers();
    }, [userRandom]);


    return (
        <div className='flex flex-col gap-4'>
            <form className='flex gap-2' onSubmit={handleSubmit(onSubmit)}>
                <Input
                    autoFocus
                    label="Email"
                    variant="bordered"
                    className="text-black w-[25%] h-[30px]"
                    labelPlacement='outside'
                    {...register('email')}
                    isInvalid={errors.email?.message}
                    errorMessage={errors.email?.message}
                    isRequired
                />
                <Button size='sm' type="submit" className="bg-[#00a69c] text-white font-bold mt-7" isLoading={isLoading}>
                    Allow User
                </Button>
            </form>

            <Table aria-label="Example table with dynamic content"
            classNames={{
                wrapper: [ "max-w-xl"],
            }}
            >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody emptyContent={dataIsLoading ? "" : "No users to display"}  items={allowedUsers}>
                    {(user) => (
                        <TableRow key={user.user_id}>
                            {(columnKey) => <TableCell>{renderCell(user, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
