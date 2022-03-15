import { useCallback, useState } from 'react'
import { FormInstance } from 'antd'

export type MintAssetRequest = {
    asset: string,
    to: string,
    amount: number
}

export type Hint = {
    message?: string,
    type?: 'error' | 'hint' | 'success'
}

const useMint = () => {
  const [hint, setHint] = useState<Hint>()

  const mintAsset = useCallback(
    async (formInstance: FormInstance<MintAssetRequest>) => {

      const form = await formInstance.validateFields()

      console.log(form)

      setHint({
        message: 'please wait, it may take a moment...',
        type: 'hint',
      })

    }, []
  )

  return { mintAsset, hint }
}

export default useMint
