"use server"

import { connectToDb } from "@/utils/DbConnection";
import { Order } from "@/utils/models";
import { v4 as uuidv4 } from 'uuid';

export const addOrder = async (formData, user) => {
    const { item_name, quantity, customer_name, customer_number } = formData;
    let order_id = uuidv4();
    try {
        connectToDb();
        const order = new Order({
            order_id,
            item_name,
            quantity,
            customer_name,
            customer_number,
            createdBy: user,
            updatedBy: user
        });

        await order.save();
        console.log("saved to db");
        return { code: '200',error: "Order added successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'O500', error: "Failed to add order!" };
    }
}

export const getOrders = async (selectedDate, filterValue, isAdmin) => {
    try {
        connectToDb();
        if (isAdmin) {
            if (filterValue) {
                const orders = await Order.find({ }, { _id: 0 });
                return orders.filter((order) =>order.customer_name.toLowerCase().includes(filterValue.toLowerCase()));
            } else {
                return await Order.find({ createdAt: { $gte: selectedDate.setHours(0, 0, 0, 0), $lt: selectedDate.setHours(23, 59, 59, 999) } }, { _id: 0 });
            }
        } else {
            if (filterValue) {
                const orders = await Order.find({ deletedBy : { $eq: null } }, { _id: 0 });
                return orders.filter((order) =>order.customer_name.toLowerCase().includes(filterValue.toLowerCase()));
            } else {
                return await Order.find({ createdAt: { $gte: selectedDate.setHours(0, 0, 0, 0), $lt: selectedDate.setHours(23, 59, 59, 999) }, deletedBy: { $eq: null } }, { _id: 0 });
            }
        }
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch orders!");
    }
};

export const editOrder = async (order_id, formData, status, user) => {
    const { item_name, quantity, customer_name, customer_number } = formData;
    try {
        connectToDb();
        await Order.findOneAndUpdate({ order_id }, { item_name, quantity, customer_name, customer_number, status, updatedBy: user });
        console.log("updated to db");
        return { code: '200',error: "Order updated successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'O500', error: "Failed to update stock!" };
    }
}


export const deleteOrder = async (order_id, user) => {
    try {
        connectToDb();
        await Order.findOneAndUpdate({ order_id }, { deletedBy: user });
        //await Order.deleteOne( { order_id } );
        console.log("deleted from db");
        return { code: '200',error: "Order deleted successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'O500', error: "Failed to delete order!" };
    }
};