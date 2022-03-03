import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/core';
import { gql, useSubscription } from '@apollo/client';
import { InfoCard, InfoCardImageOnly } from './InfoCard';
import Pagination from '../Pagination';
import { INFOS_PER_PAGE, INFOS_UPDATE_INTERVAL } from '../admin/constants';
import PageIndicator from '../PageIndicator';
import PollResults from '../Poll/PollResults';

const INFOS = gql`
  subscription INFOS_SUBSCRIPTION {
    infos(where: { published: { _eq: true } }, order_by: { created_at: asc }) {
      id
      img
      published
      title
      created_at
      content
      img_only_mode
    }
  }
`;

const POLL = gql`
  subscription POLL {
    polls(where: { published: { _eq: true } }) {
      question
      pollOptions {
        id
        option
        votes
      }
    }
  }
`;

const Infos = ({ isAlert }) => {
  const { loading, error, data } = useSubscription(INFOS);
  const {
    loading: pollLoading,
    error: pollError,
    data: pollData,
  } = useSubscription(POLL);
  const [pageNr, setPageNr] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isPoll, setIsPoll] = useState(false);

  useEffect(() => {
    if (pollData) {
      setIsPoll(pollData.polls.length);
    } else {
      setIsPoll(false);
    }
  }, [pollData]);

  if (loading || pollLoading) return <p>Loading...</p>;
  if (error || pollError) {
    console.log(error || pollError);
    return <p>Error</p>;
  }

  return (
    <Box bg="gray.100" w="100%" h="80%" position="relative" overflow="hidden">
      <Pagination
        pageSize={INFOS_PER_PAGE}
        intervalMs={INFOS_UPDATE_INTERVAL}
        pageNr={pageNr}
        onPageChange={(pageNr, pageCount) => {
          setPageNr(pageNr);
          setPageCount(pageCount);
        }}
      >
        {data.infos.map(({ id, img_only_mode, img, title, content }) =>
          img_only_mode ? (
            <InfoCardImageOnly img={img} key={id} isAlert={isAlert} />
          ) : (
            <InfoCard key={id} img={img} title={title} content={content} />
          )
        )}
        {isPoll && (
          <PollResults
            question={pollData.polls[0].question}
            pollOptions={pollData.polls[0].pollOptions}
          />
        )}
      </Pagination>
      <Box position="absolute" top="97%" left="48%">
        <PageIndicator page={pageNr} length={pageCount} direction="row" />
      </Box>
    </Box>
  );
};

export default Infos;
