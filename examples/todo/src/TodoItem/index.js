import React from 'react'
import { List, Icon, Checkbox, Modal, Popconfirm, Spin } from 'antd'
import { useResource } from '@xresource/react'
import { get } from 'lodash'
import Markdown from 'react-markdown'
import styled from 'styled-components'

import { TodoResource } from './TodoResource'

const GhostButton = styled.button`
  border: none;
  background: none;
  padding: 0;

  &:hover {
    cursor: pointer;
  }
`

const ViewButton = ({ onClick }) => (
  <GhostButton onClick={onClick}>
    <Icon type="eye" theme="twoTone" />
  </GhostButton>
)

const DeleteButton = ({ onClick, onConfirm }) => (
  <Popconfirm
    title="Are you sure delete this todo?"
    onConfirm={onConfirm}
    okText="Yes"
    cancelText="No"
  >
    <GhostButton onClick={onClick}>
      <Icon type="delete" theme="twoTone" twoToneColor="deeppink" />
    </GhostButton>
  </Popconfirm>
)

export const TodoItem = ({ item }) => {
  const resource = useResource(TodoResource.with(item), {
    updateOnRead: false,
  })

  const { ctx, data, loading, effects } = resource
  const { completeTodo, deleteTodo, openModal, closeModal } = effects

  const isLoading = loading || ctx.deleting
  const title = get(data, 'todo.title')
  const body = get(data, 'todo.body')

  const onDeleteConfirm = async () => {
    await deleteTodo(item.id)
  }

  const onComplete = async () => {
    await completeTodo(item.id, Boolean(!item.completed))
  }

  return (
    <List.Item
      actions={
        !isLoading && [
          <ViewButton onClick={openModal} />,
          <DeleteButton onConfirm={onDeleteConfirm} />,
        ]
      }
    >
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <Checkbox checked={item.completed} onChange={onComplete}>
            {item.title}
          </Checkbox>
          <Modal
            title={title}
            visible={ctx.showing}
            onCancel={closeModal}
            footer={null}
          >
            <Markdown>
              {body && body.length > 0 ? body : 'No Description'}
            </Markdown>
          </Modal>
        </>
      )}
    </List.Item>
  )
}
