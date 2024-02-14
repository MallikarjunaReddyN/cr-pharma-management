"use client"

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { ChevronDownIcon } from "../logos/ChevronDownIcon";
import { addBorrow, deleteBorrow, editBorrow } from "@/actions/BorrowActions";
import { useSession } from "next-auth/react";
import { toast } from 'sonner';
import { useAppContext } from "@/context";

const borrowSchema = yup.object({
    amount: yup.number().positive().required('Amount is required').min(1),
    customer_name: yup.string().required('Customer Name is required'),
    customer_number: yup.string().required("Please enter customer number").matches(/^[6-9]\d{9}$/, { message: "Please enter valid number.", excludeEmptyString: false }),
})

export const AddBorrowModal = ({ isOpen, onOpenChange, typeOptions, onClose }) => {
    const { data: session } = useSession();
    const { setRandom } = useAppContext();
    const [typeSelectedKeys, setTypeSelectedKeys] = React.useState(() => new Set(["credit"]));
    const typeSelectedValue = React.useMemo(
        () => Array.from(typeSelectedKeys).join(", ").replaceAll("_", " "),
        [typeSelectedKeys]
    );
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(borrowSchema),
    })

    const onSubmit = formData => {
        addBorrow(formData, typeSelectedValue, session?.user?.email).then(response => {
            const { code, error, data } = response;
            if (code == '200') {
                onClose();
                setRandom(Math.floor((Math.random() * 1000000) + 1));
                toast.success('Borrow added successfully!');
            } else {
                toast.error(error);
            }
        }).catch(err => {
            console.log('err', err);
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            size="sm"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-[#00a69c]">Add Borrow</ModalHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Customer Name"
                                    variant="bordered"
                                    className="text-black"
                                    {...register('customer_name')}
                                    isInvalid={errors.customer_name?.message}
                                    errorMessage={errors.customer_name?.message}
                                    isRequired
                                />
                                <Input
                                    label="Amount"
                                    variant="bordered"
                                    className="text-black"
                                    {...register('amount')}
                                    isInvalid={errors.amount?.message}
                                    errorMessage={errors.amount?.message}
                                    isRequired
                                />
                                <Input
                                    label="Customer Number"
                                    variant="bordered"
                                    className="text-black"
                                    {...register('customer_number')}
                                    isInvalid={errors.customer_number?.message}
                                    errorMessage={errors.customer_number?.message}
                                    isRequired
                                />
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            variant="bordered"
                                            className="capitalize"
                                            startContent={<span className="absolute left-3">{typeSelectedValue}</span>}
                                            endContent={<span className="absolute right-3"><ChevronDownIcon /></span>}
                                        >
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Type selection"
                                        variant="flat"
                                        disallowEmptySelection
                                        selectionMode="single"
                                        selectedKeys={typeSelectedKeys}
                                        onSelectionChange={setTypeSelectedKeys}
                                        items={typeOptions}
                                    >
                                        {(item) => (
                                            <DropdownItem
                                                key={item?.uid}
                                            >
                                                {item?.name}
                                            </DropdownItem>
                                        )}
                                    </DropdownMenu>
                                </Dropdown>
                            </ModalBody>
                            <ModalFooter>
                                <Button type="reset" color="danger" variant="light">
                                    Clear
                                </Button>
                                <Button type="submit" className="bg-[#00a69c] text-white font-bold">
                                    Add Borrow
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export const EditBorrowModal = ({ data, isOpen, onOpenChange, setItemData, statusOptions, onClose }) => {
    const { data: session } = useSession();
    const { setRandom } = useAppContext();
    const [selectedKeys, setSelectedKeys] = React.useState(() => new Set([data?.status]));

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(borrowSchema),
    })

    const onSubmit = formData => {
        editBorrow(data?.borrow_id, formData, selectedValue ? selectedValue : data?.status, session?.user?.email).then(response => {
            const { code, error, data } = response;
            if (code == '200') {
                onClose();
                setItemData({});
                setRandom(Math.floor((Math.random() * 1000000) + 1));
                toast.success('Borrow updated successfully!');
            } else {
                toast.error(error);
            }
        }).catch(err => {
            console.log('err', err);
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            size="sm"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-[#00a69c]">Edit Item</ModalHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Customer"
                                variant="bordered"
                                className="text-black"
                                defaultValue={data?.customer_name}
                                {...register('customer_name')}
                                isInvalid={errors.customer_name?.message}
                                errorMessage={errors.customer_name?.message}
                                isRequired
                            />
                            <Input
                                label="Amount"
                                variant="bordered"
                                className="text-black"
                                defaultValue={data?.amount}
                                {...register('amount')}
                                isInvalid={errors.amount?.message}
                                errorMessage={errors.amount?.message}
                                isRequired
                            />
                            <Input
                                label="Customer Number"
                                variant="bordered"
                                className="text-black"
                                defaultValue={data?.customer_number}
                                {...register('customer_number')}
                                isInvalid={errors.customer_number?.message}
                                errorMessage={errors.customer_number?.message}
                            />
                            <Dropdown isDisabled>
                                <DropdownTrigger>
                                    <Button
                                        variant="bordered"
                                        className="capitalize"
                                        startContent={<span className="absolute left-3">{data?.type}</span>}
                                        endContent={<span className="absolute right-3"><ChevronDownIcon /></span>}
                                    >
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Type selection"
                                    variant="flat"
                                    disallowEmptySelection
                                    selectionMode="single"
                                >
                                    <DropdownItem key={data?.type}>
                                        {data?.type}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        variant="bordered"
                                        className="capitalize"
                                        startContent={<span className="absolute left-3">{selectedValue ? selectedValue : data?.status}</span>}
                                        endContent={<span className="absolute right-3"><ChevronDownIcon /></span>}
                                    >
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Single selection example"
                                    variant="flat"
                                    disallowEmptySelection
                                    selectionMode="single"
                                    selectedKeys={selectedKeys}
                                    onSelectionChange={setSelectedKeys}
                                    items={statusOptions}
                                >
                                    {(item) => (
                                        <DropdownItem
                                            key={item?.uid}
                                        >
                                            {item?.name}
                                        </DropdownItem>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={() => { onClose(); setItemData({}); }}>
                                Close
                            </Button>
                            <Button type="submit" className="bg-[#00a69c] text-white font-bold">
                                Save
                            </Button>
                        </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export const DeleteBorrowModal = ({ data, isOpen, onOpenChange, setItemData, onClose }) => {
    const { data: session } = useSession();
    const { setRandom } = useAppContext();
    const borrowDelete = () => {
        deleteBorrow(data?.borrow_id, session?.user?.email).then(response => {
            const { code, error, data } = response;
            if (code == '200') {
                onClose();
                setItemData({});
                setRandom(Math.floor((Math.random() * 1000000) + 1));
                toast.success('Borrow deleted successfully!');
            } else {
                toast.error(error);
            }
        }).catch(err => {
            console.log('err', err);
        })
    }
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            size="sm"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-[#00a69c]">Delete Confirmation</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-3 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className="w-10 h-10">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                                </svg>
                                <p className="text-2xl">Are you sure?</p>
                                <p>Do you really want to delete these borrow? This process cannot be undone.</p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={() => { onClose(); setItemData({}) }}>
                                Close
                            </Button>
                            <Button className="bg-[#00a69c] text-white font-bold" onPress={borrowDelete}>
                                Delete
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}