import React, { useState } from 'react';
import { Button, useDisclosure, Flex, Stack } from '@chakra-ui/core';
import { gql, useMutation } from '@apollo/client';
import ModalInfo from './ModalInfo';
import DeleteButton from '../DeleteButton';
import InfoCardImage from './InfoCardImage';
import InfoCardTitle from './InfoCardTitle';

const DELETE_INFO_BY_PK = gql`
  mutation DELETE_INFO_BY_PK($id: uuid!) {
    delete_infos_by_pk(id: $id) {
      id
    }
  }
`;

const PUBLISH_INFO = gql`
  mutation PUBLISH_INFO($id: uuid!, $published: Boolean!) {
    update_infos_by_pk(
      pk_columns: { id: $id }
      _set: { published: $published }
    ) {
      id
    }
  }
`;

const Info = ({
  img,
  title,
  content,
  id,
  published,
  maxAmount,
  amount,
  img_only_mode,
}) => {
  const [deleteInfo] = useMutation(DELETE_INFO_BY_PK);
  const [publishInfo] = useMutation(PUBLISH_INFO);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editMode, setEditMode] = useState(false);

  return (
    <Flex
      size="sm"
      w="20.5rem"
      borderWidth="1px"
      rounded="lg"
      shadow="md"
      direction="column"
    >
      <InfoCardImage img={img} published={published} />
      <InfoCardTitle
        img_only_mode={img_only_mode}
        title={title}
        onOpen={onOpen}
      />
      <Stack isInline w="100%" h="12%" align="center" p={1}>
        <Button
          w="50%"
          onClick={() => {
            setEditMode(true);
            onOpen();
          }}
        >
          Edit
        </Button>
        <DeleteButton
          type="Info"
          onDelete={() => {
            deleteInfo({ variables: { id: id } });
          }}
          title={title}
          w="50%"
        />
      </Stack>

      <ModalInfo
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={() => {
          onClose();
          setEditMode(false);
        }}
        id={id}
        title={title}
        content={content}
        img={img}
        editMode={editMode}
        onEdit={() => {
          setEditMode(true);
        }}
        img_only_mode={img_only_mode}
        onPublish={(id, published) => {
          publishInfo({
            variables: { id: id, published: published },
          });
        }}
        published={published}
        maxAmount={maxAmount}
        amount={amount}
      />
    </Flex>
  );
};

export default Info;
