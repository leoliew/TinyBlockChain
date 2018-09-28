import {Bcrypt} from './lib/Bcrypt'

class Block {
  protected index: string
  protected timestamp: number
  protected data: string
  protected previousHash: string
  protected hash: string

  constructor (index: string, timestamp: number, data: string, previousHash: string) {
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
