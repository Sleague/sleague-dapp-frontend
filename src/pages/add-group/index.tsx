import styled from 'styled-components'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Form, FormInstance, Input, InputNumber, Table } from 'antd'
import EditableTable, { EdT } from '../../components/EditableTable'
import { useGroupQuery } from '../../hooks/queries/useGroupQuery'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  
  .title {
    font-size: 1.6em;
    font-weight: bold;
  }
`

const ButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: right;
  
  .button {
    margin-right: 30px;
  }
`

const AddGroup: React.FC = () => {
  const { data: memberData } = useGroupQuery()

  const [newMember, setNewMember] = useState<any>()
  const [threshold, setThreshold] = useState(0)

  return (
    <>
      <Wrapper >
        <Container>
          <div className="title"> Create a Multisig Group</div>
          {/*<EditableTable />*/}
          {
            memberData && <EdT data={memberData} onSave={v => setNewMember(v)} />
          }
          <div className="title"> Threshold</div>
          <InputNumber controls={false} style={{ width: '100%' }} onChange={(v:number)=>setThreshold(v)} />

          <ButtonContainer>
            <Button className="button"> Ok </Button>
            <Button> Cancel</Button>
          </ButtonContainer>
        </Container>
      </Wrapper>
    </>
  )
}

export default AddGroup
