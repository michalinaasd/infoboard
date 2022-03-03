import React from 'react';
import { Flex, Text } from '@chakra-ui/core';
import Moment from 'react-moment';
const NewsCardDate = ({ date }) => {
  return (
    <Flex
      position="relative"
      zIndex="10"
      left="83%"
      w="17%"
      top="2"
      bg="blue.300"
      rounded="full"
      borderBottomRightRadius={0}
      color="white"
      fontSize="0.9rem"
      fontWeight="medium"
    >
      <Text m="auto">
        <Moment date={date} format="D.MM" />
      </Text>
    </Flex>
  );
};

export default NewsCardDate;
