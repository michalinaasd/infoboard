import React from 'react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Icon,
  IconButton,
  ButtonGroup,
  Button,
} from '@chakra-ui/core';

const FormSubmitButton = ({ postOption, setPostOption, changeDisable }) => {
  const submitButtonOptions = ['Post', 'Save'];
  return (
    <ButtonGroup spacing={0}>
      <Button
        type="submit"
        borderBottomRightRadius="0"
        borderTopRightRadius="0"
        size="lg"
        _hover={{ bg: 'gray.100' }}
      >
        {postOption}
      </Button>
      {!changeDisable && (
        <Menu p="0" m="0">
          <MenuButton
            as={IconButton}
            borderBottomLeftRadius="0"
            borderTopLeftRadius="0"
            icon="chevron-down"
            size="lg"
            _hover={{ bg: 'gray.100' }}
          />

          <MenuList h="10%" p="0">
            {submitButtonOptions.map((option) => (
              <MenuItem
                h="50%"
                onClick={() => {
                  setPostOption(option);
                }}
                key={option}
              >
                {option}
                {option === postOption && (
                  <Icon name="check" ml="2" size="0.7rem" />
                )}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </ButtonGroup>
  );
};

export default FormSubmitButton;
