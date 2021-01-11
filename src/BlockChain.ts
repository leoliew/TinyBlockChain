import { Block } from './Block'
import { Transaction } from './Transaction'

export class BlockChain {
  public chain: Array<Block>
  private pendingTransactions: Transaction[]
  private readonly difficulty = 1
  private readonly miningReward = 100

  constructor () {
    this.chain = [this.createGenesisBlock()]
    this.pendingTransactions = []
  }

  /**
   * 生成创世区块
   * @returns {Block}
   */
  createGenesisBlock () {
    return new Block(Date.parse('2021-01-01'), [], '0')
  }

  /**
   * Returns the latest block on our chain. Useful when you want to create a
   * new Block and you need the hash of the previous Block.
   * @returns {Block[]}
   */
  getLatestBlock () {
    return this.chain[this.chain.length - 1]
  }

  /**
   * 1.接收所有待处理的交易，将其放入"Block"
   * 2.然后开始挖掘
   * 3.添加了一个奖励地址以将采矿奖励发送到给定地址（有记账权则有奖励权）
   * @param {string} miningRewardAddress
   */
  minePendingTransactions (miningRewardAddress: string) {
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward)
    this.pendingTransactions.push(rewardTx)
    let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
    block.mineBlock(this.difficulty)
    console.log('Block successfully mined!')
    this.chain.push(block)
    this.pendingTransactions = []
  }

  /**
   * Add a new transaction to the list of pending transactions (to be added
   * next time the mining process starts). This verifies that the given
   * transaction is properly signed.
   * @param {Transaction} transaction
   */
  addTransaction (transaction: Transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address')
    }
    // Verify the transactiion
    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to chain')
    }
    if (transaction.amount <= 0) {
      throw new Error('Transaction amount should be higher than 0')
    }
    // Making sure that the amount sent is not greater than existing balance
    if (this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount) {
      throw new Error('Not enough balance')
    }
    this.pendingTransactions.push(transaction)
    console.debug(`transaction added: ${transaction}`)
  }

  /**
   * Returns the balance of a given wallet address.
   * @param {string} address
   * @returns {number} The balance of the wallet
   */
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
    console.debug(`address: ${address}, balance: ${balance}`)
    return balance
  }

  /**
   * Returns a list of all transactions that happened
   * to and from the given wallet address.
   * @param  {string} address
   * @return {Transaction[]}
   */
  getAllTransactionsForWallet (address: string) {
    const txs = []
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address || tx.toAddress === address) {
          txs.push(tx)
        }
      }
    }
    console.debug(`get transactions for wallet count: ${txs.length}`,)
    return txs
  }

  /**
   * 校验创世区块
   * Loops over all the blocks in the chain and verify if they are properly
   * linked together and nobody has tampered with the hashes. By checking
   * the blocks it also verifies the (signed) transactions inside of them.
   * @returns {boolean}
   */
  isChainValid () {
    // Check if the Genesis block hasn't been tampered with by comparing
    // the output of createGenesisBlock with the first block on our chain
    const realGenesis = JSON.stringify(this.createGenesisBlock())
    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false
    }
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      if (!currentBlock.hasValidTransactions()) {
        return false
      }
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }
    }
    return true
  }
}
