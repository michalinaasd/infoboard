import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  Textarea,
  Input,
  Stack,
  Checkbox,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import FormSubmitButton from '../FormSubmitButton';
import {
  MAX_INFO_TITLE_LENGTH,
  MAX_INFO_CONTENT_LENGTH,
  MAX_FILE_SIZE_BYTES,
  MIN_INFO_CONTENT_LENGTH,
  MIN_INFO_TITLE_LENGTH,
} from '../constants';
import AddButton from '../AddButton';

const ADD_INFO = gql`
  mutation ADD_INFO(
    $title: String
    $content: String
    $img: String!
    $img_only_mode: Boolean!
    $published: Boolean!
  ) {
    insert_infos(
      objects: {
        title: $title
        content: $content
        img: $img
        img_only_mode: $img_only_mode
        published: $published
      }
    ) {
      affected_rows
    }
  }
`;

const AddInfo = ({ amount, maxAmount }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [baseImage, setBaseImage] = useState('');
  const [addInfo] = useMutation(ADD_INFO);

  const [imgOnlyMode, setImgOnlyMode] = useState(false);

  const [postOption, setPostOption] = useState('');
  useEffect(() => {
    setPostOption(amount >= maxAmount ? 'Save' : 'Post');
  }, [maxAmount, amount]);

  const btnRef = React.useRef();
  const { register, errors, handleSubmit } = useForm();

  const checkFileSize = (e) => {
    const size = e[0].size;
    return size;
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertBase64(file);
      setBaseImage(base64);
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onSubmit = (data) => {
    addInfo({
      variables: {
        img: baseImage,
        title: data.title,
        content: data.imageOnlyModeCheckbox ? null : data.content,
        img_only_mode: imgOnlyMode,
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
              <Checkbox
                name="imageOnlyModeCheckbox"
                ref={register}
                defaultIsChecked={imgOnlyMode}
                onChange={() => {
                  setImgOnlyMode(!imgOnlyMode);
                }}
              >
                "Image only" mode
              </Checkbox>
              <Stack spacing={1}>
                <FormControl isInvalid={errors.title?.message}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    placeholder="title"
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
                {!imgOnlyMode && (
                  <FormControl isInvalid={errors.content?.message}>
                    <FormLabel>Content</FormLabel>
                    <Textarea
                      h="25rem"
                      name="content"
                      placeholder="content"
                      ref={register({
                        required: {
                          value: !imgOnlyMode,
                          message: 'Content is required',
                        },
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
                    <FormErrorMessage>
                      {errors.content?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
                <FormControl isInvalid={errors.file?.message}>
                  <FormLabel>Upload file</FormLabel>
                  <Input
                    type="file"
                    name="file"
                    onChange={(e) => {
                      uploadImage(e);
                    }}
                    ref={register({
                      required: 'File is required',
                      validate: {
                        filesize: (value) =>
                          checkFileSize(value) <= MAX_FILE_SIZE_BYTES ||
                          'File is too big. Max 2Mb',
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.file?.message}</FormErrorMessage>
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

export default AddInfo;
