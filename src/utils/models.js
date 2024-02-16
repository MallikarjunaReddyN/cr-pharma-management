import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 40,
        },
        phone_number: {
            type: String,
            required: true,
            min:10,
            max: 10,
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const allowedUserSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 40,
        },
        createdBy: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

const stockSchema = new mongoose.Schema(
    {
        item_id: {
            type: String,
            required: true,
        },
        item_name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        agency: {
            type: String,
            required: true,
        },
        agency_number: {
            type: String,
        },
        status: {
            type: String,
            default: "added",
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        updatedBy: {
            type: String,
        },
        deletedBy: {
            type: String,
        }
    },
    { timestamps: true }
);

const orderSchema = new mongoose.Schema(
    {
        order_id: {
            type: String,
            required: true,
        },
        item_name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        customer_name: {
            type: String,
            required: true,
        },
        customer_number: {
            type: String,
        },
        status: {
            type: String,
            default: "placed",
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        updatedBy: {
            type: String,
        },
        deletedBy: {
            type: String,
        }
    },
    { timestamps: true }
);

const borrowSchema = new mongoose.Schema(
    {
        borrow_id: {
            type: String,
            required: true,
        },
        customer_name: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },

        customer_number: {
            type: String,
        },
        type: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "unpaid",
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        updatedBy: {
            type: String,
        },
        deletedBy: {
            type: String,
        }
    },
    { timestamps: true }
);

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
export const AllowedUser = mongoose.models?.AllowedUser || mongoose.model("AllowedUser", allowedUserSchema);
export const Stock = mongoose.models?.Stock || mongoose.model("Stock", stockSchema);
export const Order = mongoose.models?.Order || mongoose.model("Order", orderSchema);
export const Borrow = mongoose.models?.Borrow || mongoose.model("Borrow", borrowSchema);