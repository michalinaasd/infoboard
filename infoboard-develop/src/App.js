import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  split,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/link-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import Board from './components/Board';
import Dashboard from './components/admin/Dashboard';
import EventList from './components/admin/Events/EventList';
import NewsList from './components/admin/News/NewsList';
import InfosList from './components/admin/Infos/InfosList';
import EmergencyInfoList from './components/admin/EmergencyInfos/EmergencyInfoList';
import PollList from './components/admin/Polls/PollList';
import Menu from './components/admin/Menu';
import Poll from './components/Poll/Poll';

const HTTP_GRAPHQL_ENDPOINT =
  'graphqolendpoint';
const WS_GRAPHQL_ENDPOINT = `graphqlendpoint`;

const httpLink = new HttpLink({
  uri: HTTP_GRAPHQL_ENDPOINT,
  headers: {
    'x-hasura-admin-secret': 'password',
  },
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
};

const wsLink = new WebSocketLink({
  uri: WS_GRAPHQL_ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: {
      headers: { 'x-hasura-admin-secret': 'password' },
    },
  },
});

const splitLink = new split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
  defaultOptions,
});

const App = () => {
  const [focusElement, setFocusElement] = useState('Home');

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <CSSReset />
          <Route path="/admin">
            <Menu focusElement={focusElement} />
          </Route>
          <Switch>
            <Route path="/admin/Infos">
              <InfosList setFocusElement={setFocusElement} />
            </Route>
            <Route path="/admin/News">
              <NewsList setFocusElement={setFocusElement} />
            </Route>
            <Route path="/admin/Events">
              <EventList setFocusElement={setFocusElement} />
            </Route>
            <Route path="/admin/Alerts">
              <EmergencyInfoList setFocusElement={setFocusElement} />
            </Route>
            <Route path="/admin/Polls">
              <PollList setFocusElement={setFocusElement} />
            </Route>
            <Route path="/admin">
              <Dashboard setFocusElement={setFocusElement} />
            </Route>
            <Route path="/poll">
              <Poll />
            </Route>
            <Route path="/">
              <Board />
            </Route>
          </Switch>
        </ThemeProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default App;
