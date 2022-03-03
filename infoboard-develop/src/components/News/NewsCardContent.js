import React from 'react';
import { Text } from '@chakra-ui/core';

const NewsCardContent = ({ content }) => {
  return (
    <Text fontSize="1rem" height="6rem" overflow="hidden">
      {content}
    </Text>
  );
};

export default NewsCardContent;
