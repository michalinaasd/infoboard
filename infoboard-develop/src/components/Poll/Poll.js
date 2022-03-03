import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Flex, Text } from '@chakra-ui/core';
import { useQuery, gql, useMutation } from '@apollo/client';
import PollSubmit from './PollSubmit';
import PollForm from './PollForm';
import PollResults from './PollResults';

const POLL = gql`
  query POLL_RESULTS($_eq: Boolean!) {
    polls(
      limit: 1
      order_by: { created_at: asc }
      where: { published: { _eq: $_eq } }
    ) {
      id
      question
      pollOptions(order_by: { option: asc }) {
        id
        option
        votes
      }
    }
  }
`;

const VOTE = gql`
  mutation MyMutation($_eq: uuid!) {
    update_pollOptions(where: { id: { _eq: $_eq } }, _inc: { votes: 1 }) {
      affected_rows
    }
  }
`;

const ADD_PARTICIPANT = gql`
  mutation ADD_PARTICIPANT($id: uuid!, $pollID: uuid!) {
    insert_pollParticipants_one(object: { id: $id, pollID: $pollID }) {
      id
    }
  }
`;

const Poll = () => {
  const { loading, error, data } = useQuery(POLL, { variables: { _eq: true } });
  const {
    loading: resultsLoading,
    error: resultsError,
    data: resultsData,
  } = useQuery(POLL, { variables: { _eq: false } });
  const [vote] = useMutation(VOTE);
  const [addParticipant] = useMutation(ADD_PARTICIPANT);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [participantID, setParticipantID] = useState(uuidv4());
  const [pollID, setPollID] = useState('');

  useEffect(() => {
    if (data && data.polls.length > 0) {
      setPollID(data.polls[0].id);
      if (!localStorage.getItem('participant')) {
        localStorage.setItem('participant', participantID);
      } else {
        setParticipantID(localStorage.getItem('participant'));
      }
    }
  }, [data]);
  if (loading || resultsLoading) return <p>Loading...</p>;
  if (error || resultsError) {
    console.log(error || resultsError);
    return <p>Error</p>;
  }

  return (
    <Flex h="100vh" w="100vw" p={6}>
      <Flex
        direction="column"
        shadow="md"
        w="60%"
        h="95%"
        m="0 auto"
        borderRadius={10}
        borderWidth={1}
        borderTopWidth={14}
        borderTopColor="blue.300"
      >
        {data.polls.length > 0 ? (
          <Flex direction="column" p={8}>
            <Text fontSize="3rem">{data.polls[0].question}</Text>
            {isSubmitted ? (
              <PollSubmit />
            ) : (
              <PollForm
                pollID={pollID}
                participantID={participantID}
                pollOptions={data.polls[0].pollOptions}
                onSubmit={(formData) => {
                  const option = data.polls[0].pollOptions.find(
                    (option) => option.id === formData.optionId
                  );
                  vote({
                    variables: {
                      _eq: formData.optionId,
                    },
                  });
                  addParticipant({
                    variables: { id: participantID, pollID: pollID },
                  });
                  setIsSubmitted(true);
                }}
              />
            )}
          </Flex>
        ) : (
          <Flex direction="column" h="100%" p={8} pb={16} m="auto 0">
            <Text fontSize="2.5rem" mb={10}>
              Last poll results
            </Text>
            <PollResults
              question={resultsData.polls[0].question}
              pollOptions={resultsData.polls[0].pollOptions}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default Poll;
