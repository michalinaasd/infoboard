import React from 'react';
import { Box, Text } from '@chakra-ui/core';

const EmergencyBar = ({ data }) => {
  return (
    <Box
      bg="red.500"
      h="50px"
      overflow="hidden"
      fontSize="1.7rem"
      padding="0 10px"
    >
      {data.emergencyInfos.map(({ id, content }) => (
        <Text color="white" key={id}>
          {content}
        </Text>
      ))}
    </Box>
  );
};

export default EmergencyBar;
