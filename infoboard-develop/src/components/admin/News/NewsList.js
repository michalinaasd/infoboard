import React, { useState, useEffect } from 'react';
import { gql, useSubscription, useMutation } from '@apollo/client';
import { Flex, useToast, useDisclosure } from '@chakra-ui/core';
import EditNews from './EditNews';
import AddNews from './AddNews';
import { MAX_NEWS_PUBLISHED_POSTS } from '../constants';
import Table from '../Table';
import ListHeader from '../ListHeader';

const NEWS = gql`
  subscription NEWS_SUBSCRIPTION {
    news(order_by: { created_at: asc }) {
      content
      created_at
      id
      title
      published
    }
  }
`;
const COUNT_PUBLISHED_NEWS = gql`
  subscription COUNT_PUBLISHED_NEWS {
    news_aggregate(where: { published: { _eq: true } }) {
      aggregate {
        count
      }
    }
  }
`;
const DELETE_NEWS_BY_PK = gql`
  mutation DELETE_NEWS_BY_PK($id: uuid!) {
    delete_news_by_pk(id: $id) {
      id
    }
  }
`;

const PUBLISH_NEWS = gql`
  mutation PUBLISH_NEWS($id: uuid!, $published: Boolean!) {
    update_news_by_pk(
      pk_columns: { id: $id }
      _set: { published: $published }
    ) {
      id
    }
  }
`;

const NewsList = ({ setFocusElement }) => {
  useEffect(() => {
    setFocusElement('News');
  }, [setFocusElement]);

  const { loading, error, data } = useSubscription(NEWS);
  const { loading: loadingC, error: errorC, data: dataC } = useSubscription(
    COUNT_PUBLISHED_NEWS
  );

  const [deleteNews] = useMutation(DELETE_NEWS_BY_PK);
  const [publishNews] = useMutation(PUBLISH_NEWS);

  const [amount, setAmount] = useState(0);
  const [id, setId] = useState('');
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  useEffect(() => {
    if (dataC) {
      setAmount(dataC.news_aggregate.aggregate.count);
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
    ],
  };

  return (
    <Flex direction="column" w="88%" m="auto" pt="10">
      <ListHeader title="News" max={MAX_NEWS_PUBLISHED_POSTS} amount={amount}>
        <AddNews maxAmount={MAX_NEWS_PUBLISHED_POSTS} amount={amount} />
      </ListHeader>

      <Table
        data={data.news}
        config={config}
        onDelete={(id) => {
          deleteNews({ variables: { id: id } });
        }}
        onPost={(id, published) => {
          if (amount === MAX_NEWS_PUBLISHED_POSTS && !published) {
            toast({
              title: 'An error occured',
              description: `You cannot publish more than ${MAX_NEWS_PUBLISHED_POSTS} news`,
              status: 'error',
              isClosable: true,
            });
          } else {
            publishNews({ variables: { id: id, published: !published } });
          }
        }}
        btnRef={btnRef}
        onEdit={(id) => {
          setId(id);
          onOpen();
        }}
        type="News"
      />
      {id && (
        <EditNews
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

export default NewsList;
