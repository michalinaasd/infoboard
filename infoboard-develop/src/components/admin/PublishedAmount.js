import React, { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/core';

const PublishedAmount = ({ data, max, setAmount }) => {
  useEffect(() => {
    setAmount(data);
  });

  return (
    <Box w="100%" textAlign="right">
      <Text>
        Published amount:
        {' ' + data + '/' + max}
      </Text>
    </Box>
  );
};

export default PublishedAmount;
