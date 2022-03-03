import React, { useState, useEffect } from 'react';
import { Flex, Grid, useToast } from '@chakra-ui/core';
import ListHeader from '../ListHeader';
import AddPoll from './AddPoll';
import { gql, useMutation, useSubscription } from '@apollo/client';
import PollCard from './PollCard';
import { MAX_POLL } from '../constants';

const POLL = gql`
  subscription POLL {
    polls(order_by: { created_at: asc }) {
      id
      question
      published
      pollOptions(order_by: { option: asc }) {
        id
        option
        votes
      }
    }
  }
`;

const POST_POLL = gql`
  mutation POST_POLL($id: uuid!, $published: Boolean!) {
    update_polls_by_pk(
      pk_columns: { id: $id }
      _set: { published: $published }
    ) {
      id
    }
  }
`;

const COUNT_PUBLISHED_POLLS = gql`
  subscription COUNT_PUBLISHED_POLLS {
    polls_aggregate(where: { published: { _eq: true } }) {
      aggregate {
        count
      }
    }
  }
`;

const DELETE_POLL_BY_PK = gql`
  mutation DELETE_POLL_BY_PK($id: uuid!) {
    delete_polls_by_pk(id: $id) {
      id
    }
  }
`;

const PollList = () => {
  const { loading, error, data } = useSubscription(POLL);
  const {
    loading: countLoading,
    error: countError,
    data: countData,
  } = useSubscription(COUNT_PUBLISHED_POLLS);
  const [postPoll] = useMutation(POST_POLL);
  const [deletePoll] = useMutation(DELETE_POLL_BY_PK);
  const [amount, setAmount] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (countData) {
      setAmount(countData.polls_aggregate.aggregate.count);
    }
  }, [countData]);

  if (loading || countLoading) return <p>Loading...</p>;
  if (error || countError) {
    console.log(error || countError);
    return <p>Error</p>;
  }

  return (
    <Flex direction="column" w="88%" m="auto" pt="10">
      <ListHeader title="Polls" max={MAX_POLL} amount={amount}>
        <AddPoll />
      </ListHeader>
      <Grid
        templateColumns="repeat(auto-fit, 32.3rem)"
        gap="3.7rem"
        w="100%"
        mt="20px"
      >
        {data.polls.map(({ id, question, pollOptions, published }) => (
          <PollCard
            key={id}
            question={question}
            pollOptions={pollOptions}
            published={published}
            onPost={() => {
              if (amount === MAX_POLL && !published) {
                toast({
                  title: 'An error occured',
                  description: `You cannot publish more than ${MAX_POLL} poll`,
                  status: 'error',
                  isClosable: true,
                });
              } else {
                postPoll({ variables: { id: id, published: !published } });
              }
            }}
            onDelete={() => {
              deletePoll({ variables: { id: id } });
            }}
          />
        ))}
      </Grid>
    </Flex>
  );
};

export default PollList;
