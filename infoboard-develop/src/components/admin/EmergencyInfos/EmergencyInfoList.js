import React, { useState, useEffect } from 'react';
import { gql, useSubscription, useMutation } from '@apollo/client';
import { Flex, useToast, useDisclosure } from '@chakra-ui/core';
import AddEmergencyInfo from './AddEmergencyInfo';
import { MAX_EMERGENCY_INFO_PUBLISHED_POSTS } from '../constants';
import Table from '../Table';
import EditEmergencyInfo from './EditEmergencyInfo';
import ListHeader from '../ListHeader';

const EMERGENCY_INFOS = gql`
  subscription EMERGENCY_INFOS {
    emergencyInfos(order_by: { created_at: asc }) {
      id
      content
      created_at
      published
    }
  }
`;

const COUNT_PUBLISHED_EMERGENCY_INFOS = gql`
  subscription COUNT_PUBLISHED_EMERGENCY_INFOS {
    emergencyInfos_aggregate(where: { published: { _eq: true } }) {
      aggregate {
        count
      }
    }
  }
`;

const DELETE_EMERGENCY_INFO_BY_PK = gql`
  mutation DELETE_EMERGENCY_INFO_BY_PK($id: uuid!) {
    delete_emergencyInfos_by_pk(id: $id) {
      id
    }
  }
`;

const PUBLISH_EMERGENCY_INFO = gql`
  mutation PUBLISH_EMERGENCY_INFO($id: uuid!, $published: Boolean!) {
    update_emergencyInfos_by_pk(
      pk_columns: { id: $id }
      _set: { published: $published }
    ) {
      id
    }
  }
`;

const EmergencyInfoList = ({ setFocusElement }) => {
  useEffect(() => {
    setFocusElement('Alerts');
  }, [setFocusElement]);

  const { loading, error, data } = useSubscription(EMERGENCY_INFOS);
  const { loading: loadingC, error: errorC, data: dataC } = useSubscription(
    COUNT_PUBLISHED_EMERGENCY_INFOS
  );

  const [deleteEmergencyInfo] = useMutation(DELETE_EMERGENCY_INFO_BY_PK);
  const [publishEmergencyInfo] = useMutation(PUBLISH_EMERGENCY_INFO);

  const [amount, setAmount] = useState(0);
  const [id, setId] = useState('');
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  useEffect(() => {
    if (dataC) {
      setAmount(dataC.emergencyInfos_aggregate.aggregate.count);
    }
  }, [dataC]);

  if (loading || loadingC) return <p>Loading...</p>;
  if (error || errorC) {
    console.log(error || errorC);
    return <p>Error</p>;
  }
  const config = {
    columns: [{ columnKey: 'content', columnName: 'Content' }],
  };
  return (
    <Flex direction="column" w="88%" m="auto" pt="10">
      <ListHeader
        title="Alerts"
        max={MAX_EMERGENCY_INFO_PUBLISHED_POSTS}
        amount={amount}
      >
        <AddEmergencyInfo
          maxAmount={MAX_EMERGENCY_INFO_PUBLISHED_POSTS}
          amount={amount}
        />
      </ListHeader>

      <Table
        data={data.emergencyInfos}
        config={config}
        onDelete={(id) => {
          deleteEmergencyInfo({ variables: { id: id } });
        }}
        onPost={(id, published) => {
          if (amount === MAX_EMERGENCY_INFO_PUBLISHED_POSTS && !published) {
            toast({
              title: 'An error occured',
              description: `You cannot publish more than ${MAX_EMERGENCY_INFO_PUBLISHED_POSTS} alerts`,
              status: 'error',
              isClosable: true,
            });
          } else {
            publishEmergencyInfo({
              variables: { id: id, published: !published },
            });
          }
        }}
        btnRef={btnRef}
        onEdit={(id) => {
          setId(id);
          onOpen();
        }}
        type="Alert"
      />
      {id && (
        <EditEmergencyInfo
          btnRef={btnRef}
          onOpen={onOpen}
          onClose={() => {
            onClose();
            setId('');
          }}
          isOpen={isOpen}
          id={id}
        />
      )}
    </Flex>
  );
};

export default EmergencyInfoList;
