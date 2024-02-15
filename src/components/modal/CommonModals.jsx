"use client"

import { capitalize, formatDate } from "@/utils/utils";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export const stockLabels = [
    {
        uid: "item_name",
        label: "ITEM NAME"
    },
    {
        uid: "quantity",
        label: "QUANTITY"
    },
    {
        uid: "agency",
        label: "AGENCY"
    },
    {
        uid: "agency_number",
        label: "AGENCY NO"
    },
    {
        uid: "status",
        label: "STATUS"
    },
];

export const orderLabels = [
    {
        uid: "item_name",
        label: "ITEM NAME"
    },
    {
        uid: "quantity",
        label: "QUANTITY"
    },
    {
        uid: "customer_name",
        label: "CUSTOMER"
    },
    {
        uid: "customer_number",
        label: "CUSTOMER NO"
    },
    {
        uid: "status",
        label: "STATUS"
    },
    {
        uid: "createdAt",
        label: "ORDER DATE"
    },
]

export const borrowLabels = [
    {
        uid: "customer_name",
        label: "CUSTOMER NAME"
    },
    {
        uid: "amount",
        label: "AMOUNT"
    },
    {
        uid: "customer_number",
        label: "CUSTOMER NO"
    },
    {
        uid: "type",
        label: "TYPE"
    },
    {
        uid: "status",
        label: "STATUS"
    },
    {
        uid: "createdAt",
        label: "BORROW DATE"
    },
]

const auditLabels = [
    {
        uid: "createdBy",
        label: "CREATED BY"
    },
    {
        uid: "createdAt",
        label: "CREATED DATE"
    },
    {
        uid: "updatedBy",
        label: "UPDATED BY"
    },
    {
        uid: "updatedAt",
        label: "MODIFIED DATE"
    },
]

const deleteLabels = [
    {
        uid: "deletedBy",
        label: "DELETED BY"
    },
    {
        uid: "updatedAt",
        label: "DELETED DATE"
    },
]

export const Detail = ({ label, value }) => {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-sm font-bold">
                {label}
            </p>
            <p className="ml-1">
                {value instanceof Date ? formatDate(value) : value ? value?.toString().substring(0, 20) : '-'}
            </p>
        </div>
    );
}

export const DetailsModal = ({ name, labels, data, isOpen, onOpenChange, setItemData }) => {
    const { data: session } = useSession();
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            size="md"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-[#00a69c]">{name} Details</ModalHeader>
                        <ModalBody>
                            <div>
                                <div className="pl-5 grid grid-cols-2 gap-3">
                                    {
                                        labels.map((label => <Detail key={label.uid} label={label?.label} value={data[label.uid]} />))
                                    }
                                </div>
                                <Divider className="my-4" />
                                <div className="pl-5 grid grid-cols-2 gap-3">
                                    {
                                        auditLabels.map((label => <Detail key={label.uid} label={label?.label} value={data[label.uid]} />))
                                    }
                                </div>
                                {
                                    (session?.user?.isAdmin && data?.deletedBy) && <>
                                        <Divider className="my-4" />
                                        <div className="pl-5 grid grid-cols-2 gap-3">
                                            {
                                                deleteLabels.map((label => <Detail key={label.uid} label={label?.label} value={data[label.uid]} />))
                                            }
                                        </div>
                                    </>
                                }
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={() => { onClose(); setItemData({}); }}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}