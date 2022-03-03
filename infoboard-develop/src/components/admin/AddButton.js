import React from 'react';
import { Button } from '@chakra-ui/core';

const AddButton = ({ btnRef, onOpen }) => {
  return (
    <Button ref={btnRef} onClick={onOpen} w="10rem">
      Add
    </Button>
  );
};

export default AddButton;
