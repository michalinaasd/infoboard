import React from 'react';
import { useForm } from 'react-hook-form';
import { gql, useQuery } from '@apollo/client';
import { Button, RadioGroup, Radio, Text } from '@chakra-ui/core';

const CHECK_PARTICIPANT = gql`
  query CHECK_PARTICIPANT($id: uuid!, $pollID: uuid!) {
    pollParticipants(
      where: { _and: { id: { _eq: $id }, pollID: { _eq: $pollID } } }
    ) {
      id
    }
  }
`;

const PollForm = ({ pollID, participantID, pollOptions, onSubmit }) => {
  const { loading, error, data } = useQuery(CHECK_PARTICIPANT, {
    variables: {
      id: participantID,
      pollID: pollID,
    },
  });
  const { register, handleSubmit } = useForm();

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }

  if (data.pollParticipants.length) {
    return (
      <Text pt={5} fontSize="1.2rem">
        Your response has been recorded
      </Text>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RadioGroup name="optionId" p={8} pl={0} size="lg">
        {pollOptions.map((option, index) => (
          <Radio ref={register} key={option.id} value={option.id}>
            {option.option}
          </Radio>
        ))}
      </RadioGroup>
      <Button w="5rem" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default PollForm;
