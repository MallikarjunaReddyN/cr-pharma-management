"use client"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { signUp, updatePassword } from "@/actions/AuthActions";
import { signIn, signOut } from "next-auth/react";
import { toast } from 'sonner';
import { useSession } from "next-auth/react";
import { useState } from "react";

const loginSchema = yup.object({
    email: yup.string().required('Email is required').email("Invalid email address"),
    password: yup.string().required('Password is required')
})
export const LoginModal = ({ isOpen, onOpenChange, onClose }) => {
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(loginSchema),
    });
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit = async (formData) => {
        setIsLoading(true);
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
                setIsLoading(false);
                return;
            }
            onClose();
            window.location.replace("/");
        } catch (err) {
            setIsLoading(false);
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
                                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                            {isVisible ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                                </svg>

                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                                </svg>

                                            )}
                                        </button>
                                    }
                                    label="Password"
                                    type={isVisible ? "text" : "password"}
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
                                <Button type="submit" className="bg-[#00a69c] text-white font-bold" isLoading={isLoading}>
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
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit = formData => {
        setIsLoading(true);
        signUp(formData).then(response => {
            console.log(response);
            const { code, error, data } = response;
            if (code != '200') {
                toast.error(error);
                setIsLoading(false);
            } else {
                toast.success('Registration successful!');
                onClose();
                setIsLoading(false);
            }
        }).catch(err => {
            setIsLoading(false);
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
                                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                            {isVisible ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                                </svg>

                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                                </svg>

                                            )}
                                        </button>
                                    }
                                    label="Password"
                                    type={isVisible ? "text" : "password"}
                                    variant="bordered"
                                    className="text-black"
                                    {...register('password')}
                                    isInvalid={errors.password?.message}
                                    errorMessage={errors.password?.message}
                                    isRequired
                                />
                                <Input
                                    endContent={
                                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                            {isVisible ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                                </svg>

                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                                </svg>

                                            )}
                                        </button>
                                    }
                                    label="Confirm Password"
                                    type={isVisible ? "text" : "password"}
                                    variant="bordered"
                                    className="text-black"
                                    {...register('confirm_password')}
                                    isInvalid={errors.confirm_password?.message}
                                    errorMessage={errors.confirm_password?.message}
                                    isRequired
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" className="bg-[#00a69c] text-white font-bold" isLoading={isLoading}>
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