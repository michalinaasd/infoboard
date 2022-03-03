import React from 'react';
import { Flex } from '@chakra-ui/core';
import NewsCardHeader from './NewsCardHeader';
import NewsCardContent from './NewsCardContent';
import NewsCardDate from './NewsCardDate';

const NewsCard = ({ content, title, date, height }) => {
  return (
    <>
      <NewsCardDate date={date} />
      <Flex
        direction="column"
        bg="white"
        borderWidth={1}
        boxShadow="md"
        borderRadius="10px"
        w="100%"
        h={height}
        lineHeight="1.2"
        position="relative"
        top="0"
        p={3}
      >
        <NewsCardHeader title={title} date={date} />
        <NewsCardContent content={content} />
      </Flex>
    </>
  );
};

export default NewsCard;
