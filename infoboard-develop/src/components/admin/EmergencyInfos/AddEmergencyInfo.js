import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Stack,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Textarea,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/core';
import { gql, useMutation } from '@apollo/client';
import FormSubmitButton from '../FormSubmitButton';
import {
  MAX_EMERGENCY_INFO_CONTENT_LENGTH,
  MIN_EMERGENCY_INFO_CONTENT_LENGTH,
} from '../constants';
import AddButton from '../AddButton';

const ADD_EMERGENCY_INFO = gql`
  mutation ADD_EMERGENCY_INFO($content: String!, $published: Boolean!) {
    insert_emergencyInfos(
      objects: { content: $content, published: $published }
    ) {
      affected_rows
    }
  }
`;

const AddEmergencyInfo = ({ maxAmount, amount }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const { register, errors, handleSubmit } = useForm();
  const [addEmergencyInfo] = useMutation(ADD_EMERGENCY_INFO);

  const [postOption, setPostOption] = useState('');
  useEffect(() => {
    setPostOption(amount >= maxAmount ? 'Save' : 'Post');
  }, [maxAmount, amount]);

  const onSubmit = (data) => {
    if (postOption === 'Post') {
      addEmergencyInfo({
        variables: {
          content: data.content,
          published: true,
        },
      });
    } else {
      addEmergencyInfo({
        variables: {
          content: data.content,
          published: false,
        },
      });
    }
    onClose();
  };
  return (
    <>
      <AddButton btnRef={btnRef} onOpen={onOpen} />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add </DrawerHeader>

          <DrawerBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={1}>
                <FormControl isInvalid={errors.content?.message}>
                  <FormLabel>Content</FormLabel>
                  <Textarea
                    name="content"
                    placeholder="content"
                    ref={register({
                      required: 'Content is required',
                      maxLength: {
                        value: MAX_EMERGENCY_INFO_CONTENT_LENGTH,
                        message: `Content is too long (maximum ${MAX_EMERGENCY_INFO_CONTENT_LENGTH} characters)`,
                      },
                      minLength: {
                        value: MIN_EMERGENCY_INFO_CONTENT_LENGTH,
                        message: `Content is too short (minimum ${MIN_EMERGENCY_INFO_CONTENT_LENGTH} characters)`,
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
                </FormControl>

                <FormSubmitButton
                  postOption={postOption}
                  setPostOption={setPostOption}
                  changeDisable={amount >= maxAmount}
                />
              </Stack>
            </form>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AddEmergencyInfo;
