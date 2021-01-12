import { Blockchain } from '../src/Blockchain'
import { createSignedTx, signingKey, createBlockchainWithTx, createBCWithMined } from './helpers'

let blockchain: any

beforeEach(function () {
  blockchain = new Blockchain()
})

describe('Blockchain class', function () {
  describe('构造方法', function () {
    it('可以正确初始化字段', function () {
      expect(blockchain.difficulty).toBe(1)
      expect(blockchain.pendingTransactions).toEqual([])
      expect(blockchain.miningReward).toBe(100)
    })
  })

  describe('添加交易流水', function () {
    it('可以往区块链中添加新的交易流水', function () {
      const blockchain = createBCWithMined()
      const validTx = createSignedTx()
      blockchain.addTransaction(validTx)
      expect(blockchain.pendingTransactions[0]).toEqual(validTx)
    })

    it('交易fromAddress为空不能添加到区块', function () {
      const validTx = createSignedTx()
      validTx.fromAddress = null
      expect(() => {blockchain.addTransaction(validTx)}).toThrow(Error)
    })

    it('交易toAddress为空不能添加到区块', function () {
      const validTx = createSignedTx()
      validTx.toAddress = null
      expect(() => {blockchain.addTransaction(validTx)}).toThrow(Error)
    })

    it('交易被篡改不能添加到区块', function () {
      const validTx = createSignedTx()
      validTx.amount = 1000
      expect(() => {blockchain.addTransaction(validTx)}).toThrow(Error)
    })

    it('交易金额为0或负数不能添加到区块', function () {
      const tx1 = createSignedTx(0)
      expect(() => {blockchain.addTransaction(tx1)}).toThrow(Error)
      const tx2 = createSignedTx(-20)
      expect(() => {blockchain.addTransaction(tx2)}).toThrow(Error)
    })

    it('交易没有足够的金额不能添加到区块', function () {
      const tx1 = createSignedTx()
      expect(() => {blockchain.addTransaction(tx1)}).toThrow(Error)
    })
  })

  describe('钱包（地址）余额', function () {
    it('挖矿成功后可以获得奖励', function () {
      const blockchain = createBCWithMined()
      const validTx = createSignedTx()
      blockchain.addTransaction(validTx)
      blockchain.addTransaction(validTx)
      blockchain.minePendingTransactions('b2')
      expect(blockchain.getBalanceOfAddress('b2')).toBe(100)
    })

    it('钱包余额减少计算正确', function () {
      const walletAddr = signingKey.getPublic('hex')
      const blockchain = createBlockchainWithTx()
      blockchain.minePendingTransactions(walletAddr)
      expect(blockchain.getBalanceOfAddress(walletAddr)).toBe(180)
    })
  })

  describe('辅助功能', function () {
    it('区块链可以正确生成创世区块', function () {
      expect(blockchain.chain[0]).toEqual(blockchain.createGenesisBlock())
    })
  })

  describe('区块链校验', function () {
    it('在没有被篡改的情况下校验正确', function () {
      const blockchain = createBlockchainWithTx()
      expect(blockchain.isChainValid()).toBe(true)
    })

    it('在创世区块被篡改的情况下校验出错误', function () {
      blockchain.chain[0].timestamp = 39708
      expect(blockchain.isChainValid()).toBe(false)
    })

    it('在区块内交易被篡改的情况下校验出错误', function () {
      const blockchain = createBlockchainWithTx()
      blockchain.chain[2].transactions[1].amount = 897397
      expect(blockchain.isChainValid()).toBe(false)
    })

    it('在区块被篡改的情况下校验出错误', function () {
      const blockchain = createBlockchainWithTx()
      blockchain.chain[1].timestamp = 897397
      expect(blockchain.isChainValid()).toBe(false)
    })
  })

  describe('获取地址（钱包）所有的交易流水', function () {
    it('可以获取钱包所有的交易', function () {
      const blockchain = createBCWithMined()
      const validTx = createSignedTx()
      blockchain.addTransaction(validTx)
      blockchain.addTransaction(validTx)
      blockchain.minePendingTransactions('b2')
      blockchain.addTransaction(validTx)
      blockchain.addTransaction(validTx)
      blockchain.minePendingTransactions('b2')
      expect(blockchain.getAllTransactionsForWallet('b2').length).toBe(2)
      expect(blockchain.getAllTransactionsForWallet(signingKey.getPublic('hex')).length).toBe(5)
      for (const trans of blockchain.getAllTransactionsForWallet('b2')) {
        expect(trans.amount).toBe(100)
        expect(trans.fromAddress).toBe(null)
        expect(trans.toAddress).toBe('b2')
      }
    })
  })
})
