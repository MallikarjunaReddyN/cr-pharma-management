"use server"

import { connectToDb } from "@/utils/DbConnection";
import { Stock } from "@/utils/models";
import { v4 as uuidv4 } from 'uuid';

export const addStock = async (formData, user) => {
    const { item_name, quantity, agency, agency_number } = formData;
    let item_id = uuidv4();
    try {
        connectToDb();
        const stock = new Stock({
            item_id,
            item_name,
            quantity,
            agency,
            agency_number,
            createdBy: user,
            updateBy: user
        });

        await stock.save();
        console.log("saved to db");
        return { code: '200',error: "Stock added successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'S500',error: "Failed to add stock!" };
    }
}

export const getStocks = async (selectedDate, isAdmin) => {
    console.log(selectedDate);
    try {
        connectToDb();
        if (isAdmin) {
            return await Stock.find({ createdAt: { $gte: selectedDate.setHours(0, 0, 0, 0), $lt: selectedDate.setHours(23, 59, 59, 999) } }, { _id: 0 });
        } else {
            return await Stock.find({ createdAt: { $gte: selectedDate.setHours(0, 0, 0, 0), $lt: selectedDate.setHours(23, 59, 59, 999) }, deletedBy : { $eq: null } }, { _id: 0 });
        }
    } catch (err) {
        console.log(err);
        return {code: 'S500', error: "Failed to fetch stocks!"};
    }
};

export const editStock = async (item_id, formData, status, user) => {
    const { item_name, quantity, agency, agency_number } = formData;
    try {
        connectToDb();
        await Stock.findOneAndUpdate({ item_id }, { item_name, quantity, agency, agency_number, status, updatedBy: user });
        console.log("updated to db");
        return { code: '200',error: "Stock updated successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'S500', error: "Failed to update stock!" };
    }
}

export const deleteStock = async (item_id, user) => {
    try {
        connectToDb();
        //await Stock.deleteOne({ item_id });
        await Stock.findOneAndUpdate({ item_id }, { deletedBy: user });
        console.log("deleted from db");
        return { code: '200',error: "Stock deleted successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'S500', error: "Failed to delete stock!" };
    }
};