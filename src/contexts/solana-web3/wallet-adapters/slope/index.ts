import EventEmitter from 'eventemitter3'
import { WalletAdapter } from '@/contexts'
import { PublicKey, Transaction } from '@solana/web3.js'
import {
  scopePollingDetectionStrategy,
  WalletAccountError,
  WalletConnectionError,
  WalletDisconnectionError,
  WalletError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletPublicKeyError,
  WalletReadyState,
  WalletSignTransactionError
} from '@solana/wallet-adapter-base'
import bs58 from 'bs58'
import { Buffer } from 'buffer'

interface SlopeWallet {
  connect(): Promise<{
    msg: string;
    data: {
      publicKey?: string;
    };
  }>;

  disconnect(): Promise<{ msg: string }>;

  signTransaction(message: string): Promise<{
    msg: string;
    data: {
      publicKey?: string;
      signature?: string;
    };
  }>;

  signAllTransactions(messages: string[]): Promise<{
    msg: string;
    data: {
      publicKey?: string;
      signatures?: string[];
    };
  }>;

  signMessage(message: Uint8Array): Promise<{ data: { signature: string } }>;
}

interface WindowWithSlope extends Window {
  Slope?: {
    new(): SlopeWallet;
  };
}

declare const window: WindowWithSlope

export class SlopeWalletAdapter extends EventEmitter implements WalletAdapter {

  private _wallet?: SlopeWallet
  private _connecting: boolean
  private _publicKey?: PublicKey
  private _readyState: WalletReadyState =
    typeof window === 'undefined' || typeof document === 'undefined'
      ? WalletReadyState.Unsupported
      : WalletReadyState.NotDetected

  constructor() {
    super()
    this._connecting = false

    if (this._readyState !== WalletReadyState.Unsupported) {
      scopePollingDetectionStrategy(() => {
        if (typeof window.Slope === 'function') {
          this._readyState = WalletReadyState.Installed
          this.emit('readyStateChange', this._readyState)
          return true
        }
        return false
      })
    }
  }

  get publicKey() {
    return this._publicKey || PublicKey.default
  }

  get connected(): boolean {
    return !!this._publicKey
  }

  get connecting(): boolean {
    return this._connecting
  }

  async connect() {
    try {
      if (this.connected || this.connecting) return
      if (this._readyState !== WalletReadyState.Installed) throw new WalletNotReadyError()

      this._connecting = true

      const wallet = new window.Slope!()

      let data: { publicKey?: string | undefined }
      try {
        ({ data } = await wallet.connect())
      } catch (error: any) {
        throw new WalletConnectionError(error?.message, error)
      }

      if (!data.publicKey) throw new WalletAccountError()

      let publicKey: PublicKey
      try {
        publicKey = new PublicKey(data.publicKey)
      } catch (error: any) {
        throw new WalletPublicKeyError(error?.message, error)
      }

      this._wallet = wallet
      this._publicKey = publicKey

      this.emit('connect', publicKey)
    } catch (error: any) {
      this.emit('error', error)
      throw error
    } finally {
      this._connecting = false
    }
  }

  async disconnect() {
    const wallet = this._wallet
    if (wallet) {
      this._wallet = undefined
      this._publicKey = undefined

      try {
        const { msg } = await wallet.disconnect()
        if (msg !== 'ok') throw new WalletDisconnectionError(msg)
      } catch (error: any) {
        if (!(error instanceof WalletError)) {
          // eslint-disable-next-line no-ex-assign
          error = new WalletDisconnectionError(error?.message, error)
        }
        this.emit('error', error)
      }
    }

    this.emit('disconnect')
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    try {
      const wallet = this._wallet
      if (!wallet) throw new WalletNotConnectedError()

      try {
        const message = bs58.encode(transaction.serializeMessage())
        const { msg, data } = await wallet.signTransaction(message)

        if (!data.publicKey || !data.signature) throw new WalletSignTransactionError(msg)

        const publicKey = new PublicKey(data.publicKey)

        transaction.addSignature(publicKey, Buffer.from(bs58.decode(data.signature)))
        return transaction
      } catch (error: any) {
        if (error instanceof WalletError) throw error
        throw new WalletSignTransactionError(error?.message, error)
      }
    } catch (error: any) {
      this.emit('error', error)
      throw error
    }
  }

  async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    try {
      const wallet = this._wallet
      if (!wallet) throw new WalletNotConnectedError()

      try {
        const messages = transactions.map(transaction => bs58.encode(transaction.serializeMessage()))
        const { msg, data } = await wallet.signAllTransactions(messages)

        const length = transactions.length
        if (!data.publicKey || data.signatures?.length !== length) throw new WalletSignTransactionError(msg)

        const publicKey = new PublicKey(data.publicKey)

        for (let i = 0; i < length; i++) {
          transactions[i].addSignature(publicKey, Buffer.from(bs58.decode(data.signatures[i])))
        }

        return transactions
      } catch (error: any) {
        if (error instanceof WalletError) throw error
        throw new WalletSignTransactionError(error?.message, error)
      }
    } catch (error: any) {
      this.emit('error', error)
      throw error
    }
  }

}
