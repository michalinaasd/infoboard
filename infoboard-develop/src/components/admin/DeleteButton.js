import React from 'react';
import {
  Button,
  useDisclosure,
  ModalContent,
  ModalBody,
  Modal,
  ModalFooter,
  ModalOverlay,
  ModalHeader,
  Text,
} from '@chakra-ui/core';

const DeleteButton = ({ title, type, onDelete, w }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button w={w} onClick={onOpen}>
        Delete
      </Button>
      <Modal size="xl" isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete {type} </ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete {title}?</Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button variantColor="red" mr={3} onClick={onDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteButton;
