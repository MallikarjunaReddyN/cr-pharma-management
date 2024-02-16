"use server"

import { connectToDb } from "@/utils/DbConnection";
import { AllowedUser } from "@/utils/models";
import { v4 as uuidv4 } from 'uuid';

export const addAllowedUser = async (formData, user) => {
    let { email } = formData;
    email = email?.toLowerCase();
    let user_id = uuidv4();
    try {
        connectToDb();
        const userExists = await AllowedUser.findOne({ email });
        if (userExists) {
            return { code: "N400", error: "You are not allowed to signup, please contact Admin." };
        }
        const allowedUser = new AllowedUser({
            user_id,
            email,
            createdBy: user
        });

        await allowedUser.save();
        console.log("saved to db");
        return { code: '200', error: "Allowed user added successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'S500', error: "Failed to add allowed user!" };
    }
}

export const getAllowedUsers = async (isAdmin) => {
    try {
        connectToDb();
        if (isAdmin) {
            return await AllowedUser.find({}, { _id: 0 });
        } else {
            return [];
        }
    } catch (err) {
        console.log(err);
        return { code: 'U500', error: "Failed to fetch allowed users!" };
    }
};

export const deleteAllowedUser = async (email, sessionEmail) => {
    try {
        connectToDb();
        if (email !== sessionEmail) {
            return { code: "AU400", code: "Not allowed to deleted current logged-in user."};
          }
        await AllowedUser.deleteOne({ email });
        //await User.findOneAndUpdate({ user_id }, { deletedBy: user });
        console.log("deleted from db");
        return { code: '200', error: "Allowed User deleted successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'U500', error: "Failed to delete allowed user!" };
    }
};