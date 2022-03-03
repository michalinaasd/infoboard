import React, { useState } from 'react';
import { gql, useSubscription } from '@apollo/client';
import { Flex } from '@chakra-ui/core';
import CalendarCard from './CalendarCard';
import Pagination from '../Pagination';
import { EVENTS_PER_PAGE, EVENTS_UPDATE_INTERVAL } from '../admin/constants';
import PageIndicator from '../PageIndicator';

const EVENTS = gql`
  subscription GET_EVENTS {
    events(where: { published: { _eq: true } }, order_by: { created_at: asc }) {
      content
      created_at
      title
      time
      id
      date
      published
    }
  }
`;
const Calendar = () => {
  const { loading, error, data } = useSubscription(EVENTS);
  const [pageNr, setPageNr] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }

  return (
    <Flex direction="row" h="20%" pt="0.5rem">
      <Pagination
        pageSize={EVENTS_PER_PAGE}
        intervalMs={EVENTS_UPDATE_INTERVAL}
        pageNr={pageNr}
        onPageChange={(pageNr, pageCount) => {
          setPageNr(pageNr);
          setPageCount(pageCount);
        }}
      >
        {data.events.map(
          ({ id, title, content, date, time, published }, index) => {
            return (
              <CalendarCard
                key={id}
                title={title}
                content={content}
                time={time}
                date={date}
                mr={index === data.events.length - 1 ? 0 : 2}
              />
            );
          }
        )}
      </Pagination>
      <PageIndicator page={pageNr} length={pageCount} direction="column" />
    </Flex>
  );
};

export default Calendar;
