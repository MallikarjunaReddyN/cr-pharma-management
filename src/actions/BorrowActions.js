"use server"

import { connectToDb } from "@/utils/DbConnection";
import { Borrow } from "@/utils/models";
import { v4 as uuidv4 } from 'uuid';

export const addBorrow = async (formData, type, user) => {
    const { customer_name, amount, customer_number, } = formData;
    let borrow_id = uuidv4();
    try {
        connectToDb();
        const borrow = new Borrow({
            borrow_id,
            customer_name,
            amount,
            customer_number,
            type,
            createdBy: user,
            updatedBy: user
        });

        await borrow.save();
        console.log("saved to db");
        return { code: '200', error: "Borrow added successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'B500', error: "Failed to add borrow!" };
    }
}

export const getBorrows = async (selectedDate, filterValue, isAdmin) => {
    try {
        connectToDb();
        if (isAdmin) {
            if (filterValue) {
                const borrows = await Borrow.find({ }, { _id: 0 });
                return borrows.filter((borrow) =>borrow.customer_name.toLowerCase().includes(filterValue.toLowerCase()));
            } else {
                return await Borrow.find({ createdAt: { $gte: selectedDate.setHours(0, 0, 0, 0), $lt: selectedDate.setHours(23, 59, 59, 999) } }, { _id: 0 });
            }
        } else {
            if (filterValue) {
                const borrows = await Borrow.find({ deletedBy : { $eq: null } }, { _id: 0 });
                return borrows.filter((borrow) =>borrows.customer_name.toLowerCase().includes(filterValue.toLowerCase()));
            } else {
                return await Borrow.find({ createdAt: { $gte: selectedDate.setHours(0, 0, 0, 0), $lt: selectedDate.setHours(23, 59, 59, 999) }, deletedBy: { $eq: null } }, { _id: 0 });
            }
        }
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch borrows!");
    }
};

export const editBorrow = async (borrow_id, formData, status, user) => {
    const { customer_name, amount, customer_number } = formData;
    try {
        connectToDb();
        await Borrow.findOneAndUpdate({ borrow_id }, { customer_name, amount, customer_number, status, updatedBy: user });
        console.log("updated to db");
        return { code: '200', error: "Borrow updated successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'B500', error: "Failed to update borrow!" };
    }
}

export const deleteBorrow = async (borrow_id, user) => {
    try {
        connectToDb();
        await Borrow.findOneAndUpdate({ borrow_id }, { deletedBy: user });
        //await Borrow.deleteOne( { borrow_id } );
        console.log("deleted from db");
        return { code: '200',error: "Borrow deleted successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'B500', error: "Failed to delete borrow!" };
    }
};

