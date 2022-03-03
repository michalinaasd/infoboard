import React from 'react';
import Calendar from './Calendar/Calendar';
import Infos from './Infos/Infos';
import { Flex, Divider } from '@chakra-ui/core';
import NewsFeed from './News/NewsFeed';
import EmergencyBar from './EmergencyBar';
import { gql, useSubscription } from '@apollo/client';
import { NEWS_PER_PAGE } from './admin/constants';

const EMERGENCY_INFOS = gql`
  subscription EMERGENCY_INFOS {
    emergencyInfos(where: { published: { _eq: true } }) {
      id
      content
      created_at
      published
    }
  }
`;

const Board = () => {
  const { loading, error, data } = useSubscription(EMERGENCY_INFOS);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }

  return (
    <Flex w="100vw" h="100vh" direction="column" bg="gray.100">
      <Flex direction="row" w="100%" h="100%">
        <Flex direction="column" h="100%" w="80%" justify="space-between" p={2}>
          <Infos isAlert={data.emergencyInfos.length > 0} />
          <Calendar />
        </Flex>
        <Divider
          orientation="vertical"
          borderWidth={1}
          borderColor="gray.300"
        />
        <Flex direction="column" w="20%" p={3} pt={1}>
          <NewsFeed postsPerPage={NEWS_PER_PAGE} />
        </Flex>
      </Flex>
      {data.emergencyInfos.length > 0 && <EmergencyBar data={data} />}
    </Flex>
  );
};

export default Board;
