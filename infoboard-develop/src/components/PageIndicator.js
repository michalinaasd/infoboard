import React from 'react';
import { Box, Flex } from '@chakra-ui/core';

const PageIndicator = ({ page, length, direction }) => (
  <Flex direction={direction} justify="center">
    {length > 1 &&
      [...Array(length).keys()].map((key, idx) => (
        <Box
          key={key}
          h=".5rem"
          w=".5rem"
          bg={(page === key && 'blue.300') || 'gray.300'}
          rounded="50%"
          m={1}
        />
      ))}
  </Flex>
);

export default PageIndicator;
