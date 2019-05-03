import { Bcrypt } from './lib/Bcrypt'
import { ec as EC } from 'elliptic'

const ec = new EC('secp256k1')

interface IBlock {
  timestamp: number
  transactions: any
  previousHash: string
  hash: string
  nonce: number

  calculateHash? (): string

  mineBlock? (difficulty: number): void

  hasValidTransactions? (): boolean
}


class Transaction {
  fromAddress: string
  toAddress: string
  amount: number
  signature: string

  constructor (fromAddress: string, toAddress: string, amount: number) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
  }

  calculateHash () {
    return Bcrypt.SHA256(this.fromAddress + this.toAddress + this.amount).toString()
  }

  signTransaction (signingKey: any) {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets!')
    }
    const hashTx = this.calculateHash()
    const sig = signingKey.sign(hashTx, 'base64')
    this.signature = sig.toDER('hex')
  }

  isValid () {
    if (this.fromAddress === null) {
      return true
    }
    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction')
    }
    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
    return publicKey.verify(this.calculateHash(), this.signature)
  }
}

class Block implements IBlock {
  timestamp: number
  transactions: any
  previousHash: string
  hash: string
  nonce: number


  constructor (timestamp: number, transactions: any, previousHash = '') {
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  calculateHash () {
    return Bcrypt.SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
  }


  mineBlock (difficulty: number) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++
      this.hash = this.calculateHash()
    }
    console.log("BLOCK MINED: " + this.hash)
  }

  hasValidTransactions () {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false
      }
    }
    return true
  }
}

class BlockChain {
  chain: Array<IBlock>
  difficulty: number
  pendingTransactions: Array<Transaction>
  miningReward: number

  constructor () {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 1
    this.pendingTransactions = []
    this.miningReward = 100
  }

  createGenesisBlock () {
    return new Block(new Date().getTime(), "Genesis block", "0")
  }

  getLatestBlock () {
    return this.chain[this.chain.length - 1]
  }

  // addBlock (newBlock: IBlock) {
  //   newBlock.previousHash = this.getLatestBlock().hash
  //   newBlock.mineBlock(this.difficulty)
  //   newBlock.hash = newBlock.calculateHash()
  //   this.chain.push(newBlock)
  // }

  minePendingTransactions (miningRewardAddress: string) {
    let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
    block.mineBlock(this.difficulty)

    console.log('Block successfully mined!')
    this.chain.push(block)

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ]

  }

  addTransaction (transaction: Transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address')
    }
    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to chain')
    }
    this.pendingTransactions.push(transaction)
  }


  getBalanceOfAddress (address: string) {
    let balance = 0
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount
        }
        if (trans.toAddress === address) {
          balance += trans.amount
        }
      }
    }
    return balance
  }

  isChainValid () {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
      if (!currentBlock.hasValidTransactions()) {
        return false
      }
    }
    return true
  }

}

export {
  Block,
  BlockChain,
  Transaction
}
