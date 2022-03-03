import React from 'react';
import { Flex, Box, Text } from '@chakra-ui/core';
import CalendarCardDate from './CalendarCardDate';

const CalendarCard = ({ date, time, title, content, mr }) => {
  return (
    <Flex
      w="20%"
      borderRadius={10}
      shadow="md"
      direction="column"
      borderTopWidth={1}
      bg="white"
      mr={mr}
      lineHeight="1.3rem"
    >
      <Box h="100%" p={3} pb={2}>
        <Text
          fontWeight="700"
          fontSize="1.1rem"
          maxHeight="2.6rem"
          pb={2}
          w="100%"
          overflow="hidden"
        >
          {title}
        </Text>
        <Text maxHeight="5.2rem" overflow="hidden">
          {content}
        </Text>
      </Box>
      <CalendarCardDate date={date} time={time} />
    </Flex>
  );
};

export default CalendarCard;
