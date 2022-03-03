import React, { useState, useEffect } from 'react';
import { gql, useSubscription } from '@apollo/client';
import { Grid, Flex } from '@chakra-ui/core';
import Info from './Info';
import AddInfo from './AddInfo';
import { MAX_INFOS_PUBLISHED_POSTS } from '../constants';
import ListHeader from '../ListHeader';

const GET_INFOS = gql`
  subscription GET_INFOS {
    infos(order_by: { created_at: asc }) {
      id
      img
      title
      content
      img_only_mode
      published
    }
  }
`;
const COUNT_PUBLISHED_INFOS = gql`
  subscription COUNT_PUBLISHED_INFOS {
    infos_aggregate(where: { published: { _eq: true } }) {
      aggregate {
        count
      }
    }
  }
`;

const InfosList = ({ setFocusElement }) => {
  useEffect(() => {
    setFocusElement('Infos');
  }, [setFocusElement]);

  const { loading, error, data } = useSubscription(GET_INFOS);
  const { loading: loadingC, error: errorC, data: dataC } = useSubscription(
    COUNT_PUBLISHED_INFOS
  );
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (dataC) {
      setAmount(dataC.infos_aggregate.aggregate.count);
    }
  }, [dataC]);

  if (loading || loadingC) return <p>Loading...</p>;
  if (error || errorC) {
    console.log(error);
    return <p>Error</p>;
  }

  return (
    <Flex direction="column" w="88%" m="auto" pt="10">
      <ListHeader title="Infos" max={MAX_INFOS_PUBLISHED_POSTS} amount={amount}>
        <AddInfo maxAmount={MAX_INFOS_PUBLISHED_POSTS} amount={amount} />
      </ListHeader>
      <Grid
        templateColumns="repeat(auto-fit, 330px)"
        gap="3.7rem"
        w="100%"
        mt="20px"
      >
        {data.infos.map(
          ({ id, img, title, content, published, img_only_mode }) => (
            <Info
              key={id}
              img={img}
              title={title}
              content={content}
              id={id}
              published={published}
              maxAmount={MAX_INFOS_PUBLISHED_POSTS}
              amount={amount}
              img_only_mode={img_only_mode}
            />
          )
        )}
      </Grid>
    </Flex>
  );
};

export default InfosList;
