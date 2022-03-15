import React, { useMemo, useState } from 'react'
import { Form, FormInstance, Input, InputNumber, Modal, Space, Table } from 'antd'
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { ActionButton, ActionRow } from './asset.style'
import useMint, { Hint, MintAssetRequest } from '../../hooks/contract/service/useMint'
import useSend, { SendAssetRequest } from '../../hooks/contract/service/useSend'

export type ChainType = 'Solona' | 'Serum' | 'Sleague'

const TypeChainThumbnailMapper: { [key in ChainType]?: string } = {
  'Solona': 'SOL',
  'Serum': 'SRM',
  'Sleague': 'SLG'
}

const MessageHint: React.FC<Hint> = ({ message, type }) => {
  const color = type ? {
    'error': '#ff4d4f',
    'success': '#73d13d',
    'hint': '#ff4d4f'
  } [type] : ''

  return (
    <p style={{ fontSize: '1.1em', color }}>
      {message}
    </p>
  )
}

const SendAssetForm: React.FC<{chain: string, sendAssetForm: FormInstance<SendAssetRequest>}> = ({ chain, sendAssetForm }) =>{

  return (
    <Form form={sendAssetForm} layout={'vertical'}>
      <Form.Item label={'Asset'} name={'asset'} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label={'From'} name={'from'} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label={'To'} name={'to'} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label={'Amount'} name={'amount'} rules={[{ required: true }]}>
        <InputNumber controls={false} addonAfter={TypeChainThumbnailMapper[chain as ChainType]} />
      </Form.Item>
    </Form>
  )
}

const ReceiveAssetForm: React.FC<{chain: string}> = ({ chain }) =>{

  return (
    <div />
  )
}

const MintAssetForm: React.FC<{chain: string, mintAssetForm: FormInstance<MintAssetRequest>}> = ({ chain, mintAssetForm }) =>{

  return (
    <Form form={mintAssetForm} layout={'vertical'}>
      <Form.Item  label={'Asset'} name={'asset'} rules={[{ required: true }]} initialValue={'Sleague'}>
        <Input  />
      </Form.Item>
      <Form.Item label={'Mint to'} name={'to'} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label={'Amount'} name={'amount'} rules={[{ required: true }]}>
        <InputNumber controls={false} addonAfter={TypeChainThumbnailMapper[chain as ChainType]} />
      </Form.Item>
    </Form>
  )
}


const Assets: React.FC = () => {
  const [mintAssetForm] = Form.useForm<MintAssetRequest>()
  const [sendAssetForm] = Form.useForm<SendAssetRequest>()
  const [addAssetForm] = Form.useForm<{assetAddress: string}>()

  const [sendAssetVisible, setSendAssetVisible] = useState<boolean>(false)
  const [receiveAssetVisible, setReceiveAssetVisible] = useState<boolean>(false)
  const [mintAssetVisible, setMintAssetVisible] = useState<boolean>(false)
  const [addAssetVisible, setAddAssetVisible] = useState<boolean>(false)

  const [coin, setCoin] = useState<string>('')

  const { hint, mintAsset } = useMint()
  const { sendAsset } = useSend()

  const creating = useMemo(() => !!hint?.message && hint.type === 'hint',[hint])

  const openSendAssetModal = ( record: any) => {
    setCoin(record.Assets)
    setSendAssetVisible(true)
  }

  const openReceiveAssetModal = () => {
    setReceiveAssetVisible(true)
  }

  const openMintAssetModal = (record: any) => {
    setCoin(record.Assets)
    setMintAssetVisible(true)
  }

  const data = [
    {
      key: '1',
      Assets: 'Solona',
      Balance: '1.00',
      Price: 32,
    },
    {
      key: '2',
      Assets: 'Serum',
      Balance: '1.00',
      Price: 32,
    },
    {
      key: '3',
      Assets: 'Sleague',
      Balance: '1.00',
      Price: 32,
    },
  ]

  return (
    <>
      <ActionRow >
        <PlusSquareOutlined className="icon"  onClick={() => setAddAssetVisible(true)} />
        <MinusSquareOutlined  className="icon"  />
      </ActionRow>
      <Table dataSource={data} >
        <Table.Column title= {'Assets'} dataIndex= {'Assets'} key= {'1'} />
        <Table.Column title= {'Balance'} dataIndex= {'Balance'} key= {'2'} />
        <Table.Column title= {'Price'} dataIndex= {'Price'} key= {'3'} />
        <Table.Column
          title="Action"
          key="action"
          fixed="right"
          render={(text, record) => (
            <Space size="middle" >
              <ActionButton onClick= {()=> openSendAssetModal(record)}> Send </ActionButton>
              <ActionButton onClick= {()=> openReceiveAssetModal()}>Receive</ActionButton>
              <ActionButton onClick={ () => openMintAssetModal(record)} >
                <div className={text.Assets === 'Sleague' ? 'show' : 'hide'}>
                  Mint
                </div>
              </ActionButton>
            </Space>
          )}
        />
      </Table>

      <Modal title="Send Asset" visible={sendAssetVisible} onCancel={()=>setSendAssetVisible(false)} onOk={() => sendAsset(sendAssetForm)}>
        {/*<p>{TypeChainThumbnailMapper[coin as ChainType]}</p>*/}
        <SendAssetForm chain={coin}  sendAssetForm={sendAssetForm} />
      </Modal>

      <Modal title="Receive Asset" visible={receiveAssetVisible} onCancel={()=>setReceiveAssetVisible(false)}>
        <ReceiveAssetForm chain={coin} />
      </Modal>

      <Modal title="Mint Asset" visible={mintAssetVisible} onCancel={()=>setMintAssetVisible(false)} onOk={() => mintAsset(mintAssetForm)} confirmLoading={creating}>
        <MintAssetForm chain={coin} mintAssetForm={mintAssetForm} />
        <MessageHint {...hint} />
      </Modal>

      <Modal title="Add Asset" visible={addAssetVisible} onCancel={()=> setAddAssetVisible(false)}>
        <Form form={addAssetForm} layout={'vertical'}>
          <Form.Item  label={'Asset Address'} name={'assetAddress'} rules={[{ required: true }]}>
            <Input  />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Assets
