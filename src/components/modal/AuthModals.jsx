"use client"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { signUp, updatePassword } from "@/actions/AuthActions";
import { signIn, signOut } from "next-auth/react";
import { toast } from 'sonner';
import { useSession } from "next-auth/react";

const loginSchema = yup.object({
    email: yup.string().required('Email is required').email("Invalid email address"),
    password: yup.string().required('Password is required')
})
export const LoginModal = ({ isOpen, onOpenChange, onClose }) => {
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (formData) => {
        const { email, password } = formData;
        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });
            if (res.error) {
                console.log(res.error);
                toast.error('Incorrect email and password.');
                return;
            }
            onClose();
            window.location.replace("/");
        } catch (err) {
            console.log(err);
        }
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
                        <ModalHeader className="flex flex-col gap-1 text-[#00a69c]">Login</ModalHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    endContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                                        </svg>
                                    }
                                    label="Email"
                                    variant="bordered"
                                    className="text-black"
                                    {...register('email')}
                                    isInvalid={errors.email?.message}
                                    errorMessage={errors.email?.message}
                                    isRequired
                                />
                                <Input
                                    endContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    label="Password"
                                    type="password"
                                    variant="bordered"
                                    className="text-black"
                                    {...register('password')}
                                    isInvalid={errors.password?.message}
                                    errorMessage={errors.password?.message}
                                    isRequired
                                />
                                {/* <div className="flex py-2 px-1 justify-between">
                                    <Link color="primary" href="#" size="sm">
                                        Forgot password?
                                    </Link>
                                </div> */}
                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" className="bg-[#00a69c] text-white font-bold" endContent={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                }>
                                    Login
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

const registerSchema = yup.object({
    email: yup.string().required('Email is required').email("Invalid email address"),
    phone_number: yup.string().required("Please enter customer number").matches(/^[6-9]\d{9}$/, { message: "Please enter valid number.", excludeEmptyString: false }),
    password: yup.string().required('Password is required').min(8, "Password should contain atleast 8 characters"),
    confirm_password: yup.string().required().oneOf([yup.ref('password'), null], 'Passwords must match'),
})

export const SignUpModal = ({ isOpen, onOpenChange, onClose }) => {
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(registerSchema),
    })

    const onSubmit = formData => {
        signUp(formData).then(response => {
            console.log(response);
            const { code, error, data } = response;
            if (code != '200') {
                toast.error(error);
            } else {
                toast.success('Registration successful!');
                onClose();
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
                        <ModalHeader className="flex flex-col gap-1 text-[#00a69c]">Sign Up</ModalHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    endContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                                        </svg>
                                    }
                                    label="Email"
                                    variant="bordered"
                                    className="text-black"
                                    {...register('email')}
                                    isInvalid={errors.email?.message}
                                    errorMessage={errors.email?.message}
                                    isRequired
                                />
                                <Input
                                    endContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    label="Phone No"
                                    variant="bordered"
                                    className="text-black"
                                    {...register('phone_number')}
                                    isInvalid={errors.phone_number?.message}
                                    errorMessage={errors.phone_number?.message}
                                    isRequired
                                />
                                <Input
                                    endContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    label="Password"
                                    type="password"
                                    variant="bordered"
                                    className="text-black"
                                    {...register('password')}
                                    isInvalid={errors.password?.message}
                                    errorMessage={errors.password?.message}
                                    isRequired
                                />
                                <Input
                                    endContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    label="Confirm Password"
                                    type="password"
                                    variant="bordered"
                                    className="text-black"
                                    {...register('confirm_password')}
                                    isInvalid={errors.confirm_password?.message}
                                    errorMessage={errors.confirm_password?.message}
                                    isRequired
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" className="bg-[#00a69c] text-white font-bold">
                                    Sign Up
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

const updatePasswordSchema = yup.object({
    old_password: yup.string().required('Old password is required'),
    new_password: yup.string().required('New password is required').min(8, "Password should contain atleast 8 characters"),
    confirm_password: yup.string().required().oneOf([yup.ref('new_password'), null], 'New & Confirm Passwords must match'),
})

export const UpdatePasswordModal = ({ isOpen, onOpenChange, onClose }) => {
    const { data: session } = useSession();
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(updatePasswordSchema),
    })

    const onSubmit = formData => {
        updatePassword(formData, session?.user?.email).then(response => {
            console.log(response);
            const { code, error, data } = response;
            if (code != '200') {
                toast.error(error);
            } else {
                toast.success('Password updated successfully, please login again!!');
                onClose();
                signOut();
            }
        }).catch(err => {
            console.log('err', err);
        })
    }
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            placement="center"
            size="sm"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-[#00a69c]">Update Password</ModalHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalBody>
                                <Input
                                    endContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    autoFocus
                                    label="Old Password"
                                    type="password"
                                    variant="bordered"
                                    className="text-black"
                                    {...register('old_password')}
                                    isInvalid={errors.old_password?.message}
                                    errorMessage={errors.old_password?.message}
                                    isRequired
                                />
                                <Input
                                    endContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    label="New Password"
                                    type="password"
                                    variant="bordered"
                                    className="text-black"
                                    {...register('new_password')}
                                    isInvalid={errors.new_password?.message}
                                    errorMessage={errors.new_password?.message}
                                    isRequired
                                />
                                <Input
                                    endContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    label="Confirm Password"
                                    type="password"
                                    variant="bordered"
                                    className="text-black"
                                    {...register('confirm_password')}
                                    isInvalid={errors.confirm_password?.message}
                                    errorMessage={errors.confirm_password?.message}
                                    isRequired
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" className="bg-[#00a69c] text-white font-bold">
                                    Update Password
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}