import { Flex, Text } from '@chakra-ui/core';
import React from 'react';

const ListHeader = ({ children, title, max, amount }) => {
  return (
    <Flex direction="column" pb={3}>
      <Text fontSize="2.5rem">{title}</Text>
      <Flex direction="row" justify="space-between">
        {children}
        <Text alignSelf="flex-end">{`Published: ${amount}/${max}`}</Text>
      </Flex>
    </Flex>
  );
};

export default ListHeader;
