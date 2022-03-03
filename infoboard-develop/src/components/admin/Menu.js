import React from 'react';
import {
  Flex,
  Stack,
  Box,
  Drawer,
  DrawerContent,
  useDisclosure,
  IconButton,
  Link,
  Text,
} from '@chakra-ui/core';
import {
  RiHomeLine,
  RiCalendarLine,
  RiMessageLine,
  RiInformationLine,
  RiProfileLine,
  RiMenuLine,
} from 'react-icons/ri';
import { CgPoll } from 'react-icons/cg';
import { Link as ReachLink } from 'react-router-dom';

const menuOptions = ['Home', 'News', 'Events', 'Infos', 'Alerts', 'Polls'];
const icons = [
  RiHomeLine,
  RiMessageLine,
  RiCalendarLine,
  RiProfileLine,
  RiInformationLine,
  CgPoll,
];

const Menu = ({ focusElement }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <Box w="100%" h="5%" bg="gray.100">
      <IconButton
        ref={btnRef}
        onClick={onOpen}
        w="3rem"
        h="3rem"
        icon={RiMenuLine}
        fontSize="2xl"
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
      >
        <DrawerContent>
          <Flex h="100vh" bg="gray.100" borderRightWidth="1px">
            <Stack paddingTop="50px" spacing={0} w="100%">
              {menuOptions.map((element, index) => (
                <Link
                  key={index}
                  as={ReachLink}
                  to={'/admin/' + element}
                  w="100%"
                  display="flex"
                  flexDirection="row"
                  borderBottomWidth="1px"
                  p="1rem 1.5rem"
                  bg={focusElement === element && 'gray.300'}
                  _hover={{ bg: 'gray.200' }}
                  _focus="none"
                >
                  <Box h="100%" w="10%" as={icons[index]} />
                  <Text fontWeight="500" pl="2.5rem" fontSize="1.1rem">
                    {element}
                  </Text>
                </Link>
              ))}
            </Stack>
          </Flex>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Menu;
