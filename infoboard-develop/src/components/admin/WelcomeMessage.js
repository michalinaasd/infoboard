import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/core';

const WelcomeMessage = ({ h, w }) => {
  return (
    <>
      <Flex
        h={h}
        w={w}
        shadow="md"
        rounded={10}
        bg="gray.100"
        borderWidth={1}
        fontSize="1.5rem"
        p={3}
      >
        <Flex direction="column">
          <Text fontWeight="600">Welcome!</Text>
          <Text>
            Get familiar with the dashboard! In order to start creating content,
            open the side menu and choose category.
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

export default WelcomeMessage;
