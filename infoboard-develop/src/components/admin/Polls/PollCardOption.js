import { Flex, Progress, Text } from '@chakra-ui/core';
import React from 'react';

const PollCardOption = ({ option, votes, votesAmount }) => {
  return (
    <Flex direction="column" h="25%" pt={2}>
      <Flex>
        <Text m="auto 0" w="88%">
          {option}
        </Text>
        <Text textAlign="right" w="10%">
          {votes}
        </Text>
      </Flex>
      <Progress
        color="blue"
        h="50%"
        value={votesAmount ? (votes / votesAmount) * 100 : 0}
      />
    </Flex>
  );
};

export default PollCardOption;
