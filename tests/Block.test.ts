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
    it('正确计算区块SHA256的值', function () {
      blockObj.timestamp = 1
      blockObj.mineBlock(1)
      expect(blockObj.hash).toBe('07d2992ddfcb8d538075fea2a6a33e7fb546c18038ae1a8c0214067ed66dc393')
    })

    it('篡改区块数据会导致hash值不一致', function () {
      const origHash = blockObj.calculateHash()
      blockObj.timestamp = 100
      expect(blockObj.calculateHash()).not.toBe(origHash)
    })
  })

  describe('区块内的交易数据有效', function () {
    it('区块内的交易有效，返回true', function () {
      blockObj.transactions = [
        createSignedTx(),
        createSignedTx(),
        createSignedTx()
      ]
      expect(blockObj.hasValidTransactions()).toBe(true)
    })

    it('修改交易，有效性校验为false', function () {
      const badTx = createSignedTx()
      badTx.amount = 1337
      blockObj.transactions = [
        createSignedTx(),
        badTx
      ]
      expect(blockObj.hasValidTransactions()).toBe(false)
    })
  })
})
