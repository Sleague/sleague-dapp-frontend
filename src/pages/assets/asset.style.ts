import styled from 'styled-components'

export const ActionButton = styled.div`
  cursor: pointer;
  color: dodgerblue;
  
  .hide {
    display: none;
    padding: 0;
  }
`


export const ActionRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: right;
  
  .icon {
    font-size: 25px;
    margin-left: 12px;
    margin-bottom: 5px;
    cursor: pointer;
  }
`
