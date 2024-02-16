import { Button, Card, CardBody, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, useDisclosure } from '@nextui-org/react'
import React from 'react'
import { UpdatePasswordModal } from './AuthModals';
import Users from '@/app/admin/users';
import AllowedUsers from '@/app/admin/allowed-users';

export const AdminSettings = ({ isOpen, onOpenChange, onClose }) => {
  const { isOpen: updatePasswordIsOpen, onOpen: updatePasswordOnOpen, onOpenChange: updatePasswordOnOpenChange, onClose: updatePasswordOnClose } = useDisclosure();
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="center"
        size="full"
        classNames={{
          body: ""
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Admin Settings</ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-col">
                  <Tabs aria-label="Options" size='sm' color="primary"
                    classNames={{
                      cursor: "bg-[#00a69c]",
                    }}
                  >
                    <Tab key="users" title="Users">
                      <Users />
                    </Tab>
                    <Tab key="allowedusers" title="Allowed Users">
                      <AllowedUsers />
                    </Tab>
                  </Tabs>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button size='sm' color='danger' variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <UpdatePasswordModal isOpen={updatePasswordIsOpen} onOpenChange={updatePasswordOnOpenChange} onClose={updatePasswordOnClose} />
    </>
  );
}