import React, { useEffect, useState } from 'react';
import {
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Stack,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
} from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import AddButton from '../AddButton';
import { gql, useMutation } from '@apollo/client';
import {
  MAX_OPTIONS,
  MAX_POLL_QUESTION_LENGTH,
  MIN_POLL_QUESTION_LENGTH,
} from '../constants';

const ADD_POLL_OPTIONS = gql`
  mutation ADD_POLL_OPTIONS($objects: [pollOptions_insert_input!]!) {
    insert_pollOptions(objects: $objects) {
      affected_rows
    }
  }
`;

const ADD_POLL = gql`
  mutation ADD_POLL($question: String!) {
    insert_polls_one(object: { question: $question }) {
      id
    }
  }
`;

const AddPoll = () => {
  const [addPoll, { data: addPollData }] = useMutation(ADD_POLL);
  const [addPollOptions] = useMutation(ADD_POLL_OPTIONS);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const { register, errors, handleSubmit } = useForm();

  const [inputList, setInputList] = useState([{ option: '' }]);

  useEffect(() => {
    if (addPollData) {
      let list = [];
      inputList.map((elem) =>
        list.push({
          option: elem.option,
          pollID: addPollData.insert_polls_one.id,
        })
      );
      addPollOptions({
        variables: {
          objects: list,
        },
      });
      setInputList([{ option: '' }]);
    }
  }, [addPollData]);

  const handleInput = (e, index) => {
    const { value } = e.target;
    const list = [...inputList];
    list[index]['option'] = value;
    setInputList(list);
  };

  const onSubmit = (data) => {
    addPoll({ variables: { question: data.question } });
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
                <FormControl isInvalid={errors.question?.message}>
                  <FormLabel>Question</FormLabel>
                  <Input
                    name="question"
                    ref={register({
                      required: 'This field is required.',
                      maxLength: {
                        value: MAX_POLL_QUESTION_LENGTH,
                        message: `Question is too long (maximum ${MAX_POLL_QUESTION_LENGTH} characters)`,
                      },
                      minLength: {
                        value: MIN_POLL_QUESTION_LENGTH,
                        message: `Question is too short (minimum ${MIN_POLL_QUESTION_LENGTH} characters)`,
                      },
                    })}
                    placeholder="question"
                  />
                  <FormErrorMessage>
                    {errors.question?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormLabel>Options</FormLabel>
                {inputList.map((elem, index) => {
                  return (
                    <Flex key={index} pb={2}>
                      <Input
                        isRequired
                        placeholder={`option ${index + 1}`}
                        value={elem.option}
                        onChange={(e) => handleInput(e, index)}
                      />
                      <Button
                        onClick={() => {
                          const list = [...inputList];
                          list.splice(index, 1);
                          setInputList(list);
                        }}
                      >
                        Remove
                      </Button>
                    </Flex>
                  );
                })}
                {inputList.length < MAX_OPTIONS && (
                  <Button
                    onClick={() => {
                      setInputList([...inputList, { option: '' }]);
                    }}
                  >
                    Add
                  </Button>
                )}

                <Button type="submit">Submit</Button>
              </Stack>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AddPoll;
