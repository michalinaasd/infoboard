import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Flex,
  Text,
  Divider,
} from '@chakra-ui/core';

const POSTS_COUNTER = gql`
  query POSTS_COUNTER {
    events_aggregate {
      aggregate {
        count
      }
    }
    emergencyInfos_aggregate {
      aggregate {
        count
      }
    }
    infos_aggregate {
      aggregate {
        count
      }
    }
    news_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const PUBLISHED_POSTS_COUNTER = gql`
  query POSTS_COUNTER {
    events_aggregate(where: { published: { _eq: true } }) {
      aggregate {
        count
      }
    }
    emergencyInfos_aggregate(where: { published: { _eq: true } }) {
      aggregate {
        count
      }
    }
    infos_aggregate(where: { published: { _eq: true } }) {
      aggregate {
        count
      }
    }
    news_aggregate(where: { published: { _eq: true } }) {
      aggregate {
        count
      }
    }
  }
`;

const NEW_POSTS_THIS_WEEK_COUNTER = gql`
  query NEW_POSTS_THIS_WEEK_COUNTER($_gte: timestamptz) {
    news_aggregate(where: { created_at: { _gte: $_gte } }) {
      aggregate {
        count
      }
    }
    events_aggregate(where: { created_at: { _gte: $_gte } }) {
      aggregate {
        count
      }
    }
    emergencyInfos_aggregate(where: { created_at: { _gte: $_gte } }) {
      aggregate {
        count
      }
    }
    infos_aggregate(where: { created_at: { _gte: $_gte } }) {
      aggregate {
        count
      }
    }
  }
`;
const NEW_POSTS_LAST_WEEK_COUNTER = gql`
  query NEW_POSTS_LAST_WEEK_COUNTER($_gte: timestamptz, $_lt: timestamptz) {
    news_aggregate(
      where: { _and: { created_at: { _gte: $_gte, _lt: $_lt } } }
    ) {
      aggregate {
        count
      }
    }
    events_aggregate(
      where: { _and: { created_at: { _gte: $_gte, _lt: $_lt } } }
    ) {
      aggregate {
        count
      }
    }
    emergencyInfos_aggregate(
      where: { _and: { created_at: { _gte: $_gte, _lt: $_lt } } }
    ) {
      aggregate {
        count
      }
    }
    infos_aggregate(
      where: { _and: { created_at: { _gte: $_gte, _lt: $_lt } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const ChannelPosts = ({ counter, name }) => {
  return (
    <Stat textAlign="center">
      <StatLabel fontSize="2rem" fontWeight="400">
        {name}
      </StatLabel>
      <StatNumber fontSize="3rem">{counter}</StatNumber>
    </Stat>
  );
};

const ChannelStats = ({ thisWeekData, lastWeekData, name }) => {
  return (
    <Stat textAlign="center">
      <StatLabel>{name} this week</StatLabel>
      <StatNumber fontSize="3rem">{thisWeekData}</StatNumber>
      <StatHelpText fontSize="1rem">
        <StatArrow
          size="2rem"
          type={thisWeekData - lastWeekData > 0 ? 'increase' : 'decrease'}
        />
        {Math.abs(thisWeekData - lastWeekData)}
      </StatHelpText>
    </Stat>
  );
};

export const PostsCounter = () => {
  const { loading, error, data } = useQuery(POSTS_COUNTER);
  const [postsCounter, setPostsCounter] = useState(0);

  useEffect(() => {
    if (data) {
      setPostsCounter(
        data.events_aggregate.aggregate.count +
          data.emergencyInfos_aggregate.aggregate.count +
          data.infos_aggregate.aggregate.count +
          data.news_aggregate.aggregate.count
      );
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }

  return (
    <>
      <Text fontSize="2rem" pb={2}>
        Posts
      </Text>
      <Flex
        h="50%"
        w="100%"
        shadow="md"
        bg="white"
        borderRadius={10}
        borderWidth={1}
        align="center"
      >
        <ChannelPosts counter={postsCounter} name="Total" />
        <ChannelPosts
          counter={data.news_aggregate.aggregate.count}
          name="News"
        />
        <ChannelPosts
          counter={data.events_aggregate.aggregate.count}
          name="Events"
        />
        <ChannelPosts
          counter={data.infos_aggregate.aggregate.count}
          name="Infos"
        />
        <ChannelPosts
          counter={data.emergencyInfos_aggregate.aggregate.count}
          name="Alerts"
        />
      </Flex>
    </>
  );
};

export const PublishedPostsCounter = () => {
  const { loading, error, data } = useQuery(PUBLISHED_POSTS_COUNTER);
  const [publishedPostsCounter, setPublishedPostsCounter] = useState(0);

  useEffect(() => {
    if (data) {
      setPublishedPostsCounter(
        data.events_aggregate.aggregate.count +
          data.emergencyInfos_aggregate.aggregate.count +
          data.infos_aggregate.aggregate.count +
          data.news_aggregate.aggregate.count
      );
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }

  return (
    <Flex direction="column" w="20%" textAlign="center">
      <Text fontSize="2rem" pb={2}>
        Published posts
      </Text>
      <Flex
        direction="column"
        shadow="md"
        bg="white"
        borderRadius={10}
        borderWidth={1}
        h="100%"
      >
        <ChannelPosts counter={publishedPostsCounter} name="Total" />
        <Divider />
        <ChannelPosts
          counter={data.news_aggregate.aggregate.count}
          name="News"
        />
        <Divider />
        <ChannelPosts
          counter={data.events_aggregate.aggregate.count}
          name="Events"
        />
        <Divider />
        <ChannelPosts
          counter={data.infos_aggregate.aggregate.count}
          name="Infos"
        />
      </Flex>
    </Flex>
  );
};

export const PostsStats = ({ startDate, endDate }) => {
  const [lastWeekPostsCounter, setLastWeekPostsCounter] = useState(0);
  const [thisWeekPostsCounter, setThisWeekPostsCounter] = useState(0);
  console.log(endDate);

  const { loading, error, data } = useQuery(NEW_POSTS_THIS_WEEK_COUNTER, {
    variables: { _gte: endDate },
  });
  const { loading: loadingL, error: errorL, data: dataL } = useQuery(
    NEW_POSTS_LAST_WEEK_COUNTER,
    {
      variables: { _gte: startDate, _lt: endDate },
    }
  );

  useEffect(() => {
    if (data && dataL) {
      setThisWeekPostsCounter(
        data.events_aggregate.aggregate.count +
          data.emergencyInfos_aggregate.aggregate.count +
          data.infos_aggregate.aggregate.count +
          data.news_aggregate.aggregate.count
      );
      setLastWeekPostsCounter(
        dataL.events_aggregate.aggregate.count +
          dataL.emergencyInfos_aggregate.aggregate.count +
          dataL.infos_aggregate.aggregate.count +
          dataL.news_aggregate.aggregate.count
      );
    }
  }, [data, dataL]);

  if (loading || loadingL) return <p>Loading...</p>;
  if (error || errorL) {
    console.log(error || errorL);
    return <p>Error</p>;
  }

  return (
    <>
      <Text fontSize="2rem" pt={4}>
        Posts statistics
      </Text>
      <Flex
        w="100%"
        h="50%"
        shadow="md"
        bg="white"
        borderRadius={10}
        borderWidth={1}
        align="center"
      >
        <ChannelStats
          thisWeekData={thisWeekPostsCounter}
          lastWeekData={lastWeekPostsCounter}
          name="New posts"
        />
        <ChannelStats
          thisWeekData={data.news_aggregate.aggregate.count}
          lastWeekData={dataL.news_aggregate.aggregate.count}
          name="News"
        />
        <ChannelStats
          thisWeekData={data.events_aggregate.aggregate.count}
          lastWeekData={dataL.events_aggregate.aggregate.count}
          name="Events"
        />
        <ChannelStats
          thisWeekData={data.infos_aggregate.aggregate.count}
          lastWeekData={dataL.infos_aggregate.aggregate.count}
          name="Infos"
        />
        <ChannelStats
          thisWeekData={data.emergencyInfos_aggregate.aggregate.count}
          lastWeekData={dataL.emergencyInfos_aggregate.aggregate.count}
          name="Alerts"
        />
      </Flex>
    </>
  );
};
