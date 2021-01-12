import { Bcrypt } from './util/Bcrypt'
import { Transaction } from './Transaction'

export class Block {
  public timestamp: number
  public transactions: Array<Transaction>
  public previousHash: string
  public hash: string
  private nonce: number

  /**
   * @param timestamp
   * @param transactions
   * @param previousHash
   */
  constructor (timestamp: number, transactions: Array<Transaction>, previousHash = '') {
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  /**
   * 通过存储在当前区块的交易，计算当前区块的SHA256值
   * @returns {string}
   */
  calculateHash (): string {
    return Bcrypt.SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
  }

  /**
   * 挖矿的过程，不断修改nonce随机数，直到产生的hash值符合工作量证明
   * Starts the mining process on the block. It changes the 'nonce' until the hash
   * of the block starts with enough zeros (= difficulty)
   * @param {number} difficulty
   */
  mineBlock (difficulty: number) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++
      this.hash = this.calculateHash()
    }
    console.log(`Block mined: ${this.hash}`)
  }

  /**
   * 校验区块内的交易是否有效（签名+hash）
   * Validates all the transactions inside this block (signature + hash) and
   * returns true if everything checks out. False if the block is invalid.
   * @returns {boolean}
   */
  hasValidTransactions () {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false
      }
    }
    return true
  }
}
