import React from 'react';
import { Flex, Text, IconButton, Box } from '@chakra-ui/core';
import { MdPhotoSizeSelectActual } from 'react-icons/md';

const InfoCardTitle = ({ img_only_mode, title, onOpen }) => {
  return (
    <Flex direction="row" h="15%" fontSize="1.1rem" p={2} align="center">
      {img_only_mode && <Box as={MdPhotoSizeSelectActual} />}
      <Text
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        w="90%"
        p="0 0.5rem"
        fontSize="2xl"
      >
        {title}
      </Text>
      <IconButton
        icon="view"
        onClick={onOpen}
        bg="inherit"
        _hover={{ bg: 'inherit' }}
      />
    </Flex>
  );
};

export default InfoCardTitle;
