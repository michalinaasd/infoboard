import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Stack,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/core';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  MAX_EMERGENCY_INFO_CONTENT_LENGTH,
  MIN_EMERGENCY_INFO_CONTENT_LENGTH,
} from '../constants';

const UPDATE_EMERGENCY_INFO = gql`
  mutation UPDATE_EMERGENCY_INFO($id: uuid!, $content: String!) {
    update_emergencyInfos_by_pk(
      pk_columns: { id: $id }
      _set: { content: $content }
    ) {
      id
    }
  }
`;

const EMERGENCY_INFO = gql`
  query GET_EMERGENCY_INFO_BY_PK($id: uuid!) {
    emergencyInfos_by_pk(id: $id) {
      content
    }
  }
`;

const EditEmergencyInfo = ({ isOpen, onClose, onOpen, btnRef, id }) => {
  const { register, errors, handleSubmit } = useForm();

  const [updateEmergencyInfo] = useMutation(UPDATE_EMERGENCY_INFO);
  const { loading, error, data } = useQuery(EMERGENCY_INFO, {
    variables: { id: id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }

  const onSubmit = (data) => {
    updateEmergencyInfo({ variables: { id: id, content: data.content } });
    onClose();
  };

  return (
    <>
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
          <DrawerHeader>Edit </DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={1}>
                <FormControl isInvalid={errors.content?.message}>
                  <FormLabel>Content</FormLabel>
                  <Textarea
                    name="content"
                    defaultValue={data.emergencyInfos_by_pk.content}
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

                <Button type="submit">Submit</Button>
              </Stack>
            </form>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default EditEmergencyInfo;
