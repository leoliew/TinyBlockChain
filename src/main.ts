import { Bcrypt } from './lib/Bcrypt'

interface IBlock {
  // index: number
  timestamp: number
  transactions: string
  previousHash: string
  hash: string
  nonce: number

  calculateHash? (): string

  mineBlock? (difficulty: number): void
}


class Transaction {
  fromAddress: string
  toAddress: string
  amount: number

  constructor (fromAddress: string, toAddress: string, amount: number) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
  }
}

class Block implements IBlock {
  // index: number
  timestamp: number
  transactions: string
  previousHash: string
  hash: string
  nonce: number


  constructor (timestamp: number, transactions: string, previousHash: string) {
    // this.index = index
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  calculateHash () {

    return Bcrypt.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
  }


  mineBlock (difficulty: number) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++
      this.hash = this.calculateHash()
    }
    console.log("BLOCK MINED: " + this.hash)
  }
}

class BlockChain {
  chain: Array<IBlock>
  pendingTransactions: Array<Transaction>
  difficulty: number
  miningReward: number

  constructor () {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 1
    this.pendingTransactions  = []
    this.miningReward = 100
  }

  createGenesisBlock () {
    return new Block(new Date().getTime(), "Genesis block", "0")
  }

  getLatestBlock () {
    return this.chain[this.chain.length - 1]
  }

  addBlock (newBlock: IBlock) {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.mineBlock(this.difficulty)
    newBlock.hash = newBlock.calculateHash()
    this.chain.push(newBlock)
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
    }
    return true
  }

}

export {
  Block,
  BlockChain
}
