import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
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
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/core';
import FormSubmitButton from '../FormSubmitButton';
import {
  MAX_NEWS_TITLE_LENGTH,
  MIN_NEWS_TITLE_LENGTH,
  MIN_NEWS_CONTENT_LENGTH,
  MAX_NEWS_CONTENT_LENGTH,
} from '../constants';
import AddButton from '../AddButton';

const ADD_NEWS = gql`
  mutation ADD_NEWS($title: String!, $content: String!, $published: Boolean) {
    insert_news(
      objects: { title: $title, content: $content, published: $published }
    ) {
      affected_rows
    }
  }
`;

const AddNews = ({ amount, maxAmount }) => {
  const [addNews] = useMutation(ADD_NEWS);
  const [postOption, setPostOption] = useState('');
  useEffect(() => {
    setPostOption(amount >= maxAmount ? 'Save' : 'Post');
  }, [maxAmount, amount]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const { register, errors, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (postOption === 'Post') {
      addNews({
        variables: {
          title: data.title,
          content: data.content,
          published: true,
        },
      });
    } else {
      addNews({
        variables: {
          title: data.title,
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
                <FormControl isInvalid={errors.title?.message}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    placeholder="title"
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
                    placeholder="content"
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

export default AddNews;
