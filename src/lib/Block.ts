import { Bcrypt } from "./Bcrypt"
import { Transaction } from "./Transaction"

export class Block {
  timestamp: number
  transactions: any
  previousHash: string
  hash: string
  nonce: number


  constructor (timestamp: number, transactions: Array<Transaction>, previousHash = '') {
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
