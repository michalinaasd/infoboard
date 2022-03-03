import React from 'react';
import { Flex, Text } from '@chakra-ui/core';
import PollResultsOption from './PollResultsOption';

const PollResults = ({ question, pollOptions }) => {
  const getVotesAmount = () => {
    let votesAmount = 0;
    pollOptions.map(({ votes }) => (votesAmount += votes));
    return votesAmount;
  };

  return (
    <Flex
      w="100%"
      h="100%"
      borderRadius={10}
      borderWidth={1}
      shadow="md"
      bg="white"
      direction="column"
      p={10}
    >
      <Text fontSize="3rem" fontWeight="bold" pb={1}>
        {question}
      </Text>
      <Flex direction="column" m="auto 0" h="100%" justify="center" p={10}>
        {pollOptions.map(({ id, option, votes }) => (
          <PollResultsOption
            key={id}
            option={option}
            votes={votes}
            votesAmount={getVotesAmount()}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default PollResults;
