import React from 'react'
import { Space, Table } from 'antd'
import { ActionButton } from '../assets/asset.style'
import styled from 'styled-components'

const Title = styled.div`
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 10px;
`

const Proposal: React.FC = () => {
  const activeData = [
    {
      key: '0',
      transitionId: 'xxxxxxxxxxxxxxxx',
      desc: 'transfer to xxxx 1.00 SOL',
    },
    {
      key: '1',
      transitionId: 'xxxxxxxxxxxxxxxx',
      desc: 'transfer to xxxx 12.00 SOL',
    },
    {
      key: '2',
      transitionId: 'xxxxxxxxxxxxxxxx',
      desc: 'transfer to xxxx 11.50 SOL',
    },

  ]

  const historyData = [
    {
      key: '0',
      transitionId: 'xxxxxxxxxxxxxxxx',
      desc: 'transfer to xxxx 1.00 SOL',
      state: 'EXEC'
    },
    {
      key: '1',
      transitionId: 'xxxxxxxxxxxxxxxx',
      desc: 'transfer to xxxx 12.00 SOL',
      state: 'REJECT'

    },
    {
      key: '2',
      transitionId: 'xxxxxxxxxxxxxxxx',
      desc: 'transfer to xxxx 11.50 SOL',
      state: 'EXEC'
    },

  ]

  return (
    <>
      <Title>Active</Title>
      <Table dataSource={activeData}>
        <Table.Column title={'Transition ID'} dataIndex={'transitionId'} />
        <Table.Column title={'Desc'} dataIndex={'desc'} />
        <Table.Column
          title="Action"
          key="action"
          fixed="right"
          render={(text, record) => (
            <Space size="middle" >

              <ActionButton > Approve </ActionButton>
              <ActionButton >Reject</ActionButton>

            </Space>
          )}
        />
      </Table>

      <Title>History</Title>
      <Table dataSource={historyData}>
        <Table.Column title={'Transition ID'} dataIndex={'transitionId'} />
        <Table.Column title={'Desc'} dataIndex={'desc'} />
        <Table.Column title={'State'} dataIndex={'state'} />


      </Table>
    </>
  )
}

export default Proposal
