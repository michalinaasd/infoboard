import React from 'react';
import { Flex, Progress, Text } from '@chakra-ui/core';

const PollResultsOption = ({ option, votes, votesAmount }) => {
  return (
    <Flex
      fontSize="2rem"
      h="25%"
      lineHeight="2rem"
      direction="column"
      m="1.2rem 0"
    >
      <Flex pb={2}>
        <Text m="auto 0" w="88%">
          {option}
        </Text>
        <Text textAlign="right" w="10%">
          {votes}
        </Text>
      </Flex>
      <Progress
        color="blue"
        h="100%"
        value={votesAmount ? (votes / votesAmount) * 100 : 0}
        w="100%"
        hasStripe
        isAnimated
      />
    </Flex>
  );
};

export default PollResultsOption;
