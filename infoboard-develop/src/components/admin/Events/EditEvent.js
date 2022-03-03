import React from 'react';
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
  Input,
  Textarea,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Button,
} from '@chakra-ui/core';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  MAX_EVENT_TITLE_LENGTH,
  MAX_EVENT_CONTENT_LENGTH,
  MIN_EVENT_TITLE_LENGTH,
  MIN_EVENT_CONTENT_LENGTH,
} from '../constants';

const UPDATE_EVENTS_BY_PK = gql`
  mutation UPDATE_EVENTS_BY_PK(
    $id: uuid!
    $title: String!
    $date: date!
    $content: String!
    $time: time!
  ) {
    update_events_by_pk(
      pk_columns: { id: $id }
      _set: { content: $content, date: $date, time: $time, title: $title }
    ) {
      id
    }
  }
`;

const EVENTS = gql`
  query GET_EVENTS_BY_PK($id: uuid!) {
    events_by_pk(id: $id) {
      title
      time
      date
      content
    }
  }
`;

const EditEvent = ({ id, isOpen, onClose, onOpen, btnRef }) => {
  const { register, errors, handleSubmit } = useForm();
  const [updateEvent] = useMutation(UPDATE_EVENTS_BY_PK);
  const { loading, error, data } = useQuery(EVENTS, {
    variables: { id: id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }

  const onSubmit = (data) => {
    updateEvent({
      variables: {
        title: data.title,
        content: data.content,
        date: data.date,
        time: data.time,
        id: id,
      },
    });
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
          <DrawerHeader>Edit</DrawerHeader>

          <DrawerBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={1}>
                <FormControl isInvalid={errors.title?.message}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    defaultValue={data.events_by_pk.title}
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
                    defaultValue={data.events_by_pk.content}
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
                    defaultValue={data.events_by_pk.date}
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
                    defaultValue={data.events_by_pk.time}
                    ref={register({
                      required: 'Time is required.',
                    })}
                  />
                  <FormErrorMessage>{errors.time?.message}</FormErrorMessage>
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

export default EditEvent;
