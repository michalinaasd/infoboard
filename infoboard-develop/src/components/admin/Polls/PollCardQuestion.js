import { Text } from '@chakra-ui/core';
import React from 'react';

const PollCardQuestion = ({ question }) => {
  return (
    <Text fontSize="1.3rem" fontWeight="600" lineHeight="1.5rem">
      {question}
    </Text>
  );
};

export default PollCardQuestion;
