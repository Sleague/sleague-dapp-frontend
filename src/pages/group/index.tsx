import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, List, Modal, Typography } from 'antd'
import EditableTable from '../../components/EditableTable'

const Title = styled.div`
  font-size: 2em;
  font-weight: bold;
`

const ListContainer = styled.div`
  margin: 20px 0;
`


const Group: React.FC = () => {
  const [updateVisible, setUpdateVisible] = useState<boolean>(false)

  const memberData = [
    {
      address: 'a'
    },
    {
      address: 'b'
    },
    {
      address: 'c'
    },
  ]

  return (
    <>
      <Title>Group Member</Title>
      <ListContainer>
        <List
          bordered
          dataSource={memberData}
          renderItem = {item => (
            <List.Item>
              <Typography.Text mark /> {item.address}
            </List.Item>
          )}
        />
      </ListContainer>
      <Button onClick={() => setUpdateVisible(true)}> Update </Button>

      <Modal title="Update Member" visible={updateVisible} onCancel={() => setUpdateVisible(false)} >
        <EditableTable />
      </Modal>
    </>
  )
}


export default Group
