import React from 'react';
import { Flex, Box, Text } from '@chakra-ui/core';
import Moment from 'react-moment';
import { FiCalendar, FiClock } from 'react-icons/fi';

const CalendarCardDate = ({ date, time }) => {
  const weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const d = new Date(date);

  return (
    <Flex
      bg="blue.300"
      borderBottomRightRadius={10}
      borderBottomLeftRadius={10}
      borderBottomColor="blue.300"
      borderBottomWidth={3}
      color="white"
      justify="center"
      fontWeight="700"
      p="0.3rem 0"
      textAlign="center"
    >
      <Flex pr={6}>
        <Box as={FiCalendar} />
        <Text pl={2}>{weekday[d.getDay()]},</Text>
        <Text pl={2} textTransform="uppercase">
          <Moment date={date} format="MMM" />
        </Text>
        <Text pl={2}>
          <Moment date={date} format="D" />
        </Text>
      </Flex>
      <Flex>
        <Box as={FiClock} />
        <Text pl={1} pr={2}>
          {time.slice(0, -3)}
        </Text>
      </Flex>
    </Flex>
  );
};

export default CalendarCardDate;
