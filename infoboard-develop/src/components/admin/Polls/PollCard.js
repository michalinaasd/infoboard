import React from 'react';
import { Flex, Switch, Text } from '@chakra-ui/core';
import PollCardQuestion from './PollCardQuestion';
import PollCardOption from './PollCardOption';
import DeleteButton from '../DeleteButton';
const PollCard = ({ question, pollOptions, published, onDelete, onPost }) => {
  const getVotesAmount = () => {
    let votesAmount = 0;
    pollOptions.map(({ votes }) => (votesAmount += votes));
    return votesAmount;
  };
  return (
    <Flex
      h="28rem"
      w="32rem"
      borderWidth="1px"
      rounded="lg"
      shadow="md"
      direction="column"
      p={3}
    >
      <PollCardQuestion question={question} />

      <Flex direction="column" m="auto 0" h="100%" justify="center" p={3}>
        {pollOptions.map(({ option, votes, id }) => (
          <PollCardOption
            key={id}
            option={option}
            votes={votes}
            votesAmount={getVotesAmount()}
          />
        ))}
      </Flex>
      <Flex justify="space-between">
        <Flex direction="column">
          <Text>Published</Text>
          <Switch m="auto" isChecked={published} onChange={onPost} />
        </Flex>
        <DeleteButton title="poll" type="poll" onDelete={onDelete} />
      </Flex>
    </Flex>
  );
};

export default PollCard;
