import React, { useState, useEffect } from 'react';
import { Flex, useToast, useDisclosure } from '@chakra-ui/core';
import { gql, useSubscription, useMutation } from '@apollo/client';
import AddEvent from './AddEvent';
import Table from '../Table';
import {
  MAX_EVENTS_PUBLISHED_POSTS,
  MAX_NEWS_PUBLISHED_POSTS,
} from '../constants';
import EditEvent from './EditEvent';
import ListHeader from '../ListHeader';

const EVENTS = gql`
  subscription GET_EVENTS {
    events(order_by: { created_at: asc }) {
      content
      created_at
      title
      time
      id
      date
      published
    }
  }
`;

const COUNT_PUBLISHED_EVENTS = gql`
  subscription COUNT_PUBLISHED_EVENTS {
    events_aggregate(where: { published: { _eq: true } }) {
      aggregate {
        count
      }
    }
  }
`;

const DELETE_EVENT_BY_PK = gql`
  mutation DELETE_EVENTS_BY_PK($id: uuid!) {
    delete_events_by_pk(id: $id) {
      id
    }
  }
`;

const PUBLISH_EVENT = gql`
  mutation PUBLISH_EVENT($id: uuid!, $published: Boolean!) {
    update_events_by_pk(
      pk_columns: { id: $id }
      _set: { published: $published }
    ) {
      id
    }
  }
`;

const EventList = ({ setFocusElement }) => {
  useEffect(() => {
    setFocusElement('Events');
  }, [setFocusElement]);

  const { loading, error, data } = useSubscription(EVENTS);
  const { loading: loadingC, error: errorC, data: dataC } = useSubscription(
    COUNT_PUBLISHED_EVENTS
  );

  const [deleteEvent] = useMutation(DELETE_EVENT_BY_PK);
  const [publishEvent] = useMutation(PUBLISH_EVENT);

  const [amount, setAmount] = useState(0);
  const [id, setId] = useState('');
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  useEffect(() => {
    if (dataC) {
      setAmount(dataC.events_aggregate.aggregate.count);
    }
  }, [dataC]);

  if (loading || loadingC) return <p>Loading...</p>;
  if (error || errorC) {
    console.log(error || errorC);
    return <p>Error</p>;
  }

  const config = {
    columns: [
      { columnKey: 'title', columnName: 'Title' },
      { columnKey: 'content', columnName: 'Content' },
      { columnKey: 'date', columnName: 'Date' },
      { columnKey: 'time', columnName: 'Time' },
    ],
  };

  return (
    <Flex direction="column" w="88%" m="auto" pt="10">
      <ListHeader title="Events" max={MAX_NEWS_PUBLISHED_POSTS} amount={amount}>
        <AddEvent maxAmount={MAX_EVENTS_PUBLISHED_POSTS} amount={amount} />
      </ListHeader>

      <Table
        data={data.events}
        config={config}
        onDelete={(id) => {
          deleteEvent({ variables: { id: id } });
        }}
        onPost={(id, published) => {
          if (amount === MAX_EVENTS_PUBLISHED_POSTS && !published) {
            toast({
              title: 'An error occured',
              description: `You cannot publish more than ${MAX_EVENTS_PUBLISHED_POSTS} events`,
              status: 'error',
              isClosable: true,
            });
          } else {
            publishEvent({ variables: { id: id, published: !published } });
          }
        }}
        btnRef={btnRef}
        onEdit={(id) => {
          setId(id);
          onOpen();
        }}
        type="Event"
      />
      {id && (
        <EditEvent
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={() => {
            onClose();
            setId('');
          }}
          btnRef={btnRef}
          id={id}
        />
      )}
    </Flex>
  );
};

export default EventList;
