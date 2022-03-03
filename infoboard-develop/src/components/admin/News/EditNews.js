import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
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
  Input,
  Textarea,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/core';
import {
  MAX_NEWS_TITLE_LENGTH,
  MIN_NEWS_TITLE_LENGTH,
  MIN_NEWS_CONTENT_LENGTH,
  MAX_NEWS_CONTENT_LENGTH,
} from '../constants';
const UPDATE_NEWS_BY_PK = gql`
  mutation UPDATE_NEWS_BY_PK($content: String!, $title: String!, $id: uuid!) {
    update_news_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title, content: $content }
    ) {
      id
    }
  }
`;
const NEWS = gql`
  query GET_NEWS_BY_PK($id: uuid!) {
    news_by_pk(id: $id) {
      title
      content
    }
  }
`;

const EditNews = ({ id, isOpen, onClose, onOpen, btnRef }) => {
  const { register, errors, handleSubmit } = useForm();
  const [updateNews] = useMutation(UPDATE_NEWS_BY_PK);
  const { loading, error, data } = useQuery(NEWS, {
    variables: { id: id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }
  const onSubmit = (data) => {
    updateNews({
      variables: { title: data.title, content: data.content, id: id },
    });
    onClose();
  };

  return (
    <>
      <Drawer
        onOpen={() => {
          console.log('open');
        }}
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
                <FormControl isInvalid={errors.title?.message}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    defaultValue={data.news_by_pk.title}
                    ref={register({
                      required: 'Title is required.',
                      maxLength: {
                        value: MAX_NEWS_TITLE_LENGTH,
                        message: `Title is too long (maximum ${MAX_NEWS_TITLE_LENGTH} characters)`,
                      },
                      minLength: {
                        value: MIN_NEWS_TITLE_LENGTH,
                        message: `Title is too short (minimum ${MIN_NEWS_TITLE_LENGTH} characters)`,
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.content?.message}>
                  <FormLabel>Content</FormLabel>
                  <Textarea
                    name="content"
                    defaultValue={data.news_by_pk.content}
                    ref={register({
                      required: 'Content is required.',
                      maxLength: {
                        value: MAX_NEWS_CONTENT_LENGTH,
                        message: `Content is too long (maximum ${MAX_NEWS_CONTENT_LENGTH} characters)`,
                      },
                      minLength: {
                        value: MIN_NEWS_CONTENT_LENGTH,
                        message: `Content is too short (minimum ${MIN_NEWS_CONTENT_LENGTH} characters)`,
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

export default EditNews;
