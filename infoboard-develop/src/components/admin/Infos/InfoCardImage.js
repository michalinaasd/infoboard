import React from 'react';
import { Box, Image, Icon } from '@chakra-ui/core';

const InfoCardImage = ({ img, published }) => {
  return (
    <Box w="100%" h="73%" position="relative">
      <Image
        size="100%"
        objectFit="cover"
        src={img}
        roundedTopRight="lg"
        roundedTopLeft="lg"
      />
      {published && (
        <Icon
          name="check-circle"
          color="blue.300"
          w="2rem"
          h="2rem"
          zIndex="10"
          position="absolute"
          top="2"
          right="2"
          borderRadius="1rem"
          border="1px solid white"
          bg="white"
        />
      )}
    </Box>
  );
};

export default InfoCardImage;
