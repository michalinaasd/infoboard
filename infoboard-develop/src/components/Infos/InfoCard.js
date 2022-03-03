import React from 'react';
import { Box, Image, Heading, Text, Flex } from '@chakra-ui/core';

export const InfoCard = ({ img, title, content, height }) => {
  return (
    <Flex
      h="100%"
      w="100%"
      bg="white"
      direction="row"
      shadow="md"
      borderRadius="10px"
    >
      <Box w="70%" h="100%" m="auto">
        <Image
          h="100%"
          w="100%"
          borderTopLeftRadius={10}
          borderBottomLeftRadius={10}
          objectFit="cover"
          src={img}
        />
      </Box>
      <Box
        p={5}
        w="32%"
        maxHeight="99%"
        bg="white"
        borderBottomRightRadius={10}
        borderTopRightRadius={10}
      >
        <Heading maxHeight="5rem" lineHeight="2.5rem" overflow="hidden" mb={5}>
          {title}
        </Heading>
        <Text
          maxHeight="37.5rem"
          lineHeight="1.5rem"
          overflow="hidden"
          fontSize="lg"
        >
          {content}
        </Text>
      </Box>
    </Flex>
  );
};

export const InfoCardImageOnly = ({ img, isAlert }) => {
  return (
    <Flex h="100%" w="100%" bg="white" shadow="md" borderRadius={10}>
      <Image
        w="100rem"
        h={isAlert ? '47.4rem' : '49.5rem'}
        display="block"
        m="auto"
        src={img}
        objectFit="cover"
        borderRadius={10}
      />
    </Flex>
  );
};
