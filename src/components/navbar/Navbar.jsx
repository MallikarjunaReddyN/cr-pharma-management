"use client"

import React from 'react'
import { Navbar as Nav, NavbarBrand, NavbarContent, Button, Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem, useDisclosure } from "@nextui-org/react";
import CrLogo from '../logos/CrLogo';
import { LoginModal, SignUpModal, UpdatePasswordModal } from '../modal/AuthModals';
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: signUpIsOpen, onOpen: signUpOnOpen, onOpenChange: signUpOnOpenChange, onClose: signOnClose } = useDisclosure();
  const { isOpen: updatePasswordIsOpen, onOpen: updatePasswordOnOpen, onOpenChange: updatePasswordOnOpenChange, onClose: updatePasswordOnClose } = useDisclosure();

  return (
    <>
      <Nav isBordered isBlurred={false} maxWidth='full'>
        <NavbarContent>
          <NavbarBrand>
            <CrLogo />
            <p className="font-bold text-[#00a69c] text-2xl">CR Pharmacy</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="end">
          {session?.user ? <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                showFallback
                isBordered
                as="button"
                className="transition-transform"
                color="warning"
                name={session?.user?.email?.substring(0,2).toUpperCase()}
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{session?.user?.email}</p>
              </DropdownItem>
              <DropdownItem key="settings" onClick={updatePasswordOnOpen} >Update Password</DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown> : <>
            <Button className="bg-[#00a69c] text-white font-bold" href="#" variant="flat"
              onPress={onOpen}
            >
              Login
            </Button>
            <Button href="#" variant="bordered" className='border-2 border-[#00a69c]' onPress={signUpOnOpen}>
              Sign Up
            </Button> </>
          }
        </NavbarContent>
      </Nav>
      <LoginModal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
      <SignUpModal isOpen={signUpIsOpen} onOpenChange={signUpOnOpenChange} onClose={signOnClose} />
      <UpdatePasswordModal isOpen={updatePasswordIsOpen} onOpenChange={updatePasswordOnOpenChange} onClose={updatePasswordOnClose} />
    </>
  )
}
