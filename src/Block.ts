import { Bcrypt } from "./util/Bcrypt"
import { Transaction } from "./Transaction"

export class Block {
  timestamp: number
  transactions: any
  previousHash: string
  hash: string
  nonce: number

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
   * Returns the SHA256 of this block (by processing all the data stored
   * inside this block)
   *
   * @returns {string}
   */
  calculateHash () {
    return Bcrypt.SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
  }

  /**
   * Starts the mining process on the block. It changes the 'nonce' until the hash
   * of the block starts with enough zeros (= difficulty)
   *
   * @param {number} difficulty
   */
  mineBlock (difficulty: number) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++
      this.hash = this.calculateHash()
    }
    console.log("BLOCK MINED: " + this.hash)
  }

  /**
   * Validates all the transactions inside this block (signature + hash) and
   * returns true if everything checks out. False if the block is invalid.
   *
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
