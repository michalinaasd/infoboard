import React, { useEffect } from 'react';
import { Flex, StatGroup, Text, Box } from '@chakra-ui/core';
import { PostsCounter, PublishedPostsCounter, PostsStats } from './Counters';
import WelcomeMessage from './WelcomeMessage';
import { BsPerson } from 'react-icons/bs';

const Dashboard = ({ setFocusElement }) => {
  useEffect(() => {
    setFocusElement('Home');
  }, [setFocusElement]);

  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 7);

  const getMonday = (date) => {
    var day = date.getDay();
    var diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  };

  return (
    <Flex direction="column" align="left" h="100vh">
      <Flex
        direction="column"
        w="88%"
        h="100%"
        m="auto"
        pt="10"
        position="relative"
      >
        <Box
          h="6rem"
          w="6rem"
          as={BsPerson}
          position="absolute"
          bottom="80%"
          left="81%"
          color="blue.300"
        />
        <Box
          h="6rem"
          w="6rem"
          as={BsPerson}
          position="absolute"
          bottom="82.5%"
          left="85%"
          color="gray.500"
        />
        <Box
          h="6rem"
          w="6rem"
          as={BsPerson}
          position="absolute"
          bottom="80%"
          left="89%"
          color="blue.500"
        />
        <Text fontSize="2.5rem" mb={2}>
          Dashboard
        </Text>
        <WelcomeMessage h="10%" w="100%" />

        <Flex w="100%" h="60%" mt={4}>
          <Flex
            direction="column"
            h="100%"
            w="80%"
            pr={3}
            justify="space-between"
          >
            <PostsCounter />
            <PostsStats
              startDate={getMonday(pastDate)}
              endDate={getMonday(today)}
            />
          </Flex>
          <PublishedPostsCounter />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
