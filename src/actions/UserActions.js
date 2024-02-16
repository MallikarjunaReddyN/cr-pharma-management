"use server"

import { connectToDb } from "@/utils/DbConnection";
import { User } from "@/utils/models";
import { v4 as uuidv4 } from 'uuid';

// export const addUser = async (formData, user) => {
//     const { item_name, quantity, agency, agency_number } = formData;
//     let item_id = uuidv4();
//     try {
//         connectToDb();
//         const user = new User({
//             user_id,
//             email,
//             phone_number,
            
//             createdBy: user,
//             updateBy: user
//         });

//         await stock.save();
//         console.log("saved to db");
//         return { code: '200', error: "Stock added successfully" };
//     } catch (err) {
//         console.log(err);
//         return { code: 'S500', error: "Failed to add stock!" };
//     }
// }

export const getUsers = async (isAdmin) => {
    try {
        connectToDb();
        if (isAdmin) {
                return await User.find({ }, { _id: 0 });
        } else {
            return [];
        }
    } catch (err) {
        console.log(err);
        return { code: 'U500', error: "Failed to fetch users!" };
    }
};

export const editUser = async (user_id, formData, isAdmin, user) => {
    const { phone_number } = formData;
    try {
        connectToDb();
        isAdmin = isAdmin == 'true' ? true : false;
        await User.findOneAndUpdate({ user_id }, { phone_number, isAdmin, updatedBy: user });
        console.log("updated to db");
        return { code: '200', error: "User updated successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'U500', error: "Failed to update user!" };
    }
}

export const convertUserIntoAdmin = async (email, sessionEmail) => {
    try {
        connectToDb();
        await User.findOneAndUpdate({ email }, { isAdmin: true, updatedBy: sessionEmail });
        console.log("updated to db");
        return { code: '200', error: "User updated successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'U500', error: "Failed to update user!" };
    }
}


export const deleteUser = async (email, sessionEmail) => {
    if (email !== sessionEmail) {
        return { code: "U400", code: "Not allowed to deleted current logged-in user."};
      }
    try {
        connectToDb();
        await User.deleteOne({ email });
        //await User.findOneAndUpdate({ user_id }, { deletedBy: user });
        console.log("deleted from db");
        return { code: '200', error: "User deleted successfully" };
    } catch (err) {
        console.log(err);
        return { code: 'U500', error: "Failed to delete user!" };
    }
};