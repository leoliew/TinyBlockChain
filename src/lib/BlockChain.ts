import { Block } from "./Block"
import { Transaction } from "./Transaction"

export class BlockChain {
  chain: Array<Block>
  difficulty: number
  pendingTransactions: Transaction[]
  miningReward: number

  constructor () {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 1
    this.pendingTransactions = []
    this.miningReward = 100
  }

  createGenesisBlock () {
    return new Block(new Date().getTime(), [], "0")
  }

  getLatestBlock () {
    return this.chain[this.chain.length - 1]
  }

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
