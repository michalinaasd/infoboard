import React, { useState } from 'react';
import { useSubscription, gql } from '@apollo/client';
import { Flex } from '@chakra-ui/core';
import NewsCard from './NewsCard';
import Pagination from '../Pagination';
import PageIndicator from '../PageIndicator';
import { NEWS_UPDATE_INTERVAL } from '../admin/constants';
import NoPostMessage from '../NoPostMessage';

const NEWS = gql`
  subscription NEWS_SUBSCRIPTION {
    news(where: { published: { _eq: true } }, order_by: { created_at: asc }) {
      content
      created_at
      id
      title
      published
    }
  }
`;

const NewsFeed = ({ postsPerPage }) => {
  const { loading, error, data } = useSubscription(NEWS);
  const [pageNr, setPageNr] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }
  if (!data.news.length) return <NoPostMessage />;

  return (
    <Flex direction="column" h="100%">
      <Flex direction="column" h="100%" pb={2}>
        <Pagination
          pageSize={postsPerPage}
          intervalMs={NEWS_UPDATE_INTERVAL}
          pageNr={pageNr}
          onPageChange={(pageNr, pageCount) => {
            setPageNr(pageNr);
            setPageCount(pageCount);
          }}
        >
          {data.news.map(({ id, content, title, created_at }) => (
            <NewsCard
              key={id}
              color="white"
              title={title}
              content={content}
              date={created_at}
              height={`${100 / postsPerPage}%`}
            />
          ))}
        </Pagination>
      </Flex>
      <PageIndicator page={pageNr} length={pageCount} direction="row" />
    </Flex>
  );
};

export default NewsFeed;
