"use server"

import { connectToDb } from "@/utils/DbConnection";
import { AllowedUser, User } from "@/utils/models";
import bcrypt from "bcryptjs";


export const handleLogout = async () => {
    await signOut();
  };
  
  export const signUp = async (formData) => {
    const { email, phone_number, password, confirm_password } =formData;
  
    if (password !== confirm_password) {
      return { code: "P400", code: "Passwords do not match"};
    }
  
    try {
      connectToDb();
  
      // const allowedUser = await AllowedUser.findOne({ email });
      // if (!allowedUser) {
      //   return { code: "N400", error: "You are not allowed to signup, please contact Admin." };
      // }
      const user = await User.findOne({ email });
  
      if (user) {
        return { code: "U400", error: "Email already exists" };
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        email,
        phone_number,
        password: hashedPassword,
      });
  
      await newUser.save();
      console.log("User registration successful");
  
      return { code: "200",data: "Registration successful" };
    } catch (err) {
      console.log(err);
      return { code: "400", error: "User registration failed!" };
    }
  };

  export const updatePassword = async (formData, email) => {
    const { old_password, new_password, confirm_password } =formData;
  
    if (new_password !== confirm_password) {
      return { code: "400", error: "New & Confirm Passwords must match" };
    }
  
    try {
      connectToDb();
  
      const user = await User.findOne({ email });
      if (user) {
        const isPasswordMatch = await bcrypt.compare(old_password , user?.password);
        if (isPasswordMatch) {
          const salt = await bcrypt.genSalt(10);
          const newHashedPassword = await bcrypt.hash(new_password, salt);
          await User.findOneAndUpdate({ email }, {  password: newHashedPassword });
          return { code: "200",data: "Password updated successfully" };
        } else {
          return { code: "U400", error: "Old password is incorrect" };
        }
      }
    } catch (err) {
      console.log(err);
      return { code: "400", error: "Failed to update password, please try again later!!" };
    }
  };
  
  // export const login = async (formData) => {
  //   const { email, password } = formData;
  
  //   try {
  //     await signIn('credentials', {
  //       email, 
  //       password
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     if (err.message.includes("CredentialsSignin")) {
  //       return { error: "Invalid email or password" };
  //     }
  //     throw err;
  //   }
  // };