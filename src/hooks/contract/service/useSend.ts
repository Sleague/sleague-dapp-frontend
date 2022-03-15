import { useCallback } from 'react'
import { FormInstance } from 'antd'

export type SendAssetRequest = {
    asset: string,
    from: string,
    to: string,
    amount: number
}

const useSend = () => {
  const sendAsset = useCallback(
    async (formInstance: FormInstance<SendAssetRequest>) => {

      const form = await formInstance.validateFields()
      console.log(form)
    },[]
  )

  return { sendAsset }
}

export default useSend
