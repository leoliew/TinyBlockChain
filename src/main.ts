import { Bcrypt } from './lib/Bcrypt'

interface IBlock {
  index: number
  timestamp: number
  data: string
  previousHash: string
  hash: string

  calculateHash? (): string
}

class Block implements IBlock{
   index: number
   timestamp: number
   data: string
   previousHash: string
   hash: string

  constructor (index: number, timestamp: number, data: string, previousHash: string) {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.hash = this.calculateHash()
  }

  calculateHash () {

    return Bcrypt.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data))
  }
}

class BlockChain {
  chain: Array<IBlock>

  constructor () {
    this.chain = [this.createGenesisBlock()]
  }

  createGenesisBlock () {
    return new Block(0, new Date().getTime(), "Genesis block", "0")
  }

  getLatestBlock () {
    return this.chain[this.chain.length - 1]
  }

  addBlock (newBlock: IBlock) {
    newBlock.previousHash = this.getLatestBlock().hash
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
