import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Textarea,
  Image,
  Flex,
  Switch,
  Text,
  useToast,
  FormLabel,
  FormControl,
  FormErrorMessage,
  ButtonGroup,
} from '@chakra-ui/core';
import { gql, useMutation } from '@apollo/client';
import {
  MAX_INFO_TITLE_LENGTH,
  MAX_INFO_CONTENT_LENGTH,
  MIN_INFO_CONTENT_LENGTH,
  MIN_INFO_TITLE_LENGTH,
} from '../constants';

const UPDATE_INFO = gql`
  mutation UPDATE_INFO($content: String, $title: String!, $id: uuid!) {
    update_infos_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title, content: $content }
    ) {
      id
    }
  }
`;

const ModalInfo = ({
  isOpen,
  onOpen,
  onClose,
  id,
  title,
  content,
  img,
  editMode,
  onEdit,
  img_only_mode,
  published,
  onPublish,
  maxAmount,
  amount,
}) => {
  const { register, errors, handleSubmit } = useForm();
  const [updateInfo] = useMutation(UPDATE_INFO);

  const toast = useToast();

  const onSubmit = (data) => {
    if (img_only_mode) {
      updateInfo({
        variables: { title: data.title, id: id },
      });
    } else {
      updateInfo({
        variables: { title: data.title, content: data.content, id: id },
      });
    }
    onClose();
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Image src={img} />
          <ModalHeader>
            {(editMode && (
              <FormControl isInvalid={errors.title?.message}>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  defaultValue={title}
                  ref={register({
                    required: 'Title is required.',
                    maxLength: {
                      value: MAX_INFO_TITLE_LENGTH,
                      message: `Title is too long (maximum ${MAX_INFO_TITLE_LENGTH} characters)`,
                    },
                    minLength: {
                      value: MIN_INFO_TITLE_LENGTH,
                      message: `Title is too short (minimum ${MIN_INFO_TITLE_LENGTH} characters)`,
                    },
                  })}
                />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              </FormControl>
            )) ||
              title}
          </ModalHeader>
          <ModalBody>
            {(!img_only_mode && editMode && (
              <FormControl isInvalid={errors.content?.message}>
                <FormLabel>Content</FormLabel>
                <Textarea
                  h="25rem"
                  name="content"
                  defaultValue={content}
                  ref={register({
                    required: 'Content is required',
                    maxLength: {
                      value: MAX_INFO_CONTENT_LENGTH,
                      message: `Content is too long (maximum ${MAX_INFO_CONTENT_LENGTH} characters)`,
                    },
                    minLength: {
                      value: MIN_INFO_CONTENT_LENGTH,
                      message: `Content is too short (minimum ${MIN_INFO_CONTENT_LENGTH} characters)`,
                    },
                  })}
                />
                <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
              </FormControl>
            )) ||
              content}
          </ModalBody>

          <ModalFooter justifyContent="space-between">
            <Flex direction="row" m="auto 0">
              <Text>Published</Text>
              <Switch
                w="5rem"
                pl="3"
                pr="3"
                size="lg"
                isChecked={published}
                onChange={() => {
                  if (amount === maxAmount && !published) {
                    toast({
                      title: 'An error occured',
                      description: `You cannot publish more than ${maxAmount} posts`,
                      status: 'error',
                      isClosable: true,
                    });
                  } else {
                    onPublish(id, !published);
                  }
                }}
              />
            </Flex>
            <ButtonGroup>
              <Button variantColor="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              {editMode && (
                <Button variant="ghost" type="submit">
                  Submit
                </Button>
              )}
              {!editMode && (
                <Button variant="ghost" onClick={onEdit}>
                  Edit
                </Button>
              )}
            </ButtonGroup>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ModalInfo;
