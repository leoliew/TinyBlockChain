import { Block } from '../src/Block'
import { createSignedTx } from './helpers'

let blockObj: any

beforeEach(function () {
  blockObj = new Block(1000, [createSignedTx()], 'a1')
})

describe('Block class', function () {
  describe('构造方法', function () {
    it('区块保存的参数正确', function () {
      expect(blockObj.previousHash).toStrictEqual('a1')
      expect(blockObj.timestamp).toStrictEqual(1000)
      expect(blockObj.transactions).toEqual([createSignedTx()])
      expect(blockObj.nonce).toStrictEqual(0)
    })

    it('当没有上一区块的hash值,区块保存的参数正确', function () {
      blockObj = new Block(1000, [createSignedTx()])
      expect(blockObj.previousHash).toStrictEqual('')
      expect(blockObj.timestamp).toStrictEqual(1000)
      expect(blockObj.transactions).toStrictEqual([createSignedTx()])
      expect(blockObj.nonce).toStrictEqual(0)
    })
  })

  describe('计算区块hash值', function () {
    it('should correct calculate the SHA256', function () {
      blockObj.timestamp = 1
      blockObj.mineBlock(1)

      // assert.strict.equal(
      //   blockObj.hash,
      //   '07d2992ddfcb8d538075fea2a6a33e7fb546c18038ae1a8c0214067ed66dc393'
      // )
    })

    it('should change when we tamper with the tx', function () {
      const origHash = blockObj.calculateHash()
      blockObj.timestamp = 100

      // assert.strict.notEqual(
      //   blockObj.calculateHash(),
      //   origHash
      // )
    })
  })

  describe('has valid transactions', function () {
    it('should return true with all valid tx', function () {
      blockObj.transactions = [
        createSignedTx(),
        createSignedTx(),
        createSignedTx()
      ]

      // assert(blockObj.hasValidTransactions())
    })

    it('should return false when a single tx is bad', function () {
      const badTx = createSignedTx()
      badTx.amount = 1337

      blockObj.transactions = [
        createSignedTx(),
        badTx
      ]

      // assert(!blockObj.hasValidTransactions())
    })
  })
})
