import React from 'react';
import { Text } from '@chakra-ui/core';

const NewsCardHeader = ({ title }) => {
  return (
    <Text
      fontWeight="700"
      fontSize="1.1rem"
      lineHeight="1.4rem"
      maxHeight="3rem"
      mb={1}
      w="100%"
      overflow="hidden"
    >
      {title}
    </Text>
  );
};

export default NewsCardHeader;
