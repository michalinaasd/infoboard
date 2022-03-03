import React from 'react';
import { Box, Button, Switch, Text, Stack } from '@chakra-ui/core';
import DeleteButton from './DeleteButton';

const Table = ({ data, config, onDelete, onPost, onEdit, btnRef, type }) => {
  return (
    <Box as="table" borderWidth={1} shadow="md">
      <Box as="thead" fontWeight="medium" fontSize="1.1rem">
        <Box as="tr">
          {config.columns.map((element) => (
            <Box key={element.columnKey} as="td" p={3}>
              <Text>{element.columnName}</Text>
            </Box>
          ))}
          <Box as="td">
            <Text>Published</Text>
          </Box>
        </Box>
      </Box>
      <Box as="tbody">
        {data.map((element) => (
          <Box
            key={element.id}
            as="tr"
            borderTopWidth={1}
            borderLeftWidth={4}
            borderLeftColor={element.published ? 'blue.300' : 'gray.300'}
          >
            {config.columns.map((conf, index) => (
              <Box key={element.id + index} as="td" p={3}>
                {element[conf.columnKey]}
              </Box>
            ))}
            <Box as="td" p={3} w="15%">
              <Stack isInline>
                <Switch
                  size="lg"
                  isChecked={element.published}
                  pr={5}
                  onChange={() => onPost(element.id, element.published)}
                  m="auto"
                />
                <Button ref={btnRef} onClick={() => onEdit(element.id)}>
                  Edit
                </Button>
                <DeleteButton
                  title={element.title}
                  type={type}
                  onDelete={() => onDelete(element.id)}
                />
              </Stack>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Table;
