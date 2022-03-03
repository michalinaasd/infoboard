import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Stack,
  Textarea,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/core';
import { gql, useMutation } from '@apollo/client';
import FormSubmitButton from '../FormSubmitButton';
import {
  MAX_EVENT_TITLE_LENGTH,
  MAX_EVENT_CONTENT_LENGTH,
  MIN_EVENT_TITLE_LENGTH,
  MIN_EVENT_CONTENT_LENGTH,
} from '../constants';
import AddButton from '../AddButton';

const ADD_EVENT = gql`
  mutation ADD_EVENT(
    $title: String!
    $date: date!
    $content: String!
    $time: time
    $published: Boolean!
  ) {
    insert_events(
      objects: {
        time: $time
        title: $title
        date: $date
        content: $content
        published: $published
      }
    ) {
      affected_rows
    }
  }
`;

const AddEvent = ({ amount, maxAmount }) => {
  const [addEvent] = useMutation(ADD_EVENT);
  const [postOption, setPostOption] = useState('');
  useEffect(() => {
    setPostOption(amount >= maxAmount ? 'Save' : 'Post');
  }, [maxAmount, amount]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const { register, errors, handleSubmit } = useForm();

  const onSubmit = (data) => {
    addEvent({
      variables: {
        title: data.title,
        time: data.time,
        date: data.date,
        content: data.content,
        published: postOption === 'Post',
      },
    });

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
                <FormControl isInvalid={errors.title?.message}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    placeholder="title"
                    ref={register({
                      required: 'Title is required.',
                      maxLength: {
                        value: MAX_EVENT_TITLE_LENGTH,
                        message: `Title is too long (maximum ${MAX_EVENT_TITLE_LENGTH} characters)`,
                      },
                      minLength: {
                        value: MIN_EVENT_TITLE_LENGTH,
                        message: `Title is too short (minimum ${MIN_EVENT_TITLE_LENGTH} characters)`,
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.content?.message}>
                  <FormLabel>Content</FormLabel>
                  <Textarea
                    name="content"
                    placeholder="content"
                    ref={register({
                      required: 'Content is required.',
                      maxLength: {
                        value: MAX_EVENT_CONTENT_LENGTH,
                        message: `Content is too long (maximum ${MAX_EVENT_CONTENT_LENGTH} characters)`,
                      },
                      minLength: {
                        value: MIN_EVENT_CONTENT_LENGTH,
                        message: `Content is too short (minimum ${MIN_EVENT_CONTENT_LENGTH} characters)`,
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.date?.message}>
                  <FormLabel>Date</FormLabel>
                  <Input
                    name="date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    ref={register({
                      required: 'Date is required.',
                    })}
                  />
                  <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.time?.message}>
                  <FormLabel>Time</FormLabel>
                  <Input
                    name="time"
                    type="time"
                    ref={register({
                      required: 'Time is required.',
                    })}
                  />
                  <FormErrorMessage>{errors.time?.message}</FormErrorMessage>
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

export default AddEvent;
